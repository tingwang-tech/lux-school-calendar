"use client"

import { useState, useMemo } from "react"
import {
  SEED_EVENTS,
  V1_SCHOOLS,
  SCHOOL_TYPE_LABELS,
  EVENT_TYPE_LABELS,
  LEVEL_LABELS,
  isInCurrentSchoolYear,
  isPast,
  formatDateRange,
  type SchoolType,
  type EventType,
  type SchoolEvent,
} from "@/lib/events"

const V1_SCHOOL_NAMES = new Set(V1_SCHOOLS.map((s) => s.name))

type DisplayEvent = SchoolEvent & { groupedSchools?: string[] }

function toIcsDate(dateStr: string, time?: string): string {
  const d = dateStr.replace(/-/g, "")
  if (!time) return d
  return `${d}T${time.replace(":", "")}00`
}

function generateIcs(event: (typeof SEED_EVENTS)[0]): string {
  const isAllDay = !event.time
  const dtStart = isAllDay
    ? `DTSTART;VALUE=DATE:${toIcsDate(event.date)}`
    : `DTSTART:${toIcsDate(event.date, event.time)}`
  const endDateStr = event.endDate ?? event.date
  const dtEnd = isAllDay
    ? `DTEND;VALUE=DATE:${toIcsDate(endDateStr)}`
    : `DTEND:${toIcsDate(event.date, String(Number(event.time!.split(":")[0]) + 1).padStart(2, "0") + ":" + event.time!.split(":")[1])}`
  const summary = event.endDate
    ? `${EVENT_TYPE_LABELS[event.eventType]}: ${formatDateRange(event.date, event.endDate)} – ${event.school}`
    : `${EVENT_TYPE_LABELS[event.eventType]} – ${event.school}`
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lux School Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@luxschoolcalendar`,
    `SUMMARY:${summary}`,
    dtStart,
    dtEnd,
    "TRANSP:TRANSPARENT",
    event.location ? `LOCATION:${event.location}` : "",
    `DESCRIPTION:Source: ${event.sourceUrl}\\nLast verified: ${event.lastVerified}\\n\\nInformational — always confirm on the school's official site.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n")
}

