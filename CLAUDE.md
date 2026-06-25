# CLAUDE.md — Lux School Calendar

## What this project is

A browsable calendar of school dates for international families in Luxembourg. Parents explore upcoming events, add individual dates to their calendar in one click, and submit feedback on what they want next. Email subscription is V2.

This solves a real gap: sites like atschool.lu publish dates passively. This product surfaces those dates in one place and lets parents act on them immediately.

## Target audience

International families with children aged 3–6 in Luxembourg City who don't speak Luxembourgish at home and are navigating their first school decision.

## The core loop

```
Monitor sources → Detect new dates → Human verifies → Publish to site → Parent adds to calendar
```

## Date types tracked

**P0 (launch):**
1. **Open days** — school visit events (primary source: atschool.lu)
2. **Enrollment / application windows** — deadlines to apply
3. **School holidays** — sourced from MEN (men.public.lu)

**P1 (after launch):**
- Term start/end dates
- Orientation / welcome days
- Waiting list opening dates
- Luxembourg national public holidays

## How it works for a parent (V1)

1. Land on the site — see upcoming events immediately, no signup
2. Filter: school type (international / local) → school → event type
3. Click "Add to Calendar" on any future event — gets the `.ics` directly, no email required
4. Submit feedback: "Tell us what you'd want more of" — free text, no account needed

**V2 (paid):** parents subscribe by email to receive new dates automatically as announced.

No account, no login required in v1.

## Stack

- **Next.js** — frontend + API routes, hosted on Vercel
- **Vercel cron jobs** — weekly scraper (writes new events to Airtable as draft)
- **Airtable** — stores schools, events, feedback log
- **Resend** — forwards feedback submissions to operator email; `.ics` delivery in V2

**Why Resend over Brevo:** product sends transactional event-triggered emails, not marketing newsletters. Resend supports `.ics` attachments natively and integrates cleanly with Next.js.

Target infrastructure cost: under €20/year.

## Data sources

- https://atschool.lu/en/international-schools-open-days-2025/ — primary source for open days
- https://men.public.lu/en/vacances-scolaires.html — official school holidays
- Individual school websites — for enrollment windows (manually verified before publishing)

## What is out of scope for v1

- Email subscriptions (V2)
- Parent login / accounts
- School reviews or ratings
- Comparison tables
- French language support
- Automated Airtable publishing (human verifies before any event goes live)
- Direct enrollment services

## Key decisions already made

- Browse-first, subscribe-later: parents see value before giving any contact info
- Feedback loop before monetization: collect "what do you want more?" before charging
- Delivery format is `.ics` — works for everyone, no install required
- School type gates event types: local schools show holidays only; international schools show all types
- Airtable as the editable data layer — non-technical maintenance
- Weekly scraping cadence is a V1 assumption; revisit based on feedback

## Related project

`lux-school` (https://github.com/tingwang-tech/lux-school) — a separate decision-guide for families who don't yet know which school system to choose. This calendar project assumes the parent already knows their shortlist.
