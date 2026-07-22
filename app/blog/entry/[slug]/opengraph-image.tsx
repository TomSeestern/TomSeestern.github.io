import { ImageResponse } from "next/og"
import { getMarkdownEntry, getMarkdownSlugs } from "@/lib/markdown"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const CONTENT_DIR = "content/blog"

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getMarkdownSlugs(CONTENT_DIR)
}

export default async function Image({
  params,
}: {
  readonly params: Promise<{ slug: string }>
}): Promise<ImageResponse> {
  const { slug } = await params
  const entry = getMarkdownEntry(slug, CONTENT_DIR)

  const title = entry?.data.title || "Blog Post"
  const dateRaw = entry?.data.articleDate
  const date = dateRaw
    ? new Date(dateRaw).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : ""
  const author = entry?.data.authorName || "Tom Segbers"

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
            width: "100%",
            height: "100%",
            padding: "80px 96px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "56px",
              fontWeight: "700",
              color: "#FAF9F6",
              letterSpacing: "-0.02em",
              lineHeight: "1.15",
              marginBottom: "32px",
              maxHeight: "260px",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              fontSize: "28px",
              fontWeight: "400",
              color: "rgba(250, 249, 246, 0.7)",
              marginTop: "auto",
            }}
          >
            {date ? <span>{date}</span> : null}
            <span>{author}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "24px",
              fontWeight: "600",
              color: "rgba(250, 249, 246, 0.9)",
              marginTop: "24px",
            }}
          >
            TomSegbers.de
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
