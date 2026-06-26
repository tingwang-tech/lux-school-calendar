import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Luxembourg School Calendar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FDFAF6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Inner border frame */}
        <div
          style={{
            position: "absolute",
            inset: "22px",
            border: "1px solid rgba(44,44,42,0.07)",
          }}
        />

        {/* Content column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Flag + calendar icon row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "48px",
            }}
          >
            {/* Luxembourg flag */}
            <svg width="72" height="44" viewBox="0 0 72 44">
              <rect width="72" height="15" y="0" fill="#EF3340" />
              <rect width="72" height="15" y="14.5" fill="#FFFFFF" />
              <rect width="72" height="15" y="29" fill="#00A3E0" />
              <rect
                width="72"
                height="44"
                rx="3"
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
            </svg>

            {/* Separator dot */}
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(44,44,42,0.2)",
              }}
            />

            {/* Calendar icon */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="3" y="7" width="34" height="28" rx="4.5" stroke="#2C2C2A" strokeWidth="1.8" />
              <line x1="3" y1="15.5" x2="37" y2="15.5" stroke="#2C2C2A" strokeWidth="1.8" />
              <line x1="13" y1="3.5" x2="13" y2="9.5" stroke="#2C2C2A" strokeWidth="2" strokeLinecap="round" />
              <line x1="27" y1="3.5" x2="27" y2="9.5" stroke="#2C2C2A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="22" r="2.2" fill="#534AB7" />
              <circle cx="20" cy="22" r="2.2" fill="#534AB7" />
              <circle cx="28" cy="22" r="2.2" fill="rgba(44,44,42,0.18)" />
              <circle cx="12" cy="30" r="2.2" fill="rgba(44,44,42,0.18)" />
              <circle cx="20" cy="30" r="2.2" fill="rgba(44,44,42,0.18)" />
              <circle cx="28" cy="30" r="2.2" fill="rgba(44,44,42,0.18)" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            <span style={{ fontSize: "92px", fontWeight: 800, color: "#2C2C2A" }}>
              Luxembourg
            </span>
            <span style={{ fontSize: "92px", fontWeight: 800, color: "#2C2C2A" }}>
              School Calendar
            </span>
          </div>

          {/* Accent rule */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "30px 0 26px",
            }}
          >
            <div style={{ width: "32px", height: "1.5px", background: "rgba(83,74,183,0.3)" }} />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                border: "1.5px solid #534AB7",
              }}
            />
            <div style={{ width: "32px", height: "1.5px", background: "rgba(83,74,183,0.3)" }} />
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "25px",
              fontWeight: 500,
              color: "#534AB7",
              letterSpacing: "0.01em",
              fontFamily: "sans-serif",
            }}
          >
            Never miss a date that matters.
          </div>
        </div>
      </div>
    ),
    size
  );
}
