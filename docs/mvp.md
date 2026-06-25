# MVP — Lux School Calendar

## One-line pitch

"Never miss an open day or enrollment deadline at Luxembourg international schools."

## Live

https://lux-school-calendar.vercel.app

## Problem

International families in Luxembourg track school dates manually: bookmarking pages, checking back, hoping they don't miss an announcement. We are not aware of any unified subscription service that automatically sends calendar invites for school dates across multiple Luxembourg international schools.

atschool.lu publishes helpful current-year lists of open days, but they are static web pages that parents must check themselves.

## Solution

A browsable calendar of school dates that parents can explore and add to their own calendar in one click. Once they see the value, they can subscribe to receive new dates automatically by email.

## User flow

**Step 1 — Land on the site**
Parent sees upcoming school events immediately — no signup required.

**Step 2 — Filter**
- School type first: International / European / Local public
- Then school: list filtered by type
- Then event type: auto-filtered by school type
  - International / European: open days, enrollment windows (holidays P1)
  - Local public: school holidays only (enrollment is via commune, not school visits)

**Step 3 — Browse event cards**
Each card shows: event type badge, level badge (Primary / Secondary / All levels), date or date range, school, location, source link.
- Current school year only (Sept–July, rolling each September)
- Future events: "Add to Calendar" button → Apple Calendar (.ics) or Google Calendar (web link)
- Past events within year: grayed out, non-clickable
- Events outside current school year: not shown
- Holiday periods shown as date range: e.g. "16 Jul – 14 Sep 2026"
- All .ics events marked as free (TRANSP:TRANSPARENT)
- Verification banner shown when open day or enrollment events are in view

**Step 4 — Feedback**
Below the events: "Tell us what you'd want more of." Free-text + Submit.
Submissions go to tzutingtw@gmail.com via Formspree (form ID: mbdvgwre).
No account needed to submit.

**Step 5 (V2) — Paid email subscription**
Parents subscribe to receive new dates automatically as announced. Resend handles .ics delivery.

## School types and event rules

| Type | Event types shown | Notes |
|---|---|---|
| International | Open days, enrollment | Holidays P1 — not yet verified per school |
| European | Open days, enrollment | Holidays P1 — not yet verified per school |
| Local public | School holidays only | MEN-verified, authoritative |

## Primary school focus

- Primary level events: highlighted with purple badge, full "Add to Calendar" button
- Secondary level events: grey badge, visible but not interactive (sets expectation)
- Both/All levels: shown as primary (covers primary audience)

## Date types

**P0 — live:**
- Open days (primary school focus; secondary shown as coming soon)
- Enrollment / application deadlines
- School holidays (local public only — MEN calendar)

**P1 — after launch:**
- International and European school holidays (need per-school verification)
- Term start/end dates
- Orientation / welcome days
- Waiting list opening dates
- Luxembourg national public holidays

## Schools

**International (11):**
ISL Luxembourg, St George's International School, OTR International School, Vauban – Lycée Français de Luxembourg, Lycée – International School Michel Lucius, Ecole internationale Gaston Thorn, Lënster Lycée International School, École Internationale Anne Beffort, École Internationale de Differdange et Esch-sur-Alzette, École Internationale de Mondorf-les-Bains, Lycée Edward Steichen (LESC)

**European (2):**
European School Luxembourg I (Kirchberg), European School Luxembourg II (Mamer)

**Local public (1):**
Local public school (commune)

## Data sources — rules

- atschool.lu is NOT used as an authoritative source
- Each event must link to the exact school page where the date appears (not the homepage)
- MEN calendar (men.public.lu/en/vacances-scolaires.html) is authoritative for local public holidays
- Every event requires a `lastVerified` date

**Verified open days in system:**
- OTR: Primary 6 Mar 2026, Secondary 6 Feb 2026, All levels 18 Apr 2026 — `otrschool.lu/open-days/`
- EIMLB: Primary 28 Feb 2026 — `eimlb.lu/fr/porte-ouverte/journee-portes-ouvertes-a-lecole-primaire/`
- LLIS: All levels 27 Feb 2026 — atschool.lu (official site cert expired)

**Pending verification (official pages not reachable):**
ISL, St George's, Michel Lucius, Vauban, Anne Beffort, Gaston Thorn, LESC, European Schools I & II

## Out of scope for V1

- Email subscriptions (V2)
- Parent login or accounts
- School search or comparison
- Reviews or ratings
- French language support
- Direct enrollment services
- Airtable integration (V1 data lives in events.ts)
- Automated scraping (V1 is fully manual)

## Design decisions

- **Style**: Warm minimal — off-white (#FDFAF6) background, purple (#534AB7) accents, soft borders
- **Event window**: Current school year only (Sept–July). No all-time history.
- **Past events**: Grayed out + non-clickable within the current year window
- **Feedback tool**: Formspree (mbdvgwre) — zero backend code
- **Calendar format**: .ics (Apple) + Google Calendar web link
- **Email delivery (V2)**: Resend — transactional, supports .ics natively

## Stack

- Next.js 16 in `/app` subdirectory
- Vercel — auto-deploys from `main`; root directory set to `app`; framework: nextjs
- Formspree mbdvgwre — feedback to tzutingtw@gmail.com
- Resend — V2 only

## Pilot success measures

- 20+ visitors browse the event calendar
- 10+ feedback submissions received
- "Add to Calendar" used at least once per event card
- Zero wrong dates published due to our system
- Clear signal from feedback on what parents want next

## Risk & compliance (V1)

**Data protection (GDPR / CNPD)**
Feedback submissions collect free-text only — no email required unless parent volunteers it. No personal data stored. V2 email subscription will require explicit consent, unsubscribe link, and CNPD rights notice.

**Accuracy and liability**
All dates verified from official school sources before publishing. Every card and .ics description states: "Informational — always confirm on the school's official site." Verification banner shown above all open day and enrollment events.

**Content reuse**
Only factual event data reused (date, time, type, source link). Source link always shown. No article text republished.

**Positioning**
Not affiliated with any listed school. Stated explicitly on site.
