#!/usr/bin/env python3
"""Research-only public artist email enrichment. Never sends messages.

Input is an Apify *profile* enrichment JSON (not a following-list export),
plus optionally an independently confirmed official artist HTTPS site.
No contact data should be committed to the public repository.
"""
import argparse
import ipaddress
import json
import re
import time
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urljoin, urlsplit, urldefrag
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

AGENT = 'RebornaDiscovery/0.1 (+https://reborna.co; public artist research)'
EMAIL = re.compile(r'(?<![\w.+-])([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24})(?![\w.-])', re.I)
CONTACT = re.compile(r'contact|about|impressum|kontakt|contatto|contacto|support|enquir|inquir', re.I)
PLACEHOLDERS = {'example.com', 'example.org', 'example.net', 'test.com'}
MAX_BYTES = 900_000


def valid_email(value):
    if not isinstance(value, str):
        return None
    match = EMAIL.search(unquote(value))
    if not match:
        return None
    email = match.group(1).lower()
    if email.rsplit('@', 1)[-1] in PLACEHOLDERS or email.startswith(('noreply@', 'no-reply@', 'donotreply@')):
        return None
    return email


def extract_emails(text):
    return sorted(set(filter(None, [valid_email(e) for e in EMAIL.findall(text or '')])))


def safe_url(raw):
    try:
        if not isinstance(raw, str):
            return None
        value = urldefrag(raw.strip())[0]
        part = urlsplit(value)
        if part.scheme != 'https' or not part.hostname or part.username or part.password or part.port not in (None, 443):
            return None
        host = part.hostname.lower().rstrip('.')
        if host == 'localhost' or host.endswith(('.localhost', '.local', '.internal')) or '.' not in host:
            return None
        try:
            if not ipaddress.ip_address(host).is_global:
                return None
        except ValueError:
            pass
        return value
    except ValueError:
        return None


class PublicPage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.mailto, self.links, self.visible = [], [], []
        self.ignore = 0

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'noscript', 'svg'):
            self.ignore += 1
        if tag == 'a':
            href = dict(attrs).get('href', '')
            if href.lower().startswith('mailto:'):
                email = valid_email(href[7:].split('?', 1)[0])
                if email:
                    self.mailto.append(email)
            elif href:
                self.links.append(href)

    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'svg') and self.ignore:
            self.ignore -= 1

    def handle_data(self, text):
        if not self.ignore:
            self.visible.append(text)


def bio_links(record):
    urls = []
    for key in ('externalUrl', 'external_url', 'website', 'website_url', 'bio_url',
                'externalUrls', 'external_urls', 'bioLinks', 'bio_links', 'links'):
        value = record.get(key)
        if isinstance(value, str):
            urls.append(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, str):
                    urls.append(item)
                elif isinstance(item, dict):
                    urls.extend(item[k] for k in ('url', 'href', 'link') if isinstance(item.get(k), str))
    return list(dict.fromkeys(filter(None, map(safe_url, urls))))[:30]


def enrich_profile(record, expected_handle=None):
    handle = str(record.get('username') or record.get('userName') or record.get('handle') or '').lower().lstrip('@')
    if not re.fullmatch(r'[a-z0-9._]{1,30}', handle) or expected_handle and handle != expected_handle.lower().lstrip('@'):
        raise ValueError('Invalid or mismatched Instagram username')
    profile = 'https://www.instagram.com/' + handle + '/'
    result = {'handle': handle, 'instagram_url': profile, 'biography': '', 'bio_links': [],
              'contacts': [], 'skipped_private': False}
    if record.get('isPrivate', record.get('is_private')) in (True, 'true', 'True', 1):
        result['skipped_private'] = True
        return result
    bio = str(record.get('biography') or record.get('bio') or '')[:4000]
    result['biography'] = bio
    result['bio_links'] = bio_links(record)

    def add(raw, kind):
        email = valid_email(raw)
        if email and not any(x['email'] == email and x['source_kind'] == kind for x in result['contacts']):
            result['contacts'].append({'email': email, 'source_kind': kind,
                                       'source_url': profile, 'review_status': 'pending'})
    for email in extract_emails(bio):
        add(email, 'instagram_bio')
    for field in ('business_email', 'businessEmail', 'public_email', 'publicEmail'):
        add(record.get(field), 'instagram_public_business_contact_reported')
    emails = record.get('emails') or []
    if isinstance(emails, str):
        emails = [emails]
    if isinstance(emails, list):
        for email in emails:
            add(email, 'profile_provider_unverified')
    # A scraper's generic email might originate on a different website.
    add(record.get('email'), 'profile_provider_unverified')
    return result


