"use client"

import { useState, useEffect } from "react"

type Platform = "iphone" | "android"

// ── Shared sub-components ────────────────────────────────────────────────────

function PhoneShell({ children, platform }: { children: React.ReactNode; platform: Platform }) {
  return (
    <div className="relative mx-auto" style={{ width: 168, height: 300 }}>
      {/* Outer bezel */}
      <div
        className="absolute inset-0 rounded-[28px]"
        style={{ background: "#1C1C1E", boxShadow: "0 0 0 2px #3a3a3c, 0 8px 24px rgba(0,0,0,0.25)" }}
      />
      {/* Screen */}
      <div
        className="absolute overflow-hidden bg-white"
        style={{ inset: "8px", borderRadius: "22px" }}
      >
        {children}
      </div>
      {/* Dynamic island / notch */}
      {platform === "iphone" ? (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-[#1C1C1E] rounded-full z-10"
          style={{ top: 11, width: 44, height: 10 }}
        />
      ) : (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-[#1C1C1E] rounded-full z-10"
          style={{ top: 12, width: 10, height: 10 }}
        />
      )}
    </div>
  )
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "text-white" : "text-[#1C1C1E]"
  return (
    <div className={`flex justify-between items-center px-4 pt-3 pb-1 text-[8px] font-semibold ${c}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span>●●●</span>
        <span>WiFi</span>
        <span>▪</span>
      </div>
    </div>
  )
}

// Mini calendar preview — represents the site content
function SitePreview({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div className={`px-3 py-1.5 transition-opacity duration-300 ${dimmed ? "opacity-30" : ""}`}>
      <div className="text-[7px] font-semibold text-[#3C3489] mb-1">Luxembourg school dates</div>
      <div className="flex gap-1 mb-2">
        {["2025-26", "2026-27"].map((y, i) => (
          <div key={y} className={`text-[6px] px-1.5 py-0.5 rounded-full border ${i === 0 ? "bg-[#534AB7] text-white border-[#534AB7]" : "text-[#888780] border-[#D3D1C7]"}`}>{y}</div>
        ))}
      </div>
      {[
        { color: "#EEEDFE", label: "Open day", date: "3 Sep 2025" },
        { color: "#E1F5EE", label: "Enrollment", date: "15 Oct 2025" },
        { color: "#FAEEDA", label: "Holiday", date: "16 Jul – 14 Sep" },
      ].map((e) => (
        <div key={e.label} className="rounded-lg border border-[#D3D1C7] px-2 py-1.5 mb-1 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <div className={`text-[5px] font-medium px-1 py-0.5 rounded mb-0.5`} style={{ background: e.color }}>{e.label}</div>
              <div className="text-[6px] text-[#2C2C2A] font-medium">{e.date}</div>
            </div>
            <div className="text-[5px] bg-[#534AB7] text-white px-1.5 py-0.5 rounded-md mt-0.5">+ Add</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── iPhone screens ──────────────────────────────────────────────────────────

function IphoneSafari({ pulseShare = false }: { pulseShare?: boolean }) {
  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]">
      <StatusBar />
      {/* URL bar */}
      <div className="mx-2 mb-1 bg-white rounded-lg px-2 py-1 flex items-center gap-1">
        <div className="text-[6px] text-[#888780]">🔒</div>
        <div className="text-[6.5px] text-[#1C1C1E] font-medium flex-1">school.orienting.lu</div>
      </div>
      {/* Site */}
      <div className="flex-1 bg-white mx-0 overflow-hidden">
        <SitePreview />
      </div>
      {/* Safari toolbar */}
      <div className="bg-[#F2F2F7] border-t border-[#D3D1C7] px-4 py-1.5 flex justify-between items-center">
        <span className="text-[#C7C7CC] text-[10px]">‹</span>
        <span className="text-[#C7C7CC] text-[10px]">›</span>
        <div className="relative flex items-center justify-center">
          {pulseShare && (
            <span className="absolute inline-flex h-5 w-5 rounded-full bg-[#534AB7] opacity-30 animate-ping" />
          )}
          <span className={`text-[11px] ${pulseShare ? "text-[#534AB7]" : "text-[#007AFF]"}`}>⬆</span>
        </div>
        <span className="text-[#007AFF] text-[10px]">⊞</span>
        <span className="text-[#007AFF] text-[10px]">⋯</span>
      </div>
    </div>
  )
}

function IphoneShareSheet() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-[#F2F2F7]">
        <StatusBar />
        <div className="mx-2 mb-1 bg-white rounded-lg px-2 py-1 flex items-center gap-1">
          <div className="text-[6px] text-[#888780]">🔒</div>
          <div className="text-[6.5px] text-[#1C1C1E] font-medium flex-1">school.orienting.lu</div>
        </div>
      </div>
      <div className="flex-1 bg-white overflow-hidden">
        <SitePreview dimmed />
      </div>
      {/* Share sheet overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#F2F2F7] rounded-t-2xl"
        style={{ boxShadow: "0 -2px 16px rgba(0,0,0,0.12)" }}
      >
        {/* App icons row */}
        <div className="flex justify-around px-3 pt-3 pb-2">
          {["📋", "✉️", "💬", "📝"].map((icon) => (
            <div key={icon} className="flex flex-col items-center gap-0.5">
              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-[10px] shadow-sm">{icon}</div>
              <div className="text-[4.5px] text-[#888780]">Copy</div>
            </div>
          ))}
        </div>
        {/* Action list */}
        <div className="mx-2 mb-2 rounded-xl overflow-hidden bg-white">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#EEEDFE] border-b border-[#D3D1C7]">
            <div className="w-5 h-5 rounded-lg bg-[#534AB7] flex items-center justify-center">
              <span className="text-white text-[8px]">+</span>
            </div>
            <span className="text-[7px] font-semibold text-[#534AB7]">Add to Home Screen</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#D3D1C7]">
            <div className="w-5 h-5 rounded-lg bg-[#E5E5EA] flex items-center justify-center text-[8px]">🔗</div>
            <span className="text-[7px] text-[#1C1C1E]">Copy Link</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-5 h-5 rounded-lg bg-[#E5E5EA] flex items-center justify-center text-[8px]">☆</div>
            <span className="text-[7px] text-[#1C1C1E]">Add Bookmark</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Android screens ──────────────────────────────────────────────────────────

function AndroidChrome({ pulseMenu = false }: { pulseMenu?: boolean }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chrome top bar */}
      <div className="bg-white border-b border-[#E0E0E0] pt-3 pb-1 px-2">
        <StatusBar />
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex-1 bg-[#F1F3F4] rounded-full px-2 py-1 flex items-center gap-1">
            <span className="text-[6px] text-[#5F6368]">🔒</span>
            <span className="text-[6.5px] text-[#202124] font-medium">school.orienting.lu</span>
          </div>
          <div className="relative flex items-center justify-center w-5 h-5">
            {pulseMenu && (
              <span className="absolute inline-flex h-5 w-5 rounded-full bg-[#534AB7] opacity-30 animate-ping" />
            )}
            <span className={`text-[11px] font-bold ${pulseMenu ? "text-[#534AB7]" : "text-[#5F6368]"}`}>⋮</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SitePreview />
      </div>
    </div>
  )
}

function AndroidMenu() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-white border-b border-[#E0E0E0] pt-3 pb-1 px-2">
        <StatusBar />
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex-1 bg-[#F1F3F4] rounded-full px-2 py-1 flex items-center gap-1">
            <span className="text-[6px] text-[#5F6368]">🔒</span>
            <span className="text-[6.5px] text-[#202124] font-medium">school.orienting.lu</span>
          </div>
          <span className="text-[11px] font-bold text-[#534AB7]">⋮</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SitePreview dimmed />
      </div>
      {/* Dropdown menu */}
      <div
        className="absolute top-10 right-1 w-36 bg-white rounded-lg overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-[#EEEDFE]">
          <span className="text-[8px]">📱</span>
          <span className="text-[7px] font-semibold text-[#534AB7]">Add to Home Screen</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-t border-[#F1F1F1]">
          <span className="text-[8px]">⊞</span>
          <span className="text-[7px] text-[#202124]">New tab</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-t border-[#F1F1F1]">
          <span className="text-[8px]">☆</span>
          <span className="text-[7px] text-[#202124]">Bookmark</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-t border-[#F1F1F1]">
          <span className="text-[8px]">⚙</span>
          <span className="text-[7px] text-[#202124]">Settings</span>
        </div>
      </div>
    </div>
  )
}

// ── Home screen (shared) ─────────────────────────────────────────────────────

function HomeScreen({ platform }: { platform: Platform }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <StatusBar dark />
      <div className="flex-1 px-4 py-2">
        {/* App grid */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {["📷", "📱", "🗺", "⚙️", "📧", "🎵", "📰", "🛒"].map((icon) => (
            <div key={icon} className="flex flex-col items-center gap-0.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-[11px]">{icon}</div>
              <div className="text-[4.5px] text-white/70">App</div>
            </div>
          ))}
        </div>
        {/* New icon — highlighted */}
        <div className="flex flex-col items-center gap-0.5 animate-bounce">
          <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white shadow-lg">
            {/* Mini Luxembourg flag + calendar */}
            <div className="w-full h-full flex flex-col">
              <div className="flex-1" style={{ background: "#FDFAF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <div style={{ width: 10, height: 6, borderRadius: 1, overflow: "hidden" }}>
                    <div style={{ background: "#EF3340", height: "33.3%" }} />
                    <div style={{ background: "#fff", height: "33.3%" }} />
                    <div style={{ background: "#00A3E0", height: "33.3%" }} />
                  </div>
                  <div style={{ fontSize: 6 }}>📅</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[5px] text-white font-medium">School Dates</div>
        </div>
      </div>
      {/* Dock */}
      <div className="mx-3 mb-3 rounded-2xl bg-white/20 backdrop-blur px-4 py-2 flex justify-around">
        {["📞", "✉️", "🌐", "🎵"].map((icon) => (
          <div key={icon} className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-[11px]">{icon}</div>
        ))}
      </div>
      {platform === "iphone" && (
        <div className="flex justify-center pb-2">
          <div className="w-16 h-1 bg-white/50 rounded-full" />
        </div>
      )}
    </div>
  )
}

// ── Steps config ──────────────────────────────────────────────────────────────

const STEPS: Record<Platform, { caption: string; screen: React.ReactNode }[]> = {
  iphone: [
    {
      caption: "Open school.orienting.lu in Safari",
      screen: <IphoneSafari />,
    },
    {
      caption: "Tap the Share button ↑ at the bottom",
      screen: <IphoneSafari pulseShare />,
    },
    {
      caption: 'Tap "Add to Home Screen"',
      screen: <IphoneShareSheet />,
    },
    {
      caption: "Done — open it like any app, anytime",
      screen: <HomeScreen platform="iphone" />,
    },
  ],
  android: [
    {
      caption: "Open school.orienting.lu in Chrome",
      screen: <AndroidChrome />,
    },
    {
      caption: "Tap the ⋮ menu at the top right",
      screen: <AndroidChrome pulseMenu />,
    },
    {
      caption: 'Tap "Add to Home Screen"',
      screen: <AndroidMenu />,
    },
    {
      caption: "Done — open it like any app, anytime",
      screen: <HomeScreen platform="android" />,
    },
  ],
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InstallAnimation() {
  const [platform, setPlatform] = useState<Platform>("iphone")
  const [step, setStep] = useState(0)
  const [fading, setFading] = useState(false)

  const steps = STEPS[platform]

  function goTo(next: number) {
    setFading(true)
    setTimeout(() => {
      setStep(next)
      setFading(false)
    }, 200)
  }

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(() => goTo((step + 1) % steps.length), 2800)
    return () => clearTimeout(t)
  }, [step, platform])

  // Reset step when platform changes
  function switchPlatform(p: Platform) {
    setPlatform(p)
    setStep(0)
    setFading(false)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Platform toggle */}
      <div className="flex gap-2 bg-[#F1EFE8] rounded-full p-1">
        {(["iphone", "android"] as Platform[]).map((p) => (
          <button
            key={p}
            onClick={() => switchPlatform(p)}
            className={`text-xs px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
              platform === p
                ? "bg-white text-[#2C2C2A] font-medium shadow-sm"
                : "text-[#888780] hover:text-[#2C2C2A]"
            }`}
          >
            {p === "iphone" ? "iPhone" : "Android"}
          </button>
        ))}
      </div>

      {/* Phone + caption */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="transition-opacity duration-200"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <PhoneShell platform={platform}>
            {steps[step].screen}
          </PhoneShell>
        </div>

        <p className="text-sm text-[#2C2C2A] text-center font-medium min-h-[20px]">
          {steps[step].caption}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all cursor-pointer ${
              i === step
                ? "bg-[#534AB7] w-4 h-2"
                : "bg-[#D3D1C7] w-2 h-2 hover:bg-[#888780]"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
