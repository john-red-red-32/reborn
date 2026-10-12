# Reborna — industry events discovery

Planned Discover-page section: **Upcoming industry events**. Not a dedicated top-level navigation destination initially.

## Event data model
event_id; title; event_type (doll_show, reborn_convention, workshop, sculptor_appearance, collector_fair, online_event); organiser_id/name; official_event_url; start_at/end_at with IANA timezone; public venue and address; city, region, country; online/hybrid flag; admission_cost and native currency when confirmed; ticketing_url; featured artists; featured sculpts when confirmed; public promotional image and image-rights state; recurrence series ID and annual occurrence ID; status (scheduled, postponed, cancelled, completed); accessible attendance information; source URL; observation and verification timestamp; update history.

## Publication rules
Only show verified upcoming dates, with local timezone and visitor display conversions. Recurring shows are individual occurrences, never copied from last year's calendar. An annual event with no confirmed 2027 dates must not be advertised as happening in 2027. Prefer official organizer announcements and record amendments, postponements and cancellation notices. Protect rights to photos/posters.

## UI plan
A compact editorial section on the Discover homepage, below the main kit discovery: 2–4 upcoming events with date, location, organiser and View event link, plus a View all entry once data warrants a separate route. If no verified events are available, do not show fictional events or empty cards.

## Future ingestion
Maintain organisers as separate entities, scan official annual show sites for new editions, compare future occurrence date changes and identify artists participating only with explicit source evidence.
