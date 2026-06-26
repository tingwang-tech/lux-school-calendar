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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#FDFAF6",
          padding: "80px 96px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#534AB7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            📅
          </div>
          <span
            style={{
              fontSize: "20px",
              color: "#534AB7",
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            school.orienting.lu
          </span>
        </div>

        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#2C2C2A",
            lineHeight: 1.1,
            marginBottom: "32px",
            maxWidth: "900px",
          }}
        >
          Luxembourg School Calendar
        </div>

        <div
          style={{
            fontSize: "32px",
            color: "#534AB7",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          Never miss a date that matters.
        </div>
      </div>
    ),
    size
  );
}
