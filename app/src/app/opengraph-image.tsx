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
          alignItems: "center",
          background: "#FDFAF6",
          padding: "80px",
          textAlign: "center",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0",
            marginBottom: "48px",
            borderRadius: "8px",
            overflow: "hidden",
            width: "72px",
            height: "48px",
          }}
        >
          <div style={{ flex: 1, background: "#EF3340" }} />
          <div style={{ flex: 1, background: "#FFFFFF" }} />
          <div style={{ flex: 1, background: "#00A3E0" }} />
        </div>

        <div
          style={{
            fontSize: "88px",
            fontWeight: 700,
            color: "#2C2C2A",
            lineHeight: 1.05,
            marginBottom: "36px",
            fontFamily: "sans-serif",
          }}
        >
          Luxembourg
          <br />
          School Calendar
        </div>

        <div
          style={{
            fontSize: "38px",
            color: "#534AB7",
            fontWeight: 500,
            fontFamily: "sans-serif",
          }}
        >
          Never miss a date that matters.
        </div>
      </div>
    ),
    size
  );
}
