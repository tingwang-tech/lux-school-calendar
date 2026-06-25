# MVP — Lux School Calendar

## One-line pitch

"Get calendar invites for open days and enrollment deadlines at Luxembourg international schools — automatically, as dates are announced."

## Problem

International families in Luxembourg track school dates manually: bookmarking pages, checking back, hoping they don't miss an announcement. There is no system that pushes these dates to parents when they go live.

atschool.lu publishes a good list of open days — but only for the current year, and only if you remember to check.

## Solution

A lightweight subscription service. Parents select their shortlisted schools once. When new dates are detected (open days, enrollment windows, school holidays), they receive an `.ics` calendar invite by email — one click adds it to their calendar.

## Core functionality

**Signup**: Parent enters email and selects schools from a list. Done.

**Monitoring**: A weekly automated job checks known data sources for new date announcements.

**Delivery**: When a new date is detected for a school a parent follows, an email is sent with an `.ics` attachment. The event lands in their calendar automatically.

**Date types**:
- Open days
- Enrollment / application windows
- School holidays

## Out of scope for v1

- Parent login or accounts
- School search or comparison
- Reviews or ratings
- French language support
- Real-time scraping (weekly cadence is sufficient)
- Direct enrollment services

## Data sources

- https://atschool.lu/en/international-schools-open-days-2025/
- Individual school websites (manually verified before sending)

## Data maintenance

School data and dates live in Airtable. A human verifies accuracy before any invite is sent. Each calendar event includes the source and a "last verified" note.

## Stack

- Next.js on Vercel (frontend + API)
- Vercel cron (weekly scraper)
- Airtable (schools, dates, subscriptions)
- Resend (email + .ics delivery)

## Pilot success measures

- 10+ parents subscribed
- At least one date type fully covered (open days)
- Zero wrong dates sent
- At least one parent confirms they used a calendar invite
