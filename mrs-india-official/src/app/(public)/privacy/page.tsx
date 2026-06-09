import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SITE_NAME, OG_IMAGE } from "@/lib/constants";

const PRIVACY_DESCRIPTION =
  "How The Rising Queen of India collects, uses, protects, and shares your personal information when you apply or engage with the pageant.";

export const metadata: Metadata = {
  title: "Privacy Policy — The Rising Queen of India",
  description: PRIVACY_DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — The Rising Queen of India",
    description: PRIVACY_DESCRIPTION,
    url: "/privacy",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — The Rising Queen of India",
    description: PRIVACY_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

function Clause({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-serif font-medium text-cream text-[24px] sm:text-[28px] mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Para({ children }: { children: ReactNode }) {
  return (
    <p className="text-cream-muted text-[15px] leading-[1.8]">{children}</p>
  );
}

function Bullets({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc pl-5 text-cream-muted text-[15px] leading-[1.8] space-y-2 marker:text-gold">
      {children}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[rgba(10,5,7,0.85)] backdrop-blur-xl border-b border-[color:var(--line)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 lg:px-10 py-5">
          <Link
            href="/"
            className="font-serif font-medium text-[15px] sm:text-[20px] tracking-[0.12em] sm:tracking-[0.18em] text-cream whitespace-nowrap"
            aria-label="The Rising Queen of India"
          >
            The Rising Queen of India
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 border border-gold text-cream text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-gold hover:text-black"
          >
            <span aria-hidden>←</span> Back to Home
          </Link>
        </div>
      </header>

      {/* Body */}
      <article className="max-w-[860px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6">
          <span className="w-10 h-px bg-gold" />
          Your Data, Respected
        </div>
        <h1 className="font-serif font-normal text-cream text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.01em] mb-4">
          Privacy Policy
        </h1>
        <p className="text-[11px] tracking-[0.3em] uppercase text-cream-muted mb-10">
          Last updated: 28 May 2026
        </p>

        <Para>
          Your trust matters to us. This Privacy Policy describes how The Rising
          Queen collects, uses, protects, and shares your personal information
          when you apply for or engage with our pageant.
        </Para>

        <Clause title="1. Introduction">
          <Para>
            The Rising Queen (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
            is committed to protecting the privacy of every applicant,
            participant, and visitor (&quot;you&quot;). This Privacy Policy
            explains what personal information we collect, how we use it, and the
            choices you have. By registering for, or interacting with, The Rising
            Queen pageant and related services, you consent to the practices
            described here.
          </Para>
        </Clause>

        <Clause title="2. Information We Collect">
          <Para>We may collect the following categories of information:</Para>
          <div className="mt-3">
            <Bullets>
              <li>
                Identity &amp; contact details — full name, date of birth,
                gender, marital status, nationality, email address, phone number,
                and residential city/state.
              </li>
              <li>
                Application data — chosen category, height, profession,
                languages, social media handles, biography, achievements, and
                answers you provide.
              </li>
              <li>
                Media — photographs, headshots, full-length images, and any
                audition video you upload.
              </li>
              <li>
                Payment information — registration fee transaction details
                processed through secure third-party payment gateways. We do not
                store full card numbers.
              </li>
              <li>
                Technical data — IP address, browser type, device information,
                and usage data collected via cookies and similar technologies.
              </li>
            </Bullets>
          </div>
        </Clause>

        <Clause title="3. How We Use Your Information">
          <Para>We use your information to:</Para>
          <div className="mt-3">
            <Bullets>
              <li>
                Process and evaluate your application and manage the audition and
                selection process.
              </li>
              <li>
                Communicate with you about your registration, schedules, results,
                and event logistics.
              </li>
              <li>
                Operate, promote, and improve the pageant, including marketing,
                social media, broadcast, and press coverage.
              </li>
              <li>Process payments and maintain financial records.</li>
              <li>Comply with legal, regulatory, and safety obligations.</li>
            </Bullets>
          </div>
        </Clause>

        <Clause title="4. Media & Publicity Consent">
          <Para>
            Pageants are public events. By participating, you grant The Rising
            Queen and its authorised partners the right to capture, use, and
            publish your name, image, likeness, and submitted media across
            digital, print, broadcast, and social platforms for promotional and
            editorial purposes, without additional compensation, unless agreed
            otherwise in writing.
          </Para>
        </Clause>

        <Clause title="5. Sharing of Information">
          <Para>
            We do not sell your personal information. We may share it with:
          </Para>
          <div className="mt-3">
            <Bullets>
              <li>
                Trusted service providers (payment processors, IT, photographers,
                event vendors) acting on our behalf.
              </li>
              <li>
                Sponsors and media partners, where relevant to the event and
                consistent with this Policy.
              </li>
              <li>
                Authorities or third parties where required by law or to protect
                our rights, safety, or property.
              </li>
            </Bullets>
          </div>
        </Clause>

        <Clause title="6. Cookies">
          <Para>
            Our website uses cookies and similar technologies to enable core
            functionality, remember preferences, and understand how the site is
            used. You can control cookies through your browser settings;
            disabling them may affect some features.
          </Para>
        </Clause>

        <Clause title="7. Data Security">
          <Para>
            We apply reasonable administrative, technical, and physical
            safeguards to protect your information. However, no method of
            transmission or storage is completely secure, and we cannot guarantee
            absolute security.
          </Para>
        </Clause>

        <Clause title="8. Data Retention">
          <Para>
            We retain personal information for as long as necessary to fulfil the
            purposes described in this Policy, including the duration of the event
            season, and thereafter as required for legal, accounting, or
            legitimate business purposes.
          </Para>
        </Clause>

        <Clause title="9. Your Rights">
          <Para>
            Subject to applicable law, you may request to access, correct,
            update, or delete your personal information, or withdraw consent. To
            exercise these rights, contact us using the details below. Note that
            certain media already published or required for legal/record-keeping
            purposes may not be retractable.
          </Para>
        </Clause>

        <Clause title="10. Children">
          <Para>
            The Rising Queen is intended for participants aged 18 and above. We
            do not knowingly collect personal information from minors. If you
            believe a minor has provided us information, please contact us so we
            can remove it.
          </Para>
        </Clause>

        <Clause title="11. Changes to This Policy">
          <Para>
            We may update this Privacy Policy from time to time. Material changes
            will be posted on this page with a revised &quot;Last updated&quot;
            date.
          </Para>
        </Clause>

        <Clause title="Contact Us">
          <Para>
            For any questions regarding this document, please reach out:
          </Para>
          <div className="mt-4 text-cream-muted text-[15px] leading-[1.9]">
            <span className="block text-cream font-medium">The Rising Queen</span>
            <span className="block">Sector 17, Gurgaon, Haryana, India</span>
            <span className="block">
              Email:{" "}
              <a
                href="mailto:therisingqueenofindia@gmail.com"
                className="text-gold hover:underline"
              >
                therisingqueenofindia@gmail.com
              </a>
            </span>
            <span className="block">Phone: +91 88266 01653 / +91 88264 56677</span>
          </div>
        </Clause>

        <p className="mt-12 pt-8 border-t border-[color:var(--line)] text-cream-muted text-[13px] leading-[1.8] italic">
          This document is provided for general informational purposes and forms
          part of the agreement between you and The Rising Queen. It does not
          constitute legal advice. The Rising Queen reserves the right to update
          this document at any time; the latest version will always be available
          on this website.
        </p>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-cream text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-gold hover:text-black"
          >
            <span aria-hidden>←</span> Back to Home
          </Link>
        </div>
      </article>
    </main>
  );
}
