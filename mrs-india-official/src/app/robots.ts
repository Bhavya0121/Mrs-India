import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Served at /robots.txt (App Router metadata convention).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
