#!/usr/bin/env python3
"""Read-only Reborn Artistry Alliance directory cohort and official-site platform audit.
RAA membership is a discovery lead, not proof of a produced original sculpt.
Only public pages with robots permission. No assets mirrored; no public catalog publishing.
"""
import json,re,time,urllib.robotparser,urllib.request,urllib.parse,sys
from pathlib import Path
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from site_platforms import detect_platform
ROOT='https://rebornartistryalliance.com'
URL=ROOT+'/collections/sculptors'
AGENT='RebornaDiscovery/0.1 (+https://reborna.co; public editorial provenance research)'
SKIP={'www.instagram.com','instagram.com','facebook.com','www.facebook.com','m.facebook.com','www.tiktok.com','tiktok.com','youtube.com','www.youtube.com','www.reborns.com','reborns.com','www.pinterest.com','pinterest.com','rebornartistryalliance.com','www.rebornartistryalliance.com'}
def get(url,robot=None):
  if not url.startswith('https://'):raise ValueError('https_only')
  host=urllib.parse.urlsplit(url).hostname
  if robot is None:
    robot=urllib.robotparser.RobotFileParser();robot.set_url('https://'+host+'/robots.txt');robot.read()
  if not robot.can_fetch(AGENT,url):raise PermissionError('robots_denied')
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':AGENT,'Accept':'text/html'}),timeout=18) as f:
    if urllib.parse.urlsplit(f.geturl()).hostname!=host:raise ValueError('redirect_off_host')
    if 'html' not in f.headers.get('Content-Type',''):raise ValueError('not_html')
    return f.read(2_000_000).decode('utf8','replace')
def words(x):return re.sub(r'\s+',' ',x or '').strip()
def profile(url):
  out={'raa_profile':url,'status':'not_checked','external_links':[],'site_platforms':[]}
  try:
    t=get(url);s=BeautifulSoup(t,'html.parser')
    h=s.find('h1');out['member_name']=words(h.get_text(' ',strip=True)) if h else ''
    body=words(s.get_text(' ',strip=True))
    mat=re.search(r'RAA Member\s*#\s*(\d+)',body,re.I) or re.search(r'Member\s*#\s*(\d+)',body,re.I)
    out['raa_member_number']=mat.group(1) if mat else None
    out['has_sculptor_claim']=bool(re.search(r'sculpt(?:ing|or|ure)|original.*(kit|silicone)|(?:produce|manufactur).*kit',body,re.I))
    # Shopify page may contain a prior purchased theme; keep the actual core profile text separately.
    region=body.split('Skill Level:',1)[-1].split('Find Me Online',1)[0].split('Links:',1)[0]
    out['bio_excerpt']=region[:1800]
    named=[]
    for a in s.select('a[href]'):
      href=a.get('href','')
      absurl=urllib.parse.urljoin(url,href)
      host=urllib.parse.urlsplit(absurl).hostname
      label=words(a.get_text(' ',strip=True))
      if host and host not in SKIP and host != 'rebornartistryalliance.myshopify.com' and absurl.startswith('https://'):
        if not any(item['url']==absurl for item in named):
          named.append({'label':label,'url':absurl,'host':host})
    out['external_links']=named[:25]
    out['status']='profile_sourced'
    def site(link):
      a=dict(link)
      if a['host'] in SKIP:return None
      try:
        html=get(a['url'])
        a['platform']=detect_platform(html)
        a['fetch_status']='readable'
      except Exception as e:
        a['platform']='unverified';a['fetch_status']=type(e).__name__+':'+str(e)[:70]
      return a
    with ThreadPoolExecutor(max_workers=3) as pool:
      out['site_platforms']=[v for v in pool.map(site,named[:4]) if v]
  except Exception as e:
    out['status']=type(e).__name__;out['error']=str(e)[:160]
  return out
def main():
  html=get(URL);s=BeautifulSoup(html,'html.parser')
  urls=[];seen=set()
  # Collection product links — exact directory membership is essential.
  for a in s.select('a[href*="/products/"]'):
    u=urllib.parse.urljoin(ROOT,a['href'].split('?')[0])
    if not re.match(r'https://rebornartistryalliance.com/products/[^/?#]+$',u):continue
    if u not in seen:seen.add(u);urls.append(u)
  if len(urls)!=35:raise SystemExit('Directory enumeration changed; found '+str(len(urls))+' expected 35. Do not publish partial identities.')
  results=[None]*len(urls)
  with ThreadPoolExecutor(max_workers=4) as pool:
    jobs={pool.submit(profile,u):i for i,u in enumerate(urls)}
    for job in as_completed(jobs):
      i=jobs[job];results[i]=job.result()
      print(json.dumps({'index':i+1,'name':results[i].get('member_name'),'status':results[i]['status'],'sites':results[i].get('site_platforms',[])},ensure_ascii=False)[:2300],flush=True)
  summary={}
  for row in results:
    for link in row.get('site_platforms',[]):summary[link['platform']]=summary.get(link['platform'],0)+1
  evidence={'source':URL,'directory_total':len(urls),'review_label':'RAA claims are leads; artist-level original kit identity requires independent verification','site_platform_summary':summary,'members':results}
  Path('raa-all-35-platforms-20261014.json').write_text(json.dumps(evidence,indent=2,ensure_ascii=False),encoding='utf8')
  print('TOTAL',len(results),'SOURCE_ONLY_SITE_PLATFORMS',summary,flush=True)
if __name__=='__main__':main()
