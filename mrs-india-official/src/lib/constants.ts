// Single source of truth for cross-cutting values referenced in multiple files.

/** Production site URL — used by sitemap.ts and robots.ts. No trailing slash. */
export const SITE_URL = "https://therisingqueenofindia.com";

/** Registration fee in INR. Referenced by the form, content defaults, and the Application model. */
export const REGISTRATION_FEE = 4999;

/** Brand name, used for og:site_name. */
export const SITE_NAME = "The Rising Queen of India";

/**
 * Shared Open Graph / Twitter image. Served by the generated route
 * src/app/opengraph-image.tsx at /opengraph-image. Spread into each page's
 * openGraph/twitter so the per-page metadata override doesn't drop it.
 * The relative url resolves against metadataBase (SITE_URL).
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "The Rising Queen of India — A Coronation, Season 01. 28 — 31 October 2026, Goa.",
};
