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

## School registry

This is the authoritative list. Check this before adding or generating holiday events.

### V1 — Public schools (live)

| School | Short name | Type | Holiday calendar | Notes |
|---|---|---|---|---|
| Lycée – International School Michel Lucius | Michel Lucius | Public international | MEN | State-funded |
| Lënster Lycée International School | LLIS | Public international | MEN | State-funded, Junglinster |
| École Internationale Anne Beffort | EIMAB | Public international | MEN | State-funded, Mersch |
| École Internationale de Mondorf-les-Bains | EIMLB | Public international | MEN | State-funded, Mondorf |
| Lycée Edward Steichen | LESC | Public international | MEN | State-funded, Clervaux; MEN except upper secondary (European) |
| Ecole internationale Gaston Thorn | EIGT | Public international | European Schools | Accredited European School, run by Luxembourg City |
| École Internationale de Differdange et Esch-sur-Alzette | EIDE | Public international | European Schools | Accredited European School, run by communes |
| Local public school (commune) | — | Local public | MEN | All commune schools; MEN calendar is authoritative |

**MEN calendar source:** https://men.public.lu/en/vacances-scolaires.html  
**European Schools calendar source:** https://www.eursc.eu/en/european-schools/school-year-calendar/

When MEN publishes a new school year calendar, all MEN-tagged schools above automatically get holidays generated. Add the new year's periods to `MEN_PERIODS` in `events.ts` and extend `SCHOOL_YEAR_END`.

EIGT and EIDE follow the European Schools calendar. Their holiday dates need manual verification from the eursc.eu link above — they are currently shown as "See school calendar →" placeholder cards.

### V2 — Private international schools (hidden, `v2: true` in events.ts)

| School | Short name | Holiday calendar | Why V2 |
|---|---|---|---|
| ISL Luxembourg | ISL | Own (international) | Private; own term dates |
| St George's International School | St George's | Own (international) | Private; British calendar |
| OTR International School | OTR | Own (international) | Private |
| Vauban – Lycée Français de Luxembourg | Vauban | AEFE (French zones) | Private; French Ministry calendar |
| European School Luxembourg I (Kirchberg) | ESL I | European Schools | EU-funded, not Luxembourg public |
| European School Luxembourg II (Mamer) | ESL II | European Schools | EU-funded, not Luxembourg public |

To re-enable a V2 school: remove `v2: true` from its entry in `SCHOOLS` in `events.ts`. Its events will automatically reappear.

## School year data coverage

| School year | MEN periods defined | Status |
|---|---|---|
| 2025–2026 | 6 periods | Live |
| 2026–2027 | Not yet added | To do (P1) |

## School types in the UI

Two categories shown (V1):
- **Public international schools** — the 7 public international schools above
- **Local public schools** — commune schools

"European schools" category is hidden in V1 (ESL I and II are V2).

## Date types by priority

**P0 (should be live):**
- Open days — all V1 public international schools
- Enrollment / application deadlines — not yet added (gap)
- School holidays — MEN calendar for all MEN-tagged schools; placeholder links for EIGT and EIDE

**P1 (next phase):**
- 2026–2027 school year MEN holidays
- EIGT and EIDE actual holiday dates (from European Schools calendar)
- Term start/end dates
- Orientation / welcome days
- Luxembourg national public holidays
- Waiting list opening dates

**V2:**
- Email subscription (paid tier)
- Private international school data (ISL, St George's, OTR, Vauban)
- European Schools I and II
- Airtable as data layer (replaces events.ts)

## How it works for a parent (V1)

1. Land on the site — see upcoming events immediately, no signup
2. Filter: school type → school → event type
3. Browse event cards: future events show "Add to Calendar" (Apple or Google), past events grayed
4. Holiday periods shown as date range (e.g. "16 Jul – 14 Sep 2026")
5. Submit feedback: free text, no account needed

**V2 (paid):** parents subscribe by email to receive new dates automatically as announced.

## Event card design

- Event type badge + level badge (Primary / Secondary / All levels)
- Primary badge: purple highlight; secondary: muted grey
- "Add to Calendar" opens dropdown: Apple Calendar (.ics download) or Google Calendar (web link)
- All events marked `TRANSP:TRANSPARENT` — shows as free, not busy
- Source link on every card → exact school page, not homepage
- Verification banner shown above open day / enrollment events
- Past events within current school year: grayed, non-clickable
- External calendar cards (EIGT, EIDE): no Add to Calendar, just "See school calendar →" link
- Events outside current school year: not shown

## Data maintenance

Events are seeded in `app/src/lib/events.ts`. Each event requires:
- Verified source URL (exact page, not school homepage)
- `lastVerified` date
- `level`: primary | secondary | both

MEN holiday events are auto-generated — do not add them manually. Update `MEN_PERIODS` and `SCHOOL_YEAR_END` only.

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
- Feedback before monetization: collect signal before V2 paid tier
- `.ics` format — works for Apple Calendar, Google Calendar, Outlook; no install required
- Local public → holidays only; public international → all event types
- atschool.lu is NOT a source — individual school official pages only
- MEN calendar is the authoritative source; auto-generated for all MEN-tagged schools
- No Airtable in V1 — events.ts is the data layer
- Private schools and European Schools moved to V2 — keep V1 focused on verifiable public schools
- Testimonials held until after paid launch — collect feedback signal first, display later
- Open source: undecided; moat is verified data and parent trust, not the code

## Related project

`lux-school` (https://github.com/tingwang-tech/lux-school) — a decision-guide for families who don't yet know which school system to choose. This calendar project assumes the parent already knows their shortlist.
