import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_NAME, OG_IMAGE } from "@/lib/constants";

// The register page is a Client Component and cannot export metadata itself,
// so this server layout supplies the per-page SEO metadata and simply renders
// its children unchanged (no added markup or behavior).

const REGISTER_TITLE = "Apply — The Rising Queen of India";
const REGISTER_DESCRIPTION =
  "Apply to The Rising Queen of India, Season 01. A four-step entry for India's most glamorous pageant for women, crowned by Sushmita Sen. 28 — 31 October 2026, Goa.";

export const metadata: Metadata = {
  title: REGISTER_TITLE,
  description: REGISTER_DESCRIPTION,
  alternates: { canonical: "/register" },
  openGraph: {
    title: REGISTER_TITLE,
    description: REGISTER_DESCRIPTION,
    url: "/register",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: REGISTER_TITLE,
    description: REGISTER_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
