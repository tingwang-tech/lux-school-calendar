import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const user = process.env.IMPORT_USER
  const pass = process.env.IMPORT_PASSWORD

  // If credentials aren't configured, block access entirely
  if (!user || !pass) {
    return new NextResponse("Not available", { status: 404 })
  }

  const auth = request.headers.get("authorization") ?? ""
  if (auth.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString()
    const [u, p] = decoded.split(":")
    if (u === user && p === pass) {
      return NextResponse.next()
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Import", charset="UTF-8"' },
  })
}

export const config = {
  matcher: ["/import", "/api/parse-teacher-doc"],
}
