"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS: Array<[string, string]> = [
  ["#about", "About"],
  ["#sushmita", "Crowned By"],
  ["#categories", "Categories"],
  ["#rewards", "Rewards"],
  ["#workshops", "Workshops"],
  ["#founder", "Founder"],
  ["#eligibility", "Eligibility"],
  ["#faq", "FAQ"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Lock body scroll and allow Escape-to-close while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-[100] bg-[rgba(10,5,7,0.85)] backdrop-blur-xl border-b border-[color:var(--line)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 lg:gap-6 px-6 lg:px-10 py-5">
        <Link
          href="/"
          className="font-serif font-medium text-[15px] sm:text-[22px] xl:text-[20px] tracking-[0.08em] sm:tracking-[0.16em] xl:tracking-[0.1em] text-cream"
          aria-label="The Rising Queen of India"
        >
          The Rising Queen of India
        </Link>

        {/* Desktop links — only shown where there is room for the full set */}
        <ul className="hidden xl:flex shrink-0 gap-4 list-none">
          {NAV_LINKS.map(([href, label]) => (
            <li key={href} className="whitespace-nowrap">
              <a
                href={href}
                className="relative whitespace-nowrap text-[11px] tracking-[0.18em] uppercase text-cream-muted transition-colors hover:text-gold"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/register"
            className="hidden xl:inline-flex items-center gap-3 px-8 py-3.5 border border-gold text-cream text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-gold hover:text-black"
          >
            Register <span aria-hidden>→</span>
          </Link>

          {/* Hamburger — below xl */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="xl:hidden inline-flex flex-col items-center justify-center gap-[5px] w-11 h-11 border border-gold text-gold transition-colors hover:bg-[rgba(201,169,97,0.12)]"
          >
            <span className="block w-5 h-[1.5px] bg-current" />
            <span className="block w-5 h-[1.5px] bg-current" />
            <span className="block w-5 h-[1.5px] bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`xl:hidden fixed inset-0 z-[200] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="absolute inset-0 w-full h-full bg-black/70 backdrop-blur-sm"
        />
        <div
          className={`absolute top-0 right-0 h-dvh w-[min(360px,85vw)] bg-black-soft border-l border-gold flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[color:var(--line)]">
            <span className="font-serif italic text-gold text-lg">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              className="w-10 h-10 border border-gold rounded-full text-gold text-xl flex items-center justify-center transition-all hover:bg-gold hover:text-black hover:rotate-90"
            >
              ×
            </button>
          </div>
          <ul className="flex flex-col px-6 py-4 list-none flex-1 overflow-y-auto">
            {NAV_LINKS.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="block py-3.5 text-[12px] tracking-[0.22em] uppercase text-cream-muted border-b border-[color:var(--line)] transition-colors hover:text-gold"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 py-6 border-t border-[color:var(--line)]">
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex justify-center items-center gap-3 px-8 py-3.5 bg-gold text-black border border-gold text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-cream"
            >
              Register <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
