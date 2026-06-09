import { ImageResponse } from "next/og";

// Branded social-share card, generated at build time. Applies site-wide
// (root segment) and is inherited by /register. next/og uses a default font,
// so no font asset is required.

export const alt =
  "The Rising Queen of India — A Coronation, Season 01. 28 — 31 October 2026, Goa.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLACK = "#0a0507";
const GOLD = "#c9a961";
const CREAM = "#ebe4d6";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${BLACK} 0%, #1a0f12 100%)`,
          color: CREAM,
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: `2px solid ${GOLD}`,
            padding: "56px 48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: GOLD,
            }}
          >
            Season 01 · Crowned by Sushmita Sen
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: CREAM,
              marginTop: 28,
              marginBottom: 24,
            }}
          >
            The Rising Queen of India
          </div>
          <div style={{ fontSize: 40, fontStyle: "italic", color: GOLD }}>
            A Coronation of Becoming
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: CREAM,
              marginTop: 36,
            }}
          >
            28 — 31 October 2026 · Goa
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
