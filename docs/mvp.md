# MVP — Lux School Calendar

## One-line pitch

"Never miss an open day or enrollment deadline at Luxembourg international schools."

## Problem

International families in Luxembourg track school dates manually: bookmarking pages, checking back, hoping they don't miss an announcement. We are not aware of any unified subscription service that automatically sends calendar invites for school dates across multiple Luxembourg international schools.

atschool.lu publishes helpful current-year lists of open days, but they are static web pages that parents must check themselves.

## Solution

A browsable calendar of school dates that parents can explore and add to their own calendar in one click. Once they see the value, they can subscribe to receive new dates automatically by email.

## User flow

**Step 1 — Land on the site**
Parent sees upcoming school events immediately — no signup required.

**Step 2 — Filter**
- School type first: International or Local (Luxembourgish)
- Then school: pick from list filtered by type
- Then event type: auto-filtered by school type
  - International: open days, enrollment windows, school holidays
  - Local: school holidays only (enrollment is via commune, not school visits)

**Step 3 — Browse event widgets**
Each card shows: school, event type, date, time, location, source link.
Only events within the current school year are shown (Sept–July, rolling each September). Past events within that window are grayed out and non-clickable. Future events have an "Add to Calendar" button — downloads the `.ics`, no email required. Events before the current school year are not shown.

**Step 4 — Feedback prompt**
Below the events: "Tell us what you'd want more of." Free-text input + Submit.
Submissions go to operator email (tzutingtw@gmail.com) via Resend.
No account or subscription needed to submit.

**Step 5 (V2) — Email subscription**
Paid tier. Parents subscribe to receive new dates automatically as they are announced.

## Date types

**P0 — launch with these:**
- Open days (primary discovery moment for parents)
- Enrollment / application deadlines (highest stakes — miss it, wait a year)
- School holidays (sourced from MEN, relevant to all families)

**P1 — add after launch:**
- Term start and end dates
- Orientation / welcome days
- Waiting list opening dates
- Luxembourg national public holidays

## Out of scope for v1

- Email subscriptions (V2)
- Parent login or accounts
- School search or comparison
- Reviews or ratings
- French language support
- Direct enrollment services

## Data sources

- https://atschool.lu/en/international-schools-open-days-2025/
- https://men.public.lu/en/vacances-scolaires.html (official school holidays)
- Individual school websites (manually verified before publishing)

## Data maintenance

School data and dates live in Airtable. A human verifies accuracy before any event is published. Each event stores source URL and last-verified date. Events are published manually — no automated publishing in v1.

## Design decisions

- **Style**: Warm minimal — off-white background, purple accents, soft borders
- **Event window**: Current school year only (Sept–July). No all-time history.
- **Past events**: Grayed out + non-clickable within the current year window
- **Feedback tool**: Formspree — zero code, form posts directly to operator email
- **Email delivery (V2)**: Resend — transactional, supports `.ics` attachments natively

## Stack

- Next.js on Vercel (frontend + API routes)
- Vercel cron (weekly scraper — detects new events, writes to Airtable as draft)
- Airtable (schools, events, feedback log)
- Resend (feedback email forwarding to operator; `.ics` delivery in V2)

**Why Resend over Brevo:** This product sends transactional emails (event-triggered `.ics` invites), not marketing newsletters. Resend is purpose-built for transactional sends from Next.js, supports `.ics` attachments natively, and keeps the integration simple. Brevo's strength is bulk marketing and CRM — not needed here.

## Pilot success measures

- 20+ visitors browse the event calendar
- 10+ feedback submissions received
- "Add to Calendar" used at least once per event card
- Zero wrong dates published (our system's responsibility; source changes are out of scope)
- Clear signal from feedback on what parents want next

## Risk & compliance (v1)

**Data protection (GDPR / CNPD)**
Feedback submissions collect free-text only — no email address required unless the parent chooses to include one. No personal data stored beyond what parents voluntarily write. When V2 email subscription is added, explicit consent, unsubscribe, and CNPD rights handling will be required.

**Accuracy and liability**
All dates are derived from public sources with human verification before publishing. Every event card and `.ics` description includes: "Informational — always confirm on the school's official site."

**Content reuse / intellectual property**
We reuse only factual event data (date, time, type, source link). We do not republish article text or bulk-copy restricted content. Source link is always shown on the card.

**Positioning vs schools**
We are not affiliated with or endorsed by any listed school. Site copy states this explicitly.

**Operational assumptions**
Weekly scraping cadence is a v1 assumption. We will revisit if sources update more frequently or if parents report missed dates.
