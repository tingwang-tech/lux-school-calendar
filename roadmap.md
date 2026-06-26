# Roadmap — Lux School Calendar

**How to use this:** Read before starting a new session. It tells you what is built, what is the next task, and what is deliberately held. If you receive feedback, check here first — is it already planned, or does it need to be added?

---

## Priority levels

- **P0** — must be done before V1 is considered complete
- **P1** — planned for V1.x; adds clear value, not launch-blocking
- **V2** — paid tier or requires infrastructure not in V1
- **Hold** — deliberately deferred; decision recorded here

---

## What is live now

- Browse-first calendar, no signup required
- Filters: school type → school → event type
- **Open days** for all 7 public international schools (verified source per school)
- **School holidays** for MEN-calendar schools: Michel Lucius, LLIS, EIMAB, EIMLB, LESC, local public — auto-generated from `MEN_PERIODS`, 2025–2026 only
- **External calendar links** for EIGT and EIDE (follow European Schools calendar; placeholder cards with "See school calendar →")
- "Add to Calendar" — Apple (.ics download) and Google (web link); all-day, shows as free
- Past events grayed, not removed
- Feedback form (Formspree → tzutingtw@gmail.com)
- Verification banner on open day / enrollment cards
- Mobile-responsive layout
- Vercel auto-deploy from `main`

---

## P0 — Complete V1

These should be done before calling V1 stable.

### Enrollment / application deadlines
- Not yet added for any school
- Required fields: school, date, level, source URL, lastVerified
- Sources to check per school: lml.lu, llis.lu, eimab.lu, eimlb.lu, lesc.lu, eigt.lu, eide
- Display: same card style as open days; "Enrollment" badge

### 2025–2026 data completeness check
- Confirm all open day dates are still valid (re-verify sources)
- Add any open days announced after the initial data entry

---

## P1 — V1.x improvements

Do these after P0 is complete.

### 2026–2027 school year
- Add `MEN_PERIODS` entries for 2026–2027 (dates known, see CLAUDE.md)
- Extend `SCHOOL_YEAR_END` to cover 2026–2027
- Verify open day dates for 2026–2027 per school (announced ~Jan 2027)

### EIGT and EIDE actual holiday dates
- Replace placeholder "See school calendar →" cards with real dated events
- Source: https://www.eursc.eu/en/european-schools/school-year-calendar/
- Download the European Schools XLS/PDF for 2025–2026 and 2026–2027
- Add as regular holiday events (not `isExternalCalendar`)

### Luxembourg national public holidays
- Add fixed public holidays: Easter Monday, Labour Day (1 May), Europe Day (9 May), Ascension, Whit Monday, National Day (23 Jun), Assumption (15 Aug), All Saints (1 Nov), Christmas (25–26 Dec)
- Apply to all schools (universal)
- These are separate from school holiday periods

### Term start / end dates
- First day and last day of school per school
- Sources: individual school websites
- Display as a new event type or as part of holiday cards

### Orientation / welcome days
- New student welcome events, separate from open days
- Collect from school websites as announced

### Waiting list opening dates
- Schools announce when waiting lists open (especially ISL, St George's in V2)
- For V1: Michel Lucius, LLIS, EIMAB — check if they publish these

---

## V2 — Paid tier

V2 starts when V1 is stable and feedback has been collected. No hard date — trigger is: V1 P0 done + first cohort of feedback signals received.

### Email subscription (core V2 feature)
- Parents subscribe to receive new dates by email as schools announce them
- Stack: Resend for delivery, Airtable as data layer (replaces events.ts)
- Pricing model: TBD (likely small annual fee or freemium)
- `.ics` delivery in email body

### Private international schools
- ISL Luxembourg — own international calendar; source: islux.lu
- St George's International School — British calendar; source: st-georges.lu/term-dates
- OTR International School — own calendar; source: otrschool.lu
- Vauban – Lycée Français de Luxembourg — AEFE (French zones); source: vauban.lu/calendrier-scolaire
- Re-enable: remove `v2: true` from each school's entry in `SCHOOLS`

### European Schools
- European School Luxembourg I (Kirchberg) — EU-funded; source: eursc.eu
- European School Luxembourg II (Mamer) — EU-funded; source: eursc.eu
- Re-enable: remove `v2: true` from each school's entry in `SCHOOLS`

### Airtable migration
- Move events out of events.ts into Airtable
- Allows non-developer data updates
- Enables webhook → auto-publish flow

---

## Holds — deliberate decisions

These are not forgotten. They are waiting for the right moment.

| Item | Decision | When to revisit |
|---|---|---|
| Testimonials | Hold until after paid launch | After first V2 subscribers; collect quotes from feedback form first |
| Open source | Undecided; leaning toward staying private for now | Revisit after V2 launches; moat is data + trust, not code |
| Secondary school focus | Listed but not highlighted; primary is the focus | V2 or when secondary enrollment dates are verified |
| atschool.lu as source | Not used — individual official pages only | Never; policy decision |
| Scraping / automation | Manual in V1; V2 assumption is weekly cadence | V2 with Airtable |

---

## Feedback triage guide

When you receive feedback from the form, categorise it here before acting:

- **Already in roadmap** → note which item it maps to; use as signal to prioritise
- **Not in roadmap** → add to the relevant P1 or V2 section above
- **Contradicts a hold decision** → flag to Ting before acting

---

## Open questions

- Enrollment deadline sources: which schools publish these publicly vs. require contacting the school?
- LESC upper secondary: follows European calendar for 3rd cycle — do we surface this distinction in the UI?
- National public holidays: show as a separate section or merge with school holidays?
