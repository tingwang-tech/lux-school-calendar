"use client"

import { useState, useRef, useCallback } from "react"
import type { ParsedEvent } from "@/app/api/parse-teacher-doc/route"

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00")
}

function formatDateRange(date: string, endDate?: string): string {
  const start = parseDate(date)
  if (!endDate) {
    return `${DAYS[start.getDay()]}, ${start.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`
  }
  const end = parseDate(endDate)
  const sameYear = start.getFullYear() === end.getFullYear()
  const startStr = sameYear
    ? `${start.getDate()} ${MONTHS[start.getMonth()]}`
    : `${start.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()}`
  return `${startStr} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`
}

function toIcsDate(dateStr: string, time?: string): string {
  const d = dateStr.replace(/-/g, "")
  if (!time) return d
  return `${d}T${time.replace(":", "")}00`
}

function generateIcs(event: ParsedEvent): string {
  const isAllDay = !event.time
  const dtStart = isAllDay
    ? `DTSTART;VALUE=DATE:${toIcsDate(event.date)}`
    : `DTSTART:${toIcsDate(event.date, event.time)}`
  const endDateStr = event.endDate ?? event.date
  const dtEnd = isAllDay
    ? `DTEND;VALUE=DATE:${toIcsDate(endDateStr)}`
    : `DTEND:${toIcsDate(event.date, String(Number(event.time!.split(":")[0]) + 1).padStart(2, "0") + ":" + event.time!.split(":")[1])}`
  const desc = [
    event.description ?? "",
    "Imported from teacher document via Luxembourg School Calendar.",
    "Always confirm details with your teacher.",
  ].filter(Boolean).join("\\n\\n")
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lux School Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@luxschoolcalendar`,
    `SUMMARY:${event.title}`,
    dtStart,
    dtEnd,
    "TRANSP:TRANSPARENT",
    event.location ? `LOCATION:${event.location}` : "",
    `DESCRIPTION:${desc}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n")
}

function downloadIcs(event: ParsedEvent) {
  const blob = new Blob([generateIcs(event)], { type: "text/calendar" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${event.title.replace(/\s+/g, "-")}-${event.date}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function googleCalendarUrl(event: ParsedEvent): string {
  const isAllDay = !event.time
  const start = toIcsDate(event.date, event.time)
  const endDateStr = event.endDate ?? event.date
  const end = isAllDay
    ? toIcsDate(endDateStr)
    : toIcsDate(event.date, String(Number(event.time!.split(":")[0]) + 1).padStart(2, "0") + ":" + event.time!.split(":")[1])
  const desc = [
    event.description ?? "",
    "Imported from teacher document via Luxembourg School Calendar.",
    "Always confirm details with your teacher.",
  ].filter(Boolean).join("\n\n")
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: desc,
    ...(event.location ? { location: event.location } : {}),
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

type Status = "idle" | "loading" | "done" | "error"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [events, setEvents] = useState<ParsedEvent[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const [openCalendarId, setOpenCalendarId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    setFile(f)
    setStatus("idle")
    setEvents([])
    setErrorMsg("")
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleSubmit() {
    if (!file) return
    setStatus("loading")
    setEvents([])
    setErrorMsg("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/parse-teacher-doc", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        setStatus("error")
        return
      }
      setEvents(data.events ?? [])
      setStatus("done")
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.")
      setStatus("error")
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 md:py-12">
      <a href="/" className="text-xs text-[#888780] hover:text-[#534AB7] transition-colors inline-block mb-6">
        ← Back to calendar
      </a>

      <h1 className="text-2xl font-medium text-[#3C3489] mb-1">Import class events</h1>
      <p className="text-sm text-[#888780] mb-8">
        Upload a document from your child&apos;s teacher — a PDF or photo of a handout — and we&apos;ll extract the dates so you can add them to your calendar.
      </p>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors mb-4 ${
          dragging
            ? "border-[#534AB7] bg-[#EEEDFE]"
            : file
            ? "border-[#534AB7] bg-[#EEEDFE]"
            : "border-[#D3D1C7] bg-[#F1EFE8] hover:border-[#534AB7]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/gif,image/webp,.pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {file ? (
          <>
            <p className="text-sm font-medium text-[#3C3489] mb-1">{file.name}</p>
            <p className="text-xs text-[#888780]">Click to change file</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-[#2C2C2A] mb-1">Drop a file here, or click to browse</p>
            <p className="text-xs text-[#888780]">PDF, JPEG, PNG — handouts, newsletters, schedules</p>
          </>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!file || status === "loading"}
        className="w-full text-sm font-medium bg-[#534AB7] text-white rounded-xl px-4 py-3 hover:bg-[#3C3489] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mb-8"
      >
        {status === "loading" ? "Reading document…" : "Extract events"}
      </button>

      {/* Error */}
      {status === "error" && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl px-5 py-4 mb-6 text-sm text-[#991B1B]">
          {errorMsg}
        </div>
      )}

      {/* Results */}
      {status === "done" && (
        <>
          {events.length === 0 ? (
            <div className="text-sm text-[#888780] bg-[#F1EFE8] rounded-xl px-5 py-6 mb-6">
              No events found in this document. Try a clearer photo or a different file.
            </div>
          ) : (
            <>
              <p className="text-xs text-[#888780] mb-3">{events.length} event{events.length === 1 ? "" : "s"} found</p>
              <div className="flex flex-col gap-3 mb-6">
                {events.map((event) => {
                  const isOpen = openCalendarId === event.id
                  return (
                    <div key={event.id} className="rounded-xl border border-[#D3D1C7] px-5 py-4 bg-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#2C2C2A] mb-0.5">{event.title}</p>
                          <p className="text-xs text-[#888780]">{formatDateRange(event.date, event.endDate)}</p>
                          {event.time && (
                            <p className="text-xs text-[#888780]">{event.time}</p>
                          )}
                          {event.location && (
                            <p className="text-xs text-[#888780] mt-0.5">{event.location}</p>
                          )}
                          {event.description && (
                            <p className="text-xs text-[#B4B2A9] mt-1">{event.description}</p>
                          )}
                        </div>
                        <div className="shrink-0 pt-1 relative">
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
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div className="flex gap-3 bg-[#F1EFE8] border border-[#D3D1C7] rounded-xl px-4 py-3 mb-6 text-xs text-[#5F5E5A]">
            <span className="mt-0.5">⚠</span>
            <span>AI can make mistakes — always confirm dates with your teacher. Events are not saved; leave this page and they&apos;re gone.</span>
          </div>
        </>
      )}

      <p className="text-xs text-[#B4B2A9] mt-8 leading-relaxed">
        Your document is sent to our server to be read by an AI. It is not stored.
      </p>
    </main>
  )
}