def scan_official_site(website, max_pages=6, delay=1):
    start = safe_url(website)
    if not start:
        raise ValueError('Expected an approved, public HTTPS artist website')
    host = urlsplit(start).hostname
    robots = RobotFileParser()
    robots.set_url('https://' + host + '/robots.txt')
    try:
        robots.read()
    except Exception as exc:
        raise RuntimeError('robots.txt unavailable; refusing contact scan') from exc
    if not robots.can_fetch(AGENT, start):
        raise RuntimeError('robots.txt disallows site scan')
    queue = [start]
    for path in ('/contact', '/contact-us', '/about', '/pages/contact', '/pages/contact-us'):
        candidate = safe_url(urljoin(start, path))
        if candidate and urlsplit(candidate).hostname == host and candidate not in queue:
            queue.append(candidate)
    seen, scanned, contacts, errors = set(), [], [], []
    while queue and len(scanned) < max_pages:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        if not robots.can_fetch(AGENT, url):
            errors.append({'url': url, 'reason': 'robots_disallowed'})
            continue
        try:
            with urlopen(Request(url, headers={'User-Agent': AGENT, 'Accept': 'text/html'}), timeout=13) as resp:
                actual = resp.geturl()
                if not safe_url(actual) or urlsplit(actual).hostname != host:
                    raise ValueError('Redirect off approved artist host')
                if 'text/html' not in resp.headers.get('Content-Type', '').lower():
                    continue
                raw = resp.read(MAX_BYTES + 1)
                if len(raw) > MAX_BYTES:
                    raise ValueError('Page exceeds size limit')
                parser = PublicPage()
                parser.feed(raw.decode(resp.headers.get_content_charset() or 'utf-8', 'replace'))
                scanned.append(actual)
                for email, kind in ([ (e, 'official_site_mailto') for e in parser.mailto ]
                                    + [ (e, 'official_site_visible_text') for e in extract_emails(' '.join(parser.visible)) ]):
                    contact = {'email': email, 'source_kind': kind, 'source_url': actual, 'review_status': 'pending'}
                    if contact not in contacts:
                        contacts.append(contact)
                for href in parser.links:
                    link = safe_url(urljoin(actual, href))
                    if link and urlsplit(link).hostname == host and CONTACT.search(urlsplit(link).path or '') and link not in seen and link not in queue:
                        queue.insert(0, link)
        except (HTTPError, URLError, TimeoutError, ValueError, UnicodeError) as exc:
            errors.append({'url': url, 'reason': type(exc).__name__})
        time.sleep(delay)
    return {'website': start, 'pages_scanned': scanned, 'contacts': contacts, 'errors': errors}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--profile-json', help='Private Apify profile record or list of records')
    ap.add_argument('--handle', help='Instagram username; required for multiple records')
    ap.add_argument('--website', help='Official HTTPS site, independently confirmed before scanning')
    ap.add_argument('--max-pages', type=int, default=6)
    ap.add_argument('--delay', type=float, default=1.0)
    ap.add_argument('--out', help='Private output JSON; omitted prints to stdout')
    args = ap.parse_args()
    if not 1 <= args.max_pages <= 8 or args.delay < 1:
        ap.error('--max-pages must be 1-8 and --delay at least 1 second')
    if not args.profile_json and not (args.handle and args.website):
        ap.error('Provide --profile-json or both --handle and --website')
    if args.profile_json:
        records = json.loads(Path(args.profile_json).read_text(encoding='utf-8'))
        if isinstance(records, dict):
            records = records.get('items', [records])
        if not isinstance(records, list):
            ap.error('Profile JSON must be one record or a list')
        selected = [r for r in records if isinstance(r, dict) and
                    (not args.handle or str(r.get('username') or r.get('userName') or '').lower() == args.handle.lower().lstrip('@'))]
        if len(selected) != 1:
            ap.error('Expected one matching profile, found ' + str(len(selected)))
        result = enrich_profile(selected[0], args.handle)
    else:
        handle = args.handle.lower().lstrip('@')
        if not re.fullmatch(r'[a-z0-9._]{1,30}', handle):
            ap.error('Invalid Instagram handle')
        result = {'handle': handle, 'instagram_url': 'https://www.instagram.com/'+handle+'/',
                  'biography': '', 'bio_links': [], 'contacts': [], 'skipped_private': False}
    if args.website and not result['skipped_private']:
        site = scan_official_site(args.website, args.max_pages, args.delay)
        result['site_evidence'] = site
        result['contacts'].extend(site['contacts'])
    result['note'] = 'Private research evidence. Artist identity, email ownership and outreach suitability require review. No messages sent.'
    payload = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.out:
        output = Path(args.out)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(payload, encoding='utf-8')
        print('Saved research evidence to', output)
    else:
        print(payload)


if __name__ == '__main__':
    main()
