import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Pinyon_Script } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Rising Queen of India — A Coronation, Season 01",
  description:
    "The Rising Queen of India, Season 01. A coronation crowned by Sushmita Sen. 28 — 31 October 2026, Goa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--black)] text-[var(--cream)] font-sans">
        {children}
      </body>
    </html>
  );
}
