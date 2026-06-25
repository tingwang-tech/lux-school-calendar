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

// MEN official holidays 2025-2026 — local public schools only
// International/European school holidays not yet verified per school (P1)
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

  // ── ISL Luxembourg ────────────────────────────────────────────────────────
  // Source: https://www.islux.lu/updates/events/open-house-march-2026/open-house
  {
    id: "od-isl-mar26-primary",
    school: "ISL Luxembourg",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-03-07",
    time: "09:30",
    location: "ISL Campus, Merl",
    sourceUrl: "https://www.islux.lu/updates/events/open-house-march-2026/open-house",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-isl-mar26-secondary",
    school: "ISL Luxembourg",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-03-21",
    time: "09:30",
    location: "ISL Campus, Merl",
    sourceUrl: "https://www.islux.lu/updates/events/open-house-march-2026/open-house",
    lastVerified: "2026-06-25",
  },

  // ── St George's International School ──────────────────────────────────────
  // No dedicated open day page — dates from external calendar (Chronicle.lu)
  {
    id: "od-stg-feb26-secondary",
    school: "St George's International School",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-02-24",
    time: "08:40",
    location: "11 rue des Peupliers, L-2328 Hamm",
    sourceUrl: "https://www.st-georges.lu",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-stg-feb26-primary",
    school: "St George's International School",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-02-28",
    time: "10:30",
    location: "11 rue des Peupliers, L-2328 Hamm",
    sourceUrl: "https://www.st-georges.lu",
    lastVerified: "2026-06-25",
  },

  // ── OTR International School ───────────────────────────────────────────────
  // Source: https://otrschool.lu/open-days/
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

  // ── Vauban – Lycée Français de Luxembourg ─────────────────────────────────
  // Source: https://www.vauban.lu/evenements/journee-portes-ouvertes-2026/
  {
    id: "od-vauban-jan26",
    school: "Vauban – Lycée Français de Luxembourg",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-01-31",
    time: "09:00",
    location: "Luxembourg-Gasperich",
    sourceUrl: "https://www.vauban.lu/evenements/journee-portes-ouvertes-2026/",
    lastVerified: "2026-06-25",
  },

  // ── Lycée – International School Michel Lucius ────────────────────────────
  // Sources: lml.lu/open-day-2026-primary/ and lml.lu/open-day-secondary/
  {
    id: "od-ml-feb26-primary",
    school: "Lycée – International School Michel Lucius",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-02-28",
    time: "09:00",
    location: "Luxembourg-Limpertsberg",
    sourceUrl: "https://www.lml.lu/open-day-2026-primary/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-ml-feb26-secondary",
    school: "Lycée – International School Michel Lucius",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-02-28",
    time: "09:00",
    location: "Luxembourg-Limpertsberg",
    sourceUrl: "https://www.lml.lu/open-day-secondary/",
    lastVerified: "2026-06-25",
  },

  // ── Ecole internationale Gaston Thorn ─────────────────────────────────────
  // Official site has 2025 events only; 2026 dates from external calendars
  {
    id: "od-eigt-feb26-primary-kirchberg",
    school: "Ecole internationale Gaston Thorn",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-02-28",
    time: "10:00",
    location: "Kirchberg campus",
    sourceUrl: "https://www.eigt.lu",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eigt-feb26-secondary-merl",
    school: "Ecole internationale Gaston Thorn",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-02-28",
    time: "10:00",
    location: "Merl campus",
    sourceUrl: "https://www.eigt.lu",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eigt-feb26-secondary-walferdange",
    school: "Ecole internationale Gaston Thorn",
    schoolType: "international",
    eventType: "open-day",
    level: "secondary",
    date: "2026-02-28",
    time: "10:00",
    location: "Walferdange campus",
    sourceUrl: "https://www.eigt.lu",
    lastVerified: "2026-06-25",
  },

  // ── Lënster Lycée International School ────────────────────────────────────
  // Official site cert expired; date from atschool.lu cross-reference
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

  // ── École Internationale Anne Beffort (EIMAB) ─────────────────────────────
  // Source: https://www.eimab.lu/site/fr/actualites_26/portes-ouvertes-2026_45/
  {
    id: "od-eimab-jan26",
    school: "École Internationale Anne Beffort",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-01-31",
    time: "10:00",
    location: "Mersch",
    sourceUrl: "https://www.eimab.lu/site/fr/actualites_26/portes-ouvertes-2026_45/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eimab-mar26",
    school: "École Internationale Anne Beffort",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-03-07",
    time: "09:00",
    location: "Mersch",
    sourceUrl: "https://www.eimab.lu/site/fr/actualites_26/portes-ouvertes-2026_45/",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eimab-jun26",
    school: "École Internationale Anne Beffort",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-06-11",
    time: "16:00",
    location: "Mersch",
    sourceUrl: "https://www.eimab.lu/site/fr/actualites_26/portes-ouvertes-2026_45/",
    lastVerified: "2026-06-25",
  },

  // ── École Internationale de Differdange et Esch-sur-Alzette (EIDE) ────────
  // No official open day page; dates from atschool.lu
  {
    id: "od-eide-esch-feb26",
    school: "École Internationale de Differdange et Esch-sur-Alzette",
    schoolType: "international",
    eventType: "open-day",
    level: "primary",
    date: "2026-02-24",
    time: "13:30",
    location: "Esch-sur-Alzette campus",
    sourceUrl: "https://schoul.esch.lu/db/1/1499326427551/1",
    lastVerified: "2026-06-25",
  },
  {
    id: "od-eide-diff-feb26",
    school: "École Internationale de Differdange et Esch-sur-Alzette",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-02-26",
    time: "13:30",
    location: "Differdange campus",
    sourceUrl: "https://schoul.esch.lu/db/1/1499326427551/1",
    lastVerified: "2026-06-25",
  },

  // ── École Internationale de Mondorf-les-Bains (EIMLB) ────────────────────
  // Source: https://www.eimlb.lu/fr/porte-ouverte/
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
    location: "2 route de Burmerange, L-5659 Mondorf-les-Bains",
    sourceUrl: "https://www.eimlb.lu/fr/porte-ouverte/",
    lastVerified: "2026-06-25",
  },

  // ── Lycée Edward Steichen (LESC) ──────────────────────────────────────────
  // No dedicated open day page; date from JustArrived calendar
  {
    id: "od-lesc-mar26",
    school: "Lycée Edward Steichen (LESC)",
    schoolType: "international",
    eventType: "open-day",
    level: "both",
    date: "2026-03-21",
    time: "09:00",
    location: "Clervaux",
    sourceUrl: "https://www.lesc.lu/fr/international.php",
    lastVerified: "2026-06-25",
  },

  // ── European School Luxembourg I (Kirchberg) ──────────────────────────────
  // Source: https://www.euroschool.lu/2025/11/14/nursery-primary-open-day-2026/
  {
    id: "od-esl1-mar26-primary",
    school: "European School Luxembourg I (Kirchberg)",
    schoolType: "european",
    eventType: "open-day",
    level: "primary",
    date: "2026-03-13",
    location: "Kirchberg, Luxembourg City",
    sourceUrl: "https://www.euroschool.lu/2025/11/14/nursery-primary-open-day-2026/",
    lastVerified: "2026-06-25",
  },

  // ── European School Luxembourg II (Mamer) ────────────────────────────────
  // Source: https://www.eel2.eu/en/news/vie-de-lecole-inscriptions-evenements/save-date
  {
    id: "od-esl2-mar26",
    school: "European School Luxembourg II (Mamer)",
    schoolType: "european",
    eventType: "open-day",
    level: "both",
    date: "2026-03-14",
    time: "09:30",
    location: "Mamer / Bertrange",
    sourceUrl: "https://www.eel2.eu/en/news/vie-de-lecole-inscriptions-evenements/save-date",
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
