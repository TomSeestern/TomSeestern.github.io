import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #C2410C 0%, #9A3412 50%, #7C2D12 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "80px",
              fontWeight: "700",
              color: "#FAF9F6",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            TomSegbers.de
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "36px",
              fontWeight: "400",
              color: "rgba(250, 249, 246, 0.8)",
            }}
          >
            Senior Developer
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
