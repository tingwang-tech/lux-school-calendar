# CLAUDE.md — Lux School Calendar

## What this project is

A calendar alert system for international families in Luxembourg. Parents select the schools they want to follow and receive `.ics` calendar invites by email whenever new dates are announced — open days, enrollment windows, or school holidays.

This solves a real gap: sites like atschool.lu publish dates passively. This product pushes those dates directly into parents' calendars.

## Target audience

International families with children aged 3–6 in Luxembourg City who don't speak Luxembourgish at home and are navigating their first school decision.

## The core loop

```
Monitor sources → Detect new dates → Match to subscribers → Send .ics calendar invite by email
```

## Date types tracked

1. **Open days** — school visit events (primary source: atschool.lu)
2. **Enrollment / application windows** — deadlines to apply
3. **School holidays** — academic calendar

## How it works for a parent

1. Go to the signup page
2. Enter email
3. Select schools they want to follow
4. Receive `.ics` calendar invites as new dates are announced — lands directly in Google/Apple/Outlook calendar

No account, no login required in v1.

## Stack

- **Next.js** — frontend + API routes, hosted on Vercel
- **Vercel cron jobs** — scheduled scraper (runs weekly)
- **Airtable** — stores schools, dates, parent subscriptions
- **Resend** — sends emails with `.ics` attachments

Target infrastructure cost: under €20/year.

## Data sources

- https://atschool.lu/en/international-schools-open-days-2025/ — primary source for open days
- Individual school websites — for enrollment windows and holidays

## What is out of scope for v1

- Parent login / accounts
- School reviews or ratings
- Comparison tables
- French language support
- Automated Airtable updates (data is manually verified before sending)
- Direct enrollment services

## Key decisions already made

- Delivery format is `.ics` (calendar invite), not a push notification or app — works for everyone, no install required
- No login for v1 — email + school selection is enough
- Airtable as the editable data layer — non-technical maintenance
- Weekly scraping cadence is sufficient (open days are announced weeks/months ahead)

## Related project

`lux-school` (https://github.com/tingwang-tech/lux-school) — a separate decision-guide for families who don't yet know which school system to choose. This calendar project assumes the parent already knows their shortlist.
