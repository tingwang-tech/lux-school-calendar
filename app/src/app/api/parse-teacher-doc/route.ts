import Anthropic from "@anthropic-ai/sdk"

export interface ParsedEvent {
  id: string
  title: string
  date: string
  endDate?: string
  time?: string
  location?: string
  description?: string
}

const SUPPORTED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
])

const PROMPT = `You are extracting school events from a document sent by a class teacher to parents.

Extract every scheduled event, trip, activity, deadline, or school day with a specific date.
Ignore general information that has no specific date.

Return ONLY a valid JSON array — no prose, no markdown, no explanation. Example:
[
  {"title": "School trip to Mudam", "date": "2025-11-14", "location": "Mudam Luxembourg"},
  {"title": "Parent-teacher meeting", "date": "2025-11-20", "time": "18:00"},
  {"title": "Winter break", "date": "2025-12-20", "endDate": "2026-01-04"}
]

Rules:
- date and endDate must be YYYY-MM-DD format
- time must be HH:MM format (24h) if present
- title should be concise and in English (translate if needed)
- include location and description only when present in the document
- if no events found, return an empty array []`

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 })
  }

  if (!SUPPORTED_TYPES.has(file.type)) {
    return Response.json(
      { error: `Unsupported file type: ${file.type}. Use PDF, JPEG, PNG, GIF, or WebP.` },
      { status: 400 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json({ error: "Server configuration error" }, { status: 500 })
  }

  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")

  const contentBlock =
    file.type === "application/pdf"
      ? ({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 },
        } as const)
      : ({
          type: "image",
          source: {
            type: "base64",
            media_type: file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: base64,
          },
        } as const)

  const client = new Anthropic({ apiKey })

  const message = await client.messages
    .stream({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: PROMPT,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            { type: "text", text: "Extract all events from this teacher document." },
          ],
        },
      ],
    })
    .finalMessage()

  const textBlock = message.content.find((b) => b.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    return Response.json({ error: "No response from AI" }, { status: 500 })
  }

  let events: Omit<ParsedEvent, "id">[]
  try {
    const raw = textBlock.text.trim()
    const jsonStr = raw.startsWith("[") ? raw : raw.slice(raw.indexOf("["))
    events = JSON.parse(jsonStr)
  } catch {
    return Response.json({ error: "Could not parse AI response as JSON" }, { status: 422 })
  }

  const withIds: ParsedEvent[] = events.map((e, i) => ({
    ...e,
    id: `imported-${Date.now()}-${i}`,
  }))

  return Response.json({ events: withIds })
}
