import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Countdown from "./_components/Countdown";
import Navbar from "./_components/Navbar";
import RevealOnScroll from "./_components/Reveal";
import { getSiteContent } from "@/lib/site-content";
import { getMediaMap } from "@/lib/media";
import { SITE_NAME, OG_IMAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOME_DESCRIPTION =
  "The Rising Queen of India, Season 01 — a coronation crowned by Sushmita Sen. India's most glamorous pageant for women across five categories. Registrations now open. 28 — 31 October 2026, Goa.";

const HOME_TITLE = "The Rising Queen of India — A Coronation, Season 01";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_IN",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

function parseGold(input: string): ReactNode {
  return input.split(/(\{gold\}[\s\S]*?\{\/gold\})/g).map((part, i) => {
    const match = part.match(/^\{gold\}([\s\S]*?)\{\/gold\}$/);
    if (match) {
      return (
        <em key={i} className="italic text-gold font-light">
          {match[1]}
        </em>
      );
    }
    const lines = part.split("\n");
    return (
      <Fragment key={i}>
        {lines.map((line, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Fragment>
    );
  });
}

const VALUE_ICONS = ["◈", "✦", "♛", "★"];

const CATEGORIES = [
  {
    num: "01",
    icon: "✦",
    name: "Debutante",
    desc: "For the rising voices stepping into the spotlight with fresh ambition.",
    gradient: "linear-gradient(160deg, #3C0F1F 0%, #14080C 100%)",
  },
  {
    num: "02",
    icon: "♛",
    name: "Sovereign",
    desc: "For the women who lead with intention. In career, in family, in life.",
    gradient: "linear-gradient(160deg, #8B6F38 0%, #1A0F12 100%)",
  },
  {
    num: "03",
    icon: "❦",
    name: "Maharani",
    desc: "For the icons who command rooms with elegance and earned grace.",
    gradient: "linear-gradient(160deg, #5C1428 0%, #14080C 100%)",
  },
  {
    num: "04",
    icon: "❤",
    name: "Bold & Beautiful",
    desc: "A stage that celebrates curves, confidence, and beauty in every shape.",
    gradient: "linear-gradient(160deg, #3C0F1F 0%, #8B6F38 100%)",
  },
  {
    num: "05",
    icon: "⚔",
    name: "Shakti",
    desc: "For the fighters who rewrote their story against the odds.",
    gradient: "linear-gradient(160deg, #14080C 0%, #5C1428 100%)",
  },
];

const WORKSHOPS = [
  ["♛", "Ramp Walk & Posing", "Master the runway with industry choreographers. Learn the carriage, the pause, the gaze."],
  ["✦", "Glam, Skin & Hair", "Pro makeup, skincare regimens, and editorial hair styling led by celebrity artists."],
  ["❦", "Confidence & Etiquette", "Public speaking, presentation, dining etiquette, and the grace of presence."],
  ["⚔", "Self-Defence & Power", "A practical, empowering workshop in personal safety and inner strength."],
  ["❤", "Wellness & Nutrition", "Sustainable fitness, gut health, and the science of feeling extraordinary every day."],
  ["★", "Entrepreneurial Bootcamp", "A full-day intensive for women who want to launch, lead, and scale their own ventures."],
  ["◈", "Personal Branding", "Build a digital identity that opens doors and a brand that compounds over time."],
  ["✺", "Spiritual & Mental Wellness", "Mindfulness, healing, and tools to anchor yourself in any storm."],
  ["⟁", "Cyber Safety", "Essential knowledge for the connected woman. Stay safe, stay sovereign."],
];

const ROMAN_NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];

function toRoman(n: number): string {
  return ROMAN_NUMERALS[n - 1] ?? String(n);
}

const MARQUEE = [
  "Registrations Now Open",
  "Crowned by Sushmita Sen",
  "28 — 31 Oct 2026 · Goa",
  "The Rising Queen · Season 01",
];

export default async function LandingPage() {
  const [siteContent, mediaMap] = await Promise.all([
    getSiteContent(),
    getMediaMap(),
  ]);

  const {
    marquee,
    hero,
    about,
    malaika,
    countdown,
    founder,
    categories,
    categoriesHeader,
    rewards,
    rewardsHeader,
    workshops,
    workshopsHeader,
    mentorsJury,
    eligibility,
    pricing,
    faq,
    faqHeader,
    footer,
  } = siteContent;

  const marqueeItems = marquee.length > 0 ? marquee : MARQUEE;

  return (
    <>
      <RevealOnScroll />

      {/* MARQUEE */}
      <div className="bg-black-soft text-gold py-3 text-[11px] tracking-[0.35em] uppercase overflow-hidden border-b border-[color:var(--line)]">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} className="px-8 inline-flex items-center">
              {t}
              <span className="ml-8 text-gold-bright">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        {mediaMap["hero-main"] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaMap["hero-main"]}
            alt="Hero image"
            className="absolute inset-0 w-full h-full object-cover object-[center_15%] md:object-[center_20%] lg:object-top z-0"
          />
        ) : null}
        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,5,7,0.85) 0%, rgba(10,5,7,0.55) 40%, transparent 75%)," +
              "linear-gradient(0deg, rgba(10,5,7,0.85) 0%, transparent 45%)",
          }}
        />
        <div className="relative z-[2] w-full max-w-[1320px] mx-auto px-6 lg:px-10 py-20">
          <div className="reveal max-w-[640px]">
            <div className="flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-9">
              <span className="w-12 h-px bg-gold" />
              {hero.eyebrow}
            </div>
            <h1 className="font-serif font-normal text-cream leading-[0.95] tracking-[-0.01em] text-[clamp(54px,7vw,108px)] mb-5 drop-shadow-[0_4px_40px_rgba(0,0,0,0.6)]">
              {parseGold(hero.title)}
            </h1>
            <p className="font-script text-gold-bright text-[42px] sm:text-[52px] leading-none mb-7 not-italic inline-block">
              {hero.scriptLine}
            </p>
            <p className="font-serif italic text-cream-muted text-xl sm:text-[22px] mb-12 max-w-[480px] leading-[1.5]">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-9 py-6 border-y border-[color:var(--line)] mb-12">
              {[
                [hero.datesLabel, hero.eventDates],
                [hero.venueLabel, hero.venue],
                [hero.crownedByLabel, hero.crownedBy],
              ].map(([k, v], i) => (
                <div key={i}>
                  {k ? (
                    <span className="block text-[10px] tracking-[0.32em] uppercase text-gold mb-1.5">
                      {k}
                    </span>
                  ) : null}
                  <span className="font-serif text-[20px] text-cream font-medium">
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-black text-[11px] tracking-[0.28em] uppercase border border-gold transition-colors hover:bg-cream"
              >
                {hero.buttonLabel} <span aria-hidden>→</span>
              </Link>
              {hero.secondaryCtaLabel ? (
                <a
                  href="#about"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-gold text-cream text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-gold hover:text-black"
                >
                  {hero.secondaryCtaLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="bg-black-warm border-y border-[color:var(--line)] py-12 lg:py-14">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-14">
            {about.highlights.map((item, i) => (
              <div key={i} className="reveal" data-delay={i}>
                <span className="text-2xl text-gold mb-3.5 block">
                  {VALUE_ICONS[i % VALUE_ICONS.length]}
                </span>
                <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-2 font-medium">
                  {item.title}
                </div>
                <p className="text-[13px] text-cream-muted leading-[1.6]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="mb-16 lg:mb-20 reveal">
            {about.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6">
                <span className="w-10 h-px bg-gold" />
                {about.eyebrow}
              </div>
            ) : null}
            <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
              {parseGold(about.sectionTitle)}
            </h2>
          </div>
          <div className="grid lg:grid-cols-[1.1fr_1fr_1fr] gap-10 items-stretch">
            <div className="py-10 reveal">
              <p className="font-serif italic text-[24px] text-cream leading-[1.5] mb-5">
                {about.openingLine}
              </p>
              <p className="text-[15px] text-cream-muted leading-[1.8]">
                {about.paragraph1}
              </p>
              {about.paragraph2 ? (
                <p className="text-[15px] text-cream-muted leading-[1.8] mt-5">
                  {about.paragraph2}
                </p>
              ) : null}
            </div>
            <AboutPanel
              gradient="linear-gradient(160deg, rgba(201,169,97,0.25), rgba(10,5,7,0.7)), radial-gradient(circle at 50% 30%, #5C1428, #14080C)"
              label={about.panelLabel1}
              src={mediaMap["about-1"]}
              alt="About image one"
            />
            <AboutPanel
              gradient="linear-gradient(160deg, rgba(92,20,40,0.5), rgba(10,5,7,0.85)), radial-gradient(circle at 30% 60%, #8B6F38, #14080C)"
              label={about.panelLabel2}
              src={mediaMap["about-2"]}
              alt="About image two"
            />
          </div>
        </div>
      </section>

      {/* SUSHMITA */}
      <section
        id="sushmita"
        className="relative overflow-hidden py-24 lg:py-32 bg-black-warm"
      >
        <span
          aria-hidden
          className="absolute top-10 right-[60px] text-gold text-[320px] leading-none opacity-[0.04] pointer-events-none select-none"
        >
          ♛
        </span>
        <div className="relative z-[2] max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            <div className="reveal relative">
              <div
                className="aspect-[3/4] border border-gold relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(201,169,97,0.25), rgba(10,5,7,0.7))," +
                    "radial-gradient(circle at 50% 30%, #5C1428, #14080C)",
                }}
              >
                {mediaMap["sushmita"] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaMap["sushmita"]}
                    alt="Sushmita Sen"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif italic text-gold text-[200px] leading-none opacity-10 select-none">
                      ♛
                    </span>
                  </div>
                )}
                <div className="absolute inset-3 border border-[rgba(235,228,214,0.15)] pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent z-[1] pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-[2] [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]">
                  {malaika.imageEyebrow ? (
                    <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-1.5">
                      {malaika.imageEyebrow}
                    </span>
                  ) : null}
                  {malaika.imageName ? (
                    <span className="font-serif italic text-cream text-[28px] leading-none">
                      {malaika.imageName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-gold -z-10 hidden sm:block" />
            </div>
            <div className="reveal">
              {malaika.eyebrow ? (
                <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6">
                  <span className="w-10 h-px bg-gold" />
                  {malaika.eyebrow}
                </div>
              ) : null}
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em]">
                {parseGold(malaika.sectionTitle)}
              </h2>
              <p className="font-serif italic text-cream text-[26px] leading-[1.55] my-9 pl-8 border-l-2 border-gold">
                {malaika.pullQuote}
              </p>
              <p className="text-cream-muted text-[15px] leading-[1.8] mb-8">
                {malaika.bio}
              </p>
              {malaika.signatureName ? (
                <div className="font-script text-gold text-[36px] leading-none">
                  {malaika.signatureName}
                </div>
              ) : null}
              {malaika.subLabel ? (
                <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mt-2">
                  {malaika.subLabel}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section
        className="py-24 text-center relative overflow-hidden border-y border-[color:var(--line)]"
        style={{
          background: "linear-gradient(180deg, #0a0507 0%, #1a0f12 100%)",
        }}
      >
        <div className="absolute -top-[200px] -left-[200px] w-[400px] h-[400px] border border-[color:var(--line)] rounded-full" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[400px] h-[400px] border border-[color:var(--line)] rounded-full" />
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 reveal">
          {countdown.eyebrow ? (
            <p className="text-[11px] tracking-[0.45em] uppercase text-gold mb-3.5">
              {countdown.eyebrow}
            </p>
          ) : null}
          {countdown.sectionTitle ? (
            <h2 className="font-serif italic text-cream font-normal text-3xl sm:text-4xl lg:text-[44px] mb-12">
              {parseGold(countdown.sectionTitle)}
            </h2>
          ) : null}
          <Countdown targetDate={countdown.targetDate} />
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20 reveal">
            {categoriesHeader.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
                <span className="w-10 h-px bg-gold" />
                {categoriesHeader.eyebrow}
              </div>
            ) : null}
            {categoriesHeader.sectionTitle ? (
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                {parseGold(categoriesHeader.sectionTitle)}
              </h2>
            ) : null}
            {categoriesHeader.intro ? (
              <p className="font-serif italic text-cream-muted text-[22px] max-w-[720px] mx-auto leading-[1.5]">
                {categoriesHeader.intro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            {categories.map((cat, i) => {
              const style = CATEGORIES[i % CATEGORIES.length];
              const catSlot = [
                "category-diva",
                "category-queen",
                "category-legend",
                "category-shakti",
              ][i];
              return (
                <div
                  key={i}
                  className="reveal h-full bg-black-soft border border-[color:var(--line)] transition-all duration-500 hover:-translate-y-2.5 hover:border-gold hover:shadow-[0_30px_70px_rgba(201,169,97,0.15)] overflow-hidden group"
                  data-delay={i}
                >
                  <div
                    className="aspect-[3/4] flex items-center justify-center relative overflow-hidden"
                    style={{ background: style.gradient }}
                  >
                    {catSlot && mediaMap[catSlot] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaMap[catSlot]}
                        alt={`${cat.title} category`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                    <span className="absolute top-5 left-5 font-serif italic text-sm text-gold tracking-[0.2em] z-[2]">
                      {style.num}
                    </span>
                    <span className="absolute inset-3.5 border border-[rgba(201,169,97,0.2)] pointer-events-none" />
                    {catSlot && mediaMap[catSlot] ? null : (
                      <span className="text-[64px] text-gold z-[2]">{style.icon}</span>
                    )}
                  </div>
                  <div className="p-7">
                    <h3 className="font-serif font-medium text-cream text-[28px] mb-3.5">
                      {cat.title}
                    </h3>
                    <p className="text-[13px] text-cream-muted leading-[1.6]">
                      {cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REWARDS */}
      <section id="rewards" className="py-24 lg:py-32 bg-black-warm/40">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20 reveal">
            {rewardsHeader.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
                <span className="w-10 h-px bg-gold" />
                {rewardsHeader.eyebrow}
              </div>
            ) : null}
            {rewardsHeader.sectionTitle ? (
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                {parseGold(rewardsHeader.sectionTitle)}
              </h2>
            ) : null}
            {rewardsHeader.intro ? (
              <p className="font-serif italic text-cream-muted text-[22px] max-w-[720px] mx-auto leading-[1.5]">
                {rewardsHeader.intro}
              </p>
            ) : null}
          </div>
          <div className="grid sm:grid-cols-2 border-t border-l border-[color:var(--line)] reveal">
            {rewards.map((reward, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={i}
                  className="flex gap-7 items-start p-10 border-r border-b border-[color:var(--line)] transition-colors hover:bg-black-warm"
                >
                  <span className="font-serif italic text-[38px] text-gold leading-none min-w-[60px] font-normal">
                    {num}
                  </span>
                  <div>
                    <h4 className="font-serif font-medium text-cream text-[22px] mb-2.5">
                      {reward.title}
                    </h4>
                    <p className="text-sm text-cream-muted leading-[1.6]">
                      {reward.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKSHOPS */}
      <section
        id="workshops"
        className="py-24 lg:py-32 relative"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(92,20,40,0.2) 0%, transparent 60%), #0a0507",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20 reveal">
            {workshopsHeader.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
                <span className="w-10 h-px bg-gold" />
                {workshopsHeader.eyebrow}
              </div>
            ) : null}
            {workshopsHeader.sectionTitle ? (
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                {parseGold(workshopsHeader.sectionTitle)}
              </h2>
            ) : null}
            {workshopsHeader.intro ? (
              <p className="font-serif italic text-cream-muted text-[22px] max-w-[720px] mx-auto leading-[1.5]">
                {workshopsHeader.intro}
              </p>
            ) : null}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, i) => {
              const icon = WORKSHOPS[i % WORKSHOPS.length][0];
              return (
                <div
                  key={i}
                  className="reveal bg-black-soft border border-[color:var(--line)] p-10 relative overflow-hidden transition-all duration-400 hover:border-gold hover:-translate-y-1.5 hover:bg-black-warm group"
                  data-delay={i}
                >
                  <span className="absolute top-0 left-0 w-0 h-0.5 bg-gold transition-[width] duration-500 group-hover:w-full" />
                  <span className="text-[36px] text-gold mb-5 block">{icon}</span>
                  <h4 className="font-serif font-medium text-cream text-2xl mb-3.5">
                    {workshop.title}
                  </h4>
                  <p className="text-[13px] text-cream-muted leading-[1.7]">
                    {workshop.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MENTORS & JURY */}
      <section
        id="mentors"
        className="py-24 lg:py-32 bg-black-warm"
        style={{ scrollMarginTop: "90px" }}
      >
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20 reveal">
            {mentorsJury.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
                <span className="w-10 h-px bg-gold" />
                {mentorsJury.eyebrow}
              </div>
            ) : null}
            {mentorsJury.sectionTitle ? (
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                {parseGold(mentorsJury.sectionTitle)}
              </h2>
            ) : null}
            {mentorsJury.intro ? (
              <p className="font-serif italic text-cream-muted text-[22px] max-w-[720px] mx-auto leading-[1.5]">
                {mentorsJury.intro}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 w-full">
            {mentorsJury.people.map((mentor, i) => {
              const mediaKey = `mentor-${i + 1}`;
              return (
                <div key={i} className="reveal flex flex-col items-center text-center" data-delay={i}>
                  <div
                    className="aspect-square w-full max-w-[300px] rounded-full border border-gold relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(201,169,97,0.25), rgba(10,5,7,0.7))," +
                        "radial-gradient(circle at 50% 30%, #5C1428, #14080C)",
                    }}
                  >
                    {mediaMap[mediaKey] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaMap[mediaKey]}
                        alt={mentor.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif italic text-gold text-[140px] leading-none opacity-10 select-none">
                          ♛
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-3 border border-[rgba(235,228,214,0.15)] rounded-full pointer-events-none" />
                  </div>
                  <h3 className="font-serif font-medium text-cream text-[26px] mt-7 mb-2">
                    {mentor.title}
                  </h3>
                  <p className="text-[11px] tracking-[0.25em] uppercase text-gold">
                    {mentor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section
        id="founder"
        className="relative overflow-hidden py-24 lg:py-32 bg-black-warm"
        style={{ scrollMarginTop: "90px" }}
      >
        <span
          aria-hidden
          className="absolute top-10 left-[60px] text-gold text-[320px] leading-none opacity-[0.04] pointer-events-none select-none"
        >
          ✦
        </span>
        <div className="relative z-[2] max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            <div className="reveal relative">
              <div
                className="aspect-[3/4] border border-gold relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(201,169,97,0.25), rgba(10,5,7,0.7))," +
                    "radial-gradient(circle at 50% 30%, #5C1428, #14080C)",
                }}
              >
                {mediaMap["founder"] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaMap["founder"]}
                    alt={founder.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif italic text-gold text-[200px] leading-none opacity-10 select-none">
                      ♛
                    </span>
                  </div>
                )}
                <div className="absolute inset-3 border border-[rgba(235,228,214,0.15)] pointer-events-none" />
                <div className="absolute bottom-6 left-6 z-[2]">
                  <span className="block text-[10px] tracking-[0.4em] uppercase text-gold opacity-80 mb-1.5">
                    {founder.role}
                  </span>
                  <span className="font-serif italic text-cream text-[28px] leading-none">
                    {founder.name}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border border-gold -z-10 hidden sm:block" />
            </div>
            <div className="reveal">
              {founder.eyebrow ? (
                <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6">
                  <span className="w-10 h-px bg-gold" />
                  {founder.eyebrow}
                </div>
              ) : null}
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em]">
                {parseGold(founder.sectionTitle)}
              </h2>
              <p className="font-serif italic text-cream text-[26px] leading-[1.55] my-9 pl-8 border-l-2 border-gold">
                {founder.quote}
              </p>
              {founder.leadParagraph ? (
                <p className="text-cream text-[18px] leading-[1.8] mb-8">
                  {founder.leadParagraph}
                </p>
              ) : null}
              {founder.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-cream-muted text-[15px] leading-[1.8] mb-5"
                >
                  {paragraph}
                </p>
              ))}
              <div className="font-script text-gold text-[36px] leading-none mt-2">
                {founder.name}
              </div>
              <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mt-2">
                {founder.role}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section id="eligibility" className="py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
            <div className="reveal">
              {eligibility.sectionTitle ? (
                <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6">
                  <span className="w-10 h-px bg-gold" />
                  {eligibility.sectionTitle}
                </div>
              ) : null}
              {/* <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                Eligibility
              </h2> */}
              {eligibility.intro ? (
                <p className="text-cream-muted text-[15px] leading-[1.7]">
                  {eligibility.intro}
                </p>
              ) : null}
            </div>
            <div className="reveal">
              {eligibility.criteria.map((criterion, i) => {
                const sep = criterion.indexOf(" — ");
                const title = sep >= 0 ? criterion.slice(0, sep) : criterion;
                const description = sep >= 0 ? criterion.slice(sep + 3) : "";
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr] gap-6 sm:gap-8 py-8 border-b border-[color:var(--line)] items-center ${
                      i === 0 ? "border-t" : ""
                    }`}
                  >
                    <span className="font-serif italic text-gold text-[34px] font-normal">
                      {`${toRoman(i + 1)}.`}
                    </span>
                    <div>
                      <h4 className={`font-serif font-medium text-cream text-[26px] ${description ? "mb-2" : ""}`}>
                        {title}
                      </h4>
                      {description ? (
                        <p className="text-cream-muted text-[15px]">{description}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING CTA */}
      <section
        id="pricing"
        className="text-center py-32 relative overflow-hidden border-y border-[color:var(--line)]"
        style={{
          background: "linear-gradient(180deg, #0a0507 0%, #1a0f12 100%)",
        }}
      >
        <span className="absolute top-14 left-[10%] text-gold text-[28px] opacity-30">✦</span>
        <span className="absolute bottom-14 right-[10%] text-gold text-[28px] opacity-30">✦</span>
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10 reveal">
          {pricing.eyebrow ? (
            <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
              <span className="w-10 h-px bg-gold" />
              {pricing.eyebrow}
            </div>
          ) : null}
          {pricing.sectionTitle ? (
            <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
              {parseGold(pricing.sectionTitle)}
            </h2>
          ) : null}
          <div className="inline-flex items-baseline gap-3.5 my-12 px-10 sm:px-16 py-9 border-y border-gold">
            {pricing.currencyLabel ? (
              <span className="font-serif italic text-gold text-3xl">
                {pricing.currencyLabel}
              </span>
            ) : null}
            <span className="font-serif text-cream text-[72px] sm:text-[96px] leading-none font-normal">
              {footer.registrationFee.toLocaleString("en-IN")}
            </span>
          </div>
          {pricing.feeNote ? (
            <p className="text-[11px] tracking-[0.4em] uppercase text-cream-muted mb-11">
              {pricing.feeNote}
            </p>
          ) : null}
          <div>
            {pricing.buttonLabel ? (
              <Link
                href="/register"
                className="inline-flex items-center gap-3 px-12 py-5 bg-gold text-black text-[11px] tracking-[0.28em] uppercase border border-gold transition-colors hover:bg-cream"
              >
                {pricing.buttonLabel} <span aria-hidden>→</span>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20 reveal">
            {faqHeader.eyebrow ? (
              <div className="inline-flex items-center gap-4 text-[11px] tracking-[0.45em] uppercase text-gold mb-6 justify-center">
                <span className="w-10 h-px bg-gold" />
                {faqHeader.eyebrow}
              </div>
            ) : null}
            {faqHeader.sectionTitle ? (
              <h2 className="font-serif font-normal text-cream text-[clamp(42px,5.5vw,72px)] leading-[1.02] tracking-[-0.01em] mb-7">
                {parseGold(faqHeader.sectionTitle)}
              </h2>
            ) : null}
          </div>
          <div className="max-w-[920px] mx-auto reveal">
            {faq.map((item, i) => (
              <details key={i} className="faq-item border-b border-[color:var(--line)] py-8 group">
                <summary className="flex justify-between items-center font-serif font-medium text-cream text-xl sm:text-2xl gap-6">
                  <span>{item.question}</span>
                  <span className="faq-toggle shrink-0 w-9 h-9 border border-gold rounded-full flex items-center justify-center text-gold text-lg transition-all duration-300">
                    +
                  </span>
                </summary>
                <p className="text-cream-muted leading-[1.7] text-[15px] mt-4">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black-soft text-cream-muted pt-24 pb-8 border-t border-[color:var(--line)]">
        <div className="max-w-[1320px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-12 lg:gap-16 mb-16">
            <div>
              {footer.brandName ? (
                <h3 className="font-serif text-3xl text-cream mb-2 tracking-[0.18em]">
                  {footer.brandName}
                </h3>
              ) : null}
              {footer.tagline ? (
                <p className="font-script text-gold text-[28px] leading-none mb-5">
                  {footer.tagline}
                </p>
              ) : null}
              {footer.description ? (
                <p className="text-sm leading-[1.7] mb-7">
                  {footer.description}
                </p>
              ) : null}
              {(() => {
                const socials = [
                  ["Ⓘ", footer.instagram],
                  ["Ⓕ", footer.facebook],
                  ["▶", footer.youtube],
                  ["in", footer.linkedin],
                ].filter(([, href]) => Boolean(href));
                if (socials.length === 0) return null;
                return (
                  <div className="flex gap-3.5">
                    {socials.map(([s, href]) => (
                      <a
                        key={s}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social link"
                        className="w-10 h-10 border border-gold-deep rounded-full flex items-center justify-center text-gold text-sm transition-all duration-300 hover:bg-gold hover:text-black hover:-translate-y-0.5"
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                );
              })()}
            </div>
            <FooterCol
              title="Explore"
              items={[
                ["#about", "About"],
                ["#categories", "Categories"],
                ["#rewards", "Rewards"],
                ["#workshops", "Workshops"],
              ]}
            />
            <FooterCol
              title="Resources"
              items={[
                ["#faq", "FAQ"],
                ["/register", "Apply Now"],
                ["/privacy", "Privacy Policy"],
                ["/terms", "Terms & Conditions"],
              ]}
            />
            <div>
              <h4 className="font-serif text-lg text-gold mb-6 tracking-[0.1em]">
                Contact
              </h4>
              <ContactItem
                label="Reach Us"
                lines={[footer.phone1, footer.phone2]}
              />
              <ContactItem
                label="Email"
                lines={[footer.email]}
              />
              <ContactItem
                label="Office"
                lines={[footer.address]}
              />
            </div>
          </div>
          <div className="border-t border-[color:var(--line)] pt-7 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs opacity-70">
            {footer.copyright ? <p>{footer.copyright}</p> : null}
            {footer.subNote ? <p>{footer.subNote}</p> : null}
          </div>
        </div>
      </footer>
    </>
  );
}

function AboutPanel({
  gradient,
  label,
  src,
  alt,
}: {
  gradient: string;
  label: string;
  src?: string;
  alt?: string;
}) {
  return (
    <div className="reveal aspect-[3/4] border border-[color:var(--line)] relative" style={{ background: gradient }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}
      <div className="absolute inset-3 border border-[rgba(235,228,214,0.15)] pointer-events-none" />
      {src ? null : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="font-serif italic text-gold text-[72px] opacity-50 leading-none mb-4">
            ♛
          </span>
          {label ? (
            <span className="text-[10px] tracking-[0.4em] uppercase text-gold opacity-80">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div>
      <h4 className="font-serif text-lg text-gold mb-6 tracking-[0.1em]">{title}</h4>
      <ul className="list-none">
        {items.map(([href, label]) => (
          <li key={label} className="mb-3.5 text-sm">
            {href.startsWith("/") ? (
              <Link href={href} className="transition-colors hover:text-gold">
                {label}
              </Link>
            ) : (
              <a href={href} className="transition-colors hover:text-gold">
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="mb-5 text-sm leading-[1.6]">
      <strong className="block text-[10px] tracking-[0.32em] uppercase text-gold mb-1.5 font-medium">
        {label}
      </strong>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </div>
  );
}
