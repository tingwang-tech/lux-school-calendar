# CLAUDE.md — Lux School Calendar

## What this project is

A browsable calendar of school dates for international families in Luxembourg. Parents explore upcoming events, add individual dates to their calendar in one click, and submit feedback on what they want next. Email subscription is V2.

This solves a real gap: sites like atschool.lu publish dates passively. This product surfaces those dates in one place and lets parents act on them immediately.

## Live URL

https://lux-school-calendar.vercel.app

## Target audience

International families with children aged 3–6 in Luxembourg City who don't speak Luxembourgish at home and are navigating their first school decision. Primary school focus — secondary is listed but marked "coming soon."

## The core loop

```
Monitor sources → Detect new dates → Human verifies → Publish to site → Parent adds to calendar
```

## School categories

Three types — the filter gates available event types:

| Type | Schools | Event types shown |
|---|---|---|
| International | ISL, St George's, OTR, Vauban, Michel Lucius, Gaston Thorn, LLIS, Anne Beffort, EIDE, EIMLB, LESC | Open days, enrollment, holidays (holidays P1) |
| European | European School I (Kirchberg), European School II (Mamer) | Open days, enrollment, holidays (holidays P1) |
| Local public | Local public school (commune) | School holidays only (MEN calendar) |

## Date types

**P0 (live):**
- Open days — primary focus; primary school level highlighted, secondary shown as "coming soon"
- Enrollment / application deadlines
- School holidays — MEN-verified for local public schools only; international/european holidays are P1

**P1 (after launch):**
- International and European school holidays (need per-school verification)
- Term start/end dates
- Orientation / welcome days
- Waiting list opening dates
- Luxembourg national public holidays

## How it works for a parent (V1)

1. Land on the site — see upcoming events immediately, no signup
2. Filter: school type → school → event type
3. Browse event cards: future events show "Add to Calendar" (Apple or Google), past events grayed
4. Holiday periods shown as date range (e.g. "16 Jul – 14 Sep 2026")
5. Submit feedback: "Tell us what you'd want more of" — free text, no account needed

**V2 (paid):** parents subscribe by email to receive new dates automatically as announced.

## Event card design

- Event type badge + level badge (Primary / Secondary / All levels)
- Primary badge: purple highlight; secondary: muted grey
- "Add to Calendar" opens dropdown: Apple Calendar (.ics download) or Google Calendar (web link)
- All events marked `TRANSP:TRANSPARENT` — shows as free, not busy
- Source link on every card → exact school page, not homepage
- Verification banner shown above open day / enrollment events: "being verified school by school"
- Past events within current school year: grayed, non-clickable
- Events outside current school year: not shown

## Data maintenance

Events are seeded in `app/src/lib/events.ts`. Each event requires:
- Verified source URL (exact page, not school homepage)
- `lastVerified` date
- `level`: primary | secondary | both

Schools to verify and add (official pages needed): ISL, St George's, Michel Lucius, Vauban, Anne Beffort, Gaston Thorn, LESC, both European Schools.

## Feedback

Formspree form ID: `mbdvgwre` → submissions go to tzutingtw@gmail.com

## Stack

- **Next.js 16** in `/app` — frontend only (no API routes in V1), hosted on Vercel
- **Vercel** — auto-deploys from `main` branch of GitHub repo; root directory set to `app`
- **Formspree** (`mbdvgwre`) — feedback form, zero backend code
- **Resend** — `.ics` delivery in V2 only

No Airtable in V1 — data lives in `events.ts`. Airtable is the planned V2 data layer.

Target infrastructure cost: under €20/year.

## Key decisions already made

- Browse-first: parents see value before giving any contact info
- Feedback before monetization: collect "what do you want more?" before V2 paid tier
- `.ics` format — works for Apple Calendar, Google Calendar, Outlook; no install required
- School type gates event types: local public → holidays only; international/european → all types
- atschool.lu is NOT used as a source — individual school official pages only
- MEN calendar (men.public.lu) is the authoritative source for local public school holidays
- No Airtable in V1 — events.ts is the data layer; simpler to ship and verify manually
- Weekly cadence is a V2 scraping assumption; V1 is fully manual

## Related project

`lux-school` (https://github.com/tingwang-tech/lux-school) — a decision-guide for families who don't yet know which school system to choose. This calendar project assumes the parent already knows their shortlist.