function downloadIcs(event: (typeof SEED_EVENTS)[0]) {
  const blob = new Blob([generateIcs(event)], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${event.school.replace(/\s+/g, "-")}-${event.date}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function googleCalendarUrl(event: (typeof SEED_EVENTS)[0]): string {
  const isAllDay = !event.time
  const start = toIcsDate(event.date, event.time)
  const endDateStr = event.endDate ?? event.date
  const end = isAllDay
    ? toIcsDate(endDateStr)
    : toIcsDate(event.date, String(Number(event.time!.split(":")[0]) + 1).padStart(2, "0") + ":" + event.time!.split(":")[1])
  const title = event.endDate
    ? `${EVENT_TYPE_LABELS[event.eventType]}: ${formatDateRange(event.date, event.endDate)} – ${event.school}`
    : `${EVENT_TYPE_LABELS[event.eventType]} – ${event.school}`
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: `Source: ${event.sourceUrl}\nLast verified: ${event.lastVerified}\n\nInformational — always confirm on the school's official site.`,
    ...(event.location ? { location: event.location } : {}),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  "open-day": "bg-[#EEEDFE] text-[#3C3489]",
  enrollment: "bg-[#E1F5EE] text-[#085041]",
  holiday: "bg-[#FAEEDA] text-[#633806]",
}

export default function Home() {
  const [schoolType, setSchoolType] = useState<SchoolType | "all">("all")
  const [selectedSchool, setSelectedSchool] = useState<string>("all")
  const [selectedEventType, setSelectedEventType] = useState<EventType | "all">("all")
  const [openCalendarId, setOpenCalendarId] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredSchools = useMemo(
    () => (schoolType === "all" ? V1_SCHOOLS : V1_SCHOOLS.filter((s) => s.type === schoolType)),
    [schoolType]
  )

  const events = useMemo(() => {
    const filtered = SEED_EVENTS.filter((e) => {
      if (!V1_SCHOOL_NAMES.has(e.school)) return false
      if (!isInCurrentSchoolYear(e.date)) return false
      if (schoolType !== "all" && e.schoolType !== schoolType) return false
      if (schoolType === "local-public" && e.eventType !== "holiday") return false
      if (selectedSchool !== "all" && e.school !== selectedSchool) return false
      if (selectedEventType !== "all" && e.eventType !== selectedEventType) return false
      return true
    })
    // External calendar cards always go at the end (after real dated events)
    const real = filtered.filter((e) => !e.isExternalCalendar)
    const external = filtered.filter((e) => e.isExternalCalendar)
    const future = real.filter((e) => !isPast(e.date)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const past = real.filter((e) => isPast(e.date)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return { future: [...future, ...external], past }
  }, [schoolType, selectedSchool, selectedEventType])

  function collapseGroups(list: SchoolEvent[], allFiltered: SchoolEvent[]): DisplayEvent[] {
    if (selectedSchool !== "all") return list
    const seen = new Set<string>()
    return list.flatMap((event) => {
      if (!event.menPeriodId) return [event]
      if (seen.has(event.menPeriodId)) return []
      seen.add(event.menPeriodId)
      const schools = allFiltered.filter((e) => e.menPeriodId === event.menPeriodId).map((e) => e.school)
      return [{ ...event, groupedSchools: schools }]
    })
  }

  const allFiltered = useMemo(() => [...events.future, ...events.past], [events])
  const futureEvents = useMemo(() => collapseGroups(events.future, allFiltered), [events, selectedSchool])
  const pastEvents = useMemo(() => collapseGroups(events.past, allFiltered), [events, selectedSchool])
  const displayEvents = useMemo(() => [...futureEvents, ...(showPast ? pastEvents : [])], [futureEvents, pastEvents, showPast])

  // Show verification banner when any open day or enrollment events are in view
  const showVerifyingBanner = futureEvents.some(
    (e) => e.eventType === "open-day" || e.eventType === "enrollment"
  )

  function handleSchoolTypeChange(val: SchoolType | "all") {
    setSchoolType(val)
    setSelectedSchool("all")
    setSelectedEventType("all")
  }

  async function handleFeedbackSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const data = new FormData(e.currentTarget)
    await fetch("https://formspree.io/f/mbdvgwre", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
    setSubmitting(false)
    setSubmitted(true)
    setFeedback("")
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 md:py-12">
      <h1 className="text-2xl font-medium text-[#3C3489] mb-1">Luxembourg school dates</h1>
      <p className="text-sm text-[#888780] mb-8">
        Open days, enrollment windows, and holidays — add any event to your calendar in one click.
      </p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-8">
        <select
          value={schoolType}
          onChange={(e) => handleSchoolTypeChange(e.target.value as SchoolType | "all")}
          className="text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] w-full sm:w-auto"
        >
          <option value="all">All school types</option>
          {(["international", "local-public"] as SchoolType[]).map((t) => (
            <option key={t} value={t}>{SCHOOL_TYPE_LABELS[t]}</option>
          ))}
        </select>

        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] w-full sm:w-auto"
        >
          <option value="all">All schools</option>
          {filteredSchools.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>

        {schoolType !== "local-public" && (
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value as EventType | "all")}
            className="text-sm border border-[#D3D1C7] rounded-lg px-3 py-2 bg-white text-[#2C2C2A] focus:outline-none focus:border-[#534AB7] w-full sm:w-auto"
          >
            <option value="all">All event types</option>
            <option value="open-day">{EVENT_TYPE_LABELS["open-day"]}</option>
            <option value="enrollment">{EVENT_TYPE_LABELS["enrollment"]}</option>
            <option value="holiday">{EVENT_TYPE_LABELS["holiday"]}</option>
          </select>
        )}
      </div>

      {/* Verification banner — shown when open days or enrollment events are visible */}
      {showVerifyingBanner && (
        <div className="flex gap-3 bg-[#F1EFE8] border border-[#D3D1C7] rounded-xl px-4 py-3 mb-6 text-xs text-[#5F5E5A]">
          <span className="mt-0.5">⚠</span>
          <span>Always check the source link on each event before making plans.</span>
        </div>
      )}

      {/* Event cards */}
      <div className="flex flex-col gap-3">
        {displayEvents.length === 0 && (
          <div className="text-sm text-[#888780] bg-[#F1EFE8] rounded-xl px-5 py-6">
            No upcoming events for this selection. Dates are added as schools announce them.
          </div>
        )}
        {displayEvents.map((event) => {
          const past = isPast(event.date)
          const isOpen = openCalendarId === event.id

          if (event.isExternalCalendar) {
            return (
              <div key={event.id} className="rounded-xl border px-5 py-4 bg-white border-[#D3D1C7]">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${EVENT_TYPE_COLORS["holiday"]}`}>
                    {EVENT_TYPE_LABELS["holiday"]}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#2C2C2A] mb-0.5">{event.title}</p>
                <p className="text-sm text-[#888780] mb-2">{event.school}</p>
                <a
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#534AB7] hover:text-[#3C3489] transition-colors"
                >
                  See school calendar ↗
                </a>
              </div>
            )
          }

          return (
            <div
              key={event.id}
              className={`rounded-xl border px-5 py-4 ${past ? "bg-[#F1EFE8] border-[#D3D1C7]" : "bg-white border-[#D3D1C7]"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${past ? "bg-[#D3D1C7] text-[#888780]" : EVENT_TYPE_COLORS[event.eventType]}`}>
                      {EVENT_TYPE_LABELS[event.eventType]}
                    </span>
                    {event.level && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${past ? "bg-[#D3D1C7] text-[#888780]" : event.level === "primary" ? "bg-[#EEEDFE] text-[#3C3489]" : "bg-[#F1EFE8] text-[#888780]"}`}>
                        {LEVEL_LABELS[event.level]}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-medium mb-0.5 ${past ? "text-[#888780]" : "text-[#2C2C2A]"}`}>
                    {event.title ? event.title : formatDateRange(event.date, event.endDate)}
                  </p>
                  {event.title && (
                    <p className={`text-xs mb-0.5 ${past ? "text-[#B4B2A9]" : "text-[#888780]"}`}>
                      {formatDateRange(event.date, event.endDate)}
                    </p>
                  )}
                  {event.groupedSchools ? (
                    <p className={`text-xs mt-0.5 ${past ? "text-[#B4B2A9]" : "text-[#888780]"}`}>
                      {event.groupedSchools.length <= 3
                        ? event.groupedSchools.join(" · ")
                        : `${event.groupedSchools.slice(0, 2).join(" · ")} +${event.groupedSchools.length - 2} more`}
                    </p>
                  ) : (
                    <p className={`text-sm ${past ? "text-[#B4B2A9]" : "text-[#888780]"}`}>{event.school}</p>
                  )}
                  {event.location && !event.endDate && (
                    <p className={`text-xs mt-0.5 ${past ? "text-[#B4B2A9]" : "text-[#888780]"}`}>{event.location}</p>
                  )}
                </div>

                <div className="shrink-0 pt-1 relative">
                  {past ? (
                    <span className="text-xs text-[#B4B2A9] border border-[#D3D1C7] rounded-lg px-3 py-1.5 block">Past</span>
                  ) : (
                    <>
                      <button
                        onClick={() => setOpenCalendarId(isOpen ? null : event.id)}
                        className="text-xs font-medium bg-[#534AB7] text-white rounded-lg px-3 py-1.5 hover:bg-[#3C3489] transition-colors cursor-pointer"
                      >
                        <span className="sm:hidden">+ Add</span>
                        <span className="hidden sm:inline">+ Add to calendar</span>
                      </button>
                      {isOpen && (
                        <div className="absolute right-0 top-9 z-10 bg-white border border-[#D3D1C7] rounded-xl shadow-sm py-1 min-w-[160px]">
                          <button
                            onClick={() => { downloadIcs(event); setOpenCalendarId(null) }}
                            className="w-full text-left text-xs px-4 py-2 text-[#2C2C2A] hover:bg-[#F1EFE8] transition-colors cursor-pointer"
                          >
                            🍎 Apple Calendar
                          </button>
                          <a
                            href={googleCalendarUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setOpenCalendarId(null)}
                            className="block text-xs px-4 py-2 text-[#2C2C2A] hover:bg-[#F1EFE8] transition-colors"
                          >
                            📅 Google Calendar
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#B4B2A9] hover:text-[#888780] mt-2 inline-block transition-colors"
              >
                Source ↗
              </a>
            </div>
          )
        })}
      </div>

      {/* Past events toggle */}
      {pastEvents.length > 0 && (
        <button
          onClick={() => setShowPast((v) => !v)}
          className="w-full mt-3 mb-10 text-sm text-[#888780] border border-[#D3D1C7] rounded-xl px-4 py-3 bg-[#F1EFE8] hover:bg-[#E8E6DF] transition-colors cursor-pointer text-left flex justify-between items-center"
        >
          <span>{showPast ? "Hide past events" : `Show ${pastEvents.length} past event${pastEvents.length === 1 ? "" : "s"}`}</span>
          <span>{showPast ? "▲" : "▼"}</span>
        </button>
      )}
      {pastEvents.length === 0 && <div className="mb-10" />}

      {/* Feedback */}
      <div className="border-t border-[#D3D1C7] pt-10">
        <h2 className="text-base font-medium text-[#2C2C2A] mb-1">Tell us what you think</h2>
        <p className="text-sm text-[#888780] mb-4">
          What do you like about this so far? What would make it more useful?
        </p>
        {submitted ? (
          <p className="text-sm text-[#3C3489] bg-[#EEEDFE] rounded-xl px-5 py-4">
            Thank you — your feedback helps us build what parents actually need.
          </p>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3">
            <textarea
              name="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g. I'd love to see enrollment deadlines for ISL, or term dates for all schools..."
              rows={4}
              required
              className="text-sm border border-[#D3D1C7] rounded-xl px-4 py-3 bg-white text-[#2C2C2A] placeholder-[#B4B2A9] focus:outline-none focus:border-[#534AB7] resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="self-start text-sm font-medium bg-[#534AB7] text-white rounded-lg px-5 py-2 hover:bg-[#3C3489] transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Submit"}
            </button>
          </form>
        )}
      </div>

      <p className="text-xs text-[#B4B2A9] mt-12 leading-relaxed">
        Not affiliated with any listed school. All events are based on publicly available information.
        Always confirm details on the school&apos;s official site.
      </p>
    </main>
  )
}
