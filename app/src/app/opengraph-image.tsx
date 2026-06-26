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
        }}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#534AB7",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          school.orienting.lu
        </div>

        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            color: "#2C2C2A",
            lineHeight: 1.05,
            marginBottom: "40px",
          }}
        >
          Luxembourg
          <br />
          School Calendar
        </div>

        <div
          style={{
            fontSize: "40px",
            color: "#534AB7",
            fontWeight: 500,
          }}
        >
          Never miss a date that matters.
        </div>
      </div>
    ),
    size
  );
}
