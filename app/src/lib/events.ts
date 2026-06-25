export type SchoolType = "international" | "european" | "local-public"
export type EventType = "open-day" | "enrollment" | "holiday"
export type Level = "primary" | "secondary" | "both"

export interface SchoolEvent {
  id: string
  school: string
  schoolType: SchoolType
  eventType: EventType
  level?: Level
  date: string
  endDate?: string
  time?: string
  location?: string
  sourceUrl: string
  lastVerified: string
}

export const SCHOOLS: { name: string; type: SchoolType }[] = [
  // International — private
  { name: "ISL Luxembourg", type: "international" },
  { name: "St George's International School", type: "international" },
  { name: "OTR International School", type: "international" },
  { name: "Vauban – Lycée Français de Luxembourg", type: "international" },
  // International — public with international curriculum
  { name: "Lycée – International School Michel Lucius", type: "international" },
  { name: "Ecole internationale Gaston Thorn", type: "international" },
  { name: "Lënster Lycée International School", type: "international" },
  { name: "École Internationale Anne Beffort", type: "international" },
  { name: "École Internationale de Differdange et Esch-sur-Alzette", type: "international" },
  { name: "École Internationale de Mondorf-les-Bains", type: "international" },
  { name: "Lycée Edward Steichen (LESC)", type: "international" },
  // European
  { name: "European School Luxembourg I (Kirchberg)", type: "european" },
  { name: "European School Luxembourg II (Mamer)", type: "european" },
  // Local public
  { name: "Local public school (commune)", type: "local-public" },
]

export const SCHOOL_TYPE_LABELS: Record<SchoolType, string> = {
  international: "International schools",
  european: "European schools",
  "local-public": "Local public schools",
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  "open-day": "Open day",
  enrollment: "Enrollment",
  holiday: "School holiday",
}

export const LEVEL_LABELS: Record<Level, string> = {
  primary: "Primary",
  secondary: "Secondary",
  both: "All levels",
}

const SCHOOL_YEAR_START = new Date("2025-09-01")
const SCHOOL_YEAR_END = new Date("2026-09-14")

export function isInCurrentSchoolYear(dateStr: string): boolean {
  const d = new Date(dateStr + "T12:00:00")
  return d >= SCHOOL_YEAR_START && d <= SCHOOL_YEAR_END
}

export function isPast(dateStr: string): boolean {
  return new Date(dateStr + "T23:59:59") < new Date()
}

export function isSecondaryOnly(event: SchoolEvent): boolean {
  return event.level === "secondary"
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00")
}

function fmtShort(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

function fmtFull(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateRange(date: string, endDate?: string): string {
  const start = parseDate(date)
  if (!endDate) {
    return `${DAYS[start.getDay()]}, ${fmtFull(start)}`
  }
  const end = parseDate(endDate)
  return `${fmtShort(start)} – ${fmtFull(end)}`
}

// MEN official school holidays 2025-2026 — local public schools only
// International and European school holidays are not yet verified (P1 — not shown)
// Source: https://men.public.lu/en/vacances-scolaires.html
const MEN_SOURCE = "https://men.public.lu/en/vacances-scolaires.html"
const MEN_VERIFIED = "2026-06-20"

function makeLocalHolidays(idPrefix: string, startDate: string, endDate: string): SchoolEvent[] {
  return [{
    id: idPrefix,
    school: "Local public school (commune)",
    schoolType: "local-public",
    eventType: "holiday",
    date: startDate,
    endDate,
    sourceUrl: MEN_SOURCE,
    lastVerified: MEN_VERIFIED,
  }]
}

export const SEED_EVENTS: SchoolEvent[] = [
  // ── OTR — verified from https://otrschool.lu/open-days/ ───────────────────
  {
    id: "od-otr-mar26-primary",
    school: "OTR International School",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-03-06",
    time: "09:00",
    location: "7 Val Ste Croix, Belair, Luxembourg City",
    sourceUrl: "https://otrschool.lu/open-days/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-otr-feb26-secondary",
    school: "OTR International School",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-02-06",
    time: "09:00",
    location: "7 Val Ste Croix, Belair, Luxembourg City",
    sourceUrl: "https://otrschool.lu/open-days/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-otr-apr26-both",
    school: "OTR International School",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-04-18",
    time: "10:00",
    location: "7 Val Ste Croix, Belair, Luxembourg City",
    sourceUrl: "https://otrschool.lu/open-days/",
    lastVerified: "2026-06-25",
  },

  // ── EIMLB — verified from https://www.eimlb.lu/fr/porte-ouverte/ ──────────
  {
    id: "od-eimlb-feb26-primary",
    school: "École Internationale de Mondorf-les-Bains",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-02-28",
    time: "08:15",
    location: "2 route de Burmerange, L-5659 Mondorf-les-Bains",
    sourceUrl: "https://www.eimlb.lu/fr/porte-ouverte/journee-portes-ouvertes-a-lecole-primaire/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eimlb-mar26-secondary",
    school: "École Internationale de Mondorf-les-Bains",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-03-07",
    time: "08:00",
    location: "Mondorf-les-Bains",
    sourceUrl: "https://www.eimlb.lu/fr/porte-ouverte/",
    lastVerified: "2026-06-25",
  },

  // ── LLIS — from atschool.lu (official site cert expired) ──────────────────
  {
    id: "od-llis-feb26",
    school: "Lënster Lycée International School",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-02-27",
    time: "16:00",
    location: "2 rue Victor Ferrant, 6122 Junglinster",
    sourceUrl: "https://atschool.lu/en/international-schools-open-days-2025/",
    lastVerified: "2026-06-25",
  },

  // ── MEN holidays 2025-2026 — local public schools only ────────────────────
  ...makeLocalHolidays("hol-allsaints", "2025-11-01", "2025-11-09"),
  ...makeLocalHolidays("hol-xmas", "2025-12-20", "2026-01-04"),
  ...makeLocalHolidays("hol-carnival", "2026-02-14", "2026-02-22"),
  ...makeLocalHolidays("hol-easter", "2026-03-28", "2026-04-12"),
  ...makeLocalHolidays("hol-pentecost", "2026-05-23", "2026-05-31"),
  ...makeLocalHolidays("hol-summer", "2026-07-16", "2026-09-14"),
]
