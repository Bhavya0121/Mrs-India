import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SITE_NAME, OG_IMAGE } from "@/lib/constants";

const TERMS_DESCRIPTION =
  "The terms and conditions governing your application to and participation in The Rising Queen of India, Season 01.";

export const metadata: Metadata = {
  title: "Terms of Service — The Rising Queen of India",
  description: TERMS_DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service — The Rising Queen of India",
    description: TERMS_DESCRIPTION,
    url: "/terms",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — The Rising Queen of India",
    description: TERMS_DESCRIPTION,
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

export default function TermsPage() {
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
          The Fine Print
        </div>
        <h1 className="font-serif font-normal text-cream text-[clamp(40px,5vw,64px)] leading-[1.05] tracking-[-0.01em] mb-4">
          Terms of Service
        </h1>
        <p className="text-[11px] tracking-[0.3em] uppercase text-cream-muted mb-10">
          Last updated: 28 May 2026
        </p>

        <Para>
          Please read these Terms carefully before applying. They set out the
          rules and conditions that govern your participation in The Rising
          Queen.
        </Para>

        <Clause title="1. Acceptance of Terms">
          <Para>
            These Terms of Service (&quot;Terms&quot;) govern your application
            to, and participation in, The Rising Queen pageant and your use of
            this website. By registering, paying the registration fee, or
            otherwise participating, you agree to be bound by these Terms.
          </Para>
        </Clause>

        <Clause title="2. Eligibility">
          <ul className="list-disc pl-5 text-cream-muted text-[15px] leading-[1.8] space-y-2 marker:text-gold">
            <li>
              Applicants must be women aged 18 years or above as on the
              registration date.
            </li>
            <li>
              Open to Indian residents and NRIs holding a valid Indian
              passport.
            </li>
            <li>
              Open to all marital statuses and backgrounds, in line with the
              stated category criteria.
            </li>
            <li>
              Applicants must provide accurate, truthful, and complete
              information. Misrepresentation may lead to disqualification.
            </li>
          </ul>
        </Clause>

        <Clause title="3. Registration & Fees">
          <ul className="list-disc pl-5 text-cream-muted text-[15px] leading-[1.8] space-y-2 marker:text-gold">
            <li>
              A registration fee of INR 4,999 applies and must be paid to
              complete your application.
            </li>
            <li>
              The registration fee is strictly non-refundable and
              non-transferable, as it covers application processing, audition,
              and shortlisting.
            </li>
            <li>
              Costs for finale participation, travel, wardrobe, and other items
              are separate and will be communicated to selected finalists.
            </li>
            <li>All payments are processed via secure third-party gateways.</li>
          </ul>
        </Clause>

        <Clause title="4. Selection Process">
          <Para>
            Selection, shortlisting, and judging are conducted by The Rising
            Queen and its appointed panel of mentors and judges. All decisions
            of the organisers and jury are final and binding, and no
            correspondence will be entertained in this regard.
          </Para>
        </Clause>

        <Clause title="5. Code of Conduct">
          <Para>
            Participants are expected to conduct themselves with dignity,
            respect, and professionalism at all times. Harassment,
            discrimination, dishonesty, substance abuse, or any behaviour that
            brings the event into disrepute is prohibited and may result in
            immediate disqualification without refund.
          </Para>
        </Clause>

        <Clause title="6. Media Rights & Intellectual Property">
          <Para>
            By participating, you grant The Rising Queen a worldwide,
            royalty-free right to use your name, image, likeness, voice, and
            submitted content for promotion, broadcast, editorial, and archival
            purposes. All event branding, logos, designs, and content remain the
            intellectual property of The Rising Queen and may not be reproduced
            without written permission.
          </Para>
        </Clause>

        <Clause title="7. Disqualification">
          <Para>
            The organisers reserve the right to disqualify any participant who
            breaches these Terms, provides false information, fails to meet
            eligibility criteria, or engages in misconduct, at any stage and
            without refund.
          </Para>
        </Clause>

        <Clause title="8. Health, Safety & Assumption of Risk">
          <Para>
            Participants confirm they are medically fit to take part.
            Participation in workshops, rehearsals, and stage activities is
            voluntary and at the participant&apos;s own risk. Participants are
            responsible for their personal belongings throughout the event.
          </Para>
        </Clause>

        <Clause title="9. Limitation of Liability">
          <Para>
            To the maximum extent permitted by law, The Rising Queen, its
            organisers, partners, and sponsors shall not be liable for any
            indirect, incidental, or consequential loss or damage arising from
            participation in the event or use of this website. Our total
            liability shall not exceed the registration fee paid.
          </Para>
        </Clause>

        <Clause title="10. Changes & Cancellation">
          <Para>
            The organisers may modify the schedule, format, venue, judges,
            rewards, or any aspect of the event, or postpone or cancel it due to
            circumstances beyond reasonable control (including force majeure).
            Reasonable efforts will be made to inform participants of material
            changes.
          </Para>
        </Clause>

        <Clause title="11. Governing Law & Jurisdiction">
          <Para>
            These Terms are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts at Gurgaon,
            Haryana, India.
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
