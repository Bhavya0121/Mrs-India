"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  SiteContentData,
  TitleDescItem,
  FaqItem,
} from "@/types/content";

type ToastKind = "success" | "error";

const TABS = [
  { key: "marquee", label: "Marquee" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "malaika", label: "Crowned by" },
  { key: "countdown", label: "Countdown" },
  { key: "founder", label: "Founder" },
  { key: "mentors", label: "Mentors / Jury" },
  { key: "categories", label: "Categories" },
  { key: "eligibility", label: "Eligibility" },
  { key: "rewards", label: "Rewards" },
  { key: "workshops", label: "Workshops" },
  { key: "pricing", label: "Pricing" },
  { key: "faq", label: "FAQ" },
  { key: "footer", label: "Footer" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * Coerce the document echoed back by PUT into SiteContentData, falling back to
 * the previous client state for any field the server omitted. (We can't import
 * the defaults here — that module pulls in mongoose, which can't run client-side.)
 */
function coerceReturned(
  raw: Record<string, unknown> | null | undefined,
  prev: SiteContentData
): SiteContentData {
  if (!raw) return prev;
  const str = (v: unknown, f: string) => (typeof v === "string" ? v : f);
  const num = (v: unknown, f: number) =>
    typeof v === "number" && Number.isFinite(v) ? v : f;
  const td = (v: unknown, f: TitleDescItem[]): TitleDescItem[] =>
    Array.isArray(v)
      ? v.map((r) => {
          const o = (r ?? {}) as Record<string, unknown>;
          return { title: str(o.title, ""), description: str(o.description, "") };
        })
      : f;
  const fq = (v: unknown, f: FaqItem[]): FaqItem[] =>
    Array.isArray(v)
      ? v.map((r) => {
          const o = (r ?? {}) as Record<string, unknown>;
          return { question: str(o.question, ""), answer: str(o.answer, "") };
        })
      : f;
  const sl = (v: unknown, f: string[]): string[] =>
    Array.isArray(v) ? v.map((r) => str(r, "")) : f;

  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const about = (raw.about ?? {}) as Record<string, unknown>;
  const malaika = (raw.malaika ?? {}) as Record<string, unknown>;
  const countdown = (raw.countdown ?? {}) as Record<string, unknown>;
  const founder = (raw.founder ?? {}) as Record<string, unknown>;
  const mentorsJury = (raw.mentorsJury ?? {}) as Record<string, unknown>;
  const categoriesHeader = (raw.categoriesHeader ?? {}) as Record<string, unknown>;
  const rewardsHeader = (raw.rewardsHeader ?? {}) as Record<string, unknown>;
  const workshopsHeader = (raw.workshopsHeader ?? {}) as Record<string, unknown>;
  const pricing = (raw.pricing ?? {}) as Record<string, unknown>;
  const faqHeader = (raw.faqHeader ?? {}) as Record<string, unknown>;
  const eligibility = (raw.eligibility ?? {}) as Record<string, unknown>;
  const footer = (raw.footer ?? {}) as Record<string, unknown>;

  return {
    marquee: sl(raw.marquee, prev.marquee),
    hero: {
      eyebrow: str(hero.eyebrow, prev.hero.eyebrow),
      title: str(hero.title, prev.hero.title),
      scriptLine: str(hero.scriptLine, prev.hero.scriptLine),
      subtitle: str(hero.subtitle, prev.hero.subtitle),
      eventDates: str(hero.eventDates, prev.hero.eventDates),
      venue: str(hero.venue, prev.hero.venue),
      crownedBy: str(hero.crownedBy, prev.hero.crownedBy),
      buttonLabel: str(hero.buttonLabel, prev.hero.buttonLabel),
      datesLabel: str(hero.datesLabel, prev.hero.datesLabel),
      venueLabel: str(hero.venueLabel, prev.hero.venueLabel),
      crownedByLabel: str(hero.crownedByLabel, prev.hero.crownedByLabel),
      secondaryCtaLabel: str(hero.secondaryCtaLabel, prev.hero.secondaryCtaLabel),
    },
    about: {
      sectionTitle: str(about.sectionTitle, prev.about.sectionTitle),
      openingLine: str(about.openingLine, prev.about.openingLine),
      paragraph1: str(about.paragraph1, prev.about.paragraph1),
      paragraph2: str(about.paragraph2, prev.about.paragraph2),
      highlights: td(about.highlights, prev.about.highlights),
      eyebrow: str(about.eyebrow, prev.about.eyebrow),
      panelLabel1: str(about.panelLabel1, prev.about.panelLabel1),
      panelLabel2: str(about.panelLabel2, prev.about.panelLabel2),
    },
    malaika: {
      sectionTitle: str(malaika.sectionTitle, prev.malaika.sectionTitle),
      pullQuote: str(malaika.pullQuote, prev.malaika.pullQuote),
      bio: str(malaika.bio, prev.malaika.bio),
      imageEyebrow: str(malaika.imageEyebrow, prev.malaika.imageEyebrow),
      imageName: str(malaika.imageName, prev.malaika.imageName),
      signatureName: str(malaika.signatureName, prev.malaika.signatureName),
      subLabel: str(malaika.subLabel, prev.malaika.subLabel),
      eyebrow: str(malaika.eyebrow, prev.malaika.eyebrow),
    },
    countdown: {
      eyebrow: str(countdown.eyebrow, prev.countdown.eyebrow),
      sectionTitle: str(countdown.sectionTitle, prev.countdown.sectionTitle),
      targetDate: str(countdown.targetDate, prev.countdown.targetDate),
    },
    founder: {
      sectionTitle: str(founder.sectionTitle, prev.founder.sectionTitle),
      quote: str(founder.quote, prev.founder.quote),
      name: str(founder.name, prev.founder.name),
      role: str(founder.role, prev.founder.role),
      bio: sl(founder.bio, prev.founder.bio),
      eyebrow: str(founder.eyebrow, prev.founder.eyebrow),
      leadParagraph: str(founder.leadParagraph, prev.founder.leadParagraph),
    },
    mentorsJury: {
      sectionTitle: str(mentorsJury.sectionTitle, prev.mentorsJury.sectionTitle),
      intro: str(mentorsJury.intro, prev.mentorsJury.intro),
      people: td(mentorsJury.people, prev.mentorsJury.people),
      eyebrow: str(mentorsJury.eyebrow, prev.mentorsJury.eyebrow),
    },
    categories: td(raw.categories, prev.categories),
    categoriesHeader: {
      eyebrow: str(categoriesHeader.eyebrow, prev.categoriesHeader.eyebrow),
      sectionTitle: str(categoriesHeader.sectionTitle, prev.categoriesHeader.sectionTitle),
      intro: str(categoriesHeader.intro, prev.categoriesHeader.intro),
    },
    eligibility: {
      sectionTitle: str(eligibility.sectionTitle, prev.eligibility.sectionTitle),
      intro: str(eligibility.intro, prev.eligibility.intro),
      criteria: sl(eligibility.criteria, prev.eligibility.criteria),
    },
    rewards: td(raw.rewards, prev.rewards),
    rewardsHeader: {
      eyebrow: str(rewardsHeader.eyebrow, prev.rewardsHeader.eyebrow),
      sectionTitle: str(rewardsHeader.sectionTitle, prev.rewardsHeader.sectionTitle),
      intro: str(rewardsHeader.intro, prev.rewardsHeader.intro),
    },
    workshops: td(raw.workshops, prev.workshops),
    workshopsHeader: {
      eyebrow: str(workshopsHeader.eyebrow, prev.workshopsHeader.eyebrow),
      sectionTitle: str(workshopsHeader.sectionTitle, prev.workshopsHeader.sectionTitle),
      intro: str(workshopsHeader.intro, prev.workshopsHeader.intro),
    },
    pricing: {
      eyebrow: str(pricing.eyebrow, prev.pricing.eyebrow),
      sectionTitle: str(pricing.sectionTitle, prev.pricing.sectionTitle),
      currencyLabel: str(pricing.currencyLabel, prev.pricing.currencyLabel),
      feeNote: str(pricing.feeNote, prev.pricing.feeNote),
      buttonLabel: str(pricing.buttonLabel, prev.pricing.buttonLabel),
    },
    faq: fq(raw.faq, prev.faq),
    faqHeader: {
      eyebrow: str(faqHeader.eyebrow, prev.faqHeader.eyebrow),
      sectionTitle: str(faqHeader.sectionTitle, prev.faqHeader.sectionTitle),
    },
    footer: {
      phone1: str(footer.phone1, prev.footer.phone1),
      phone2: str(footer.phone2, prev.footer.phone2),
      email: str(footer.email, prev.footer.email),
      address: str(footer.address, prev.footer.address),
      instagram: str(footer.instagram, prev.footer.instagram),
      facebook: str(footer.facebook, prev.footer.facebook),
      youtube: str(footer.youtube, prev.footer.youtube),
      linkedin: str(footer.linkedin, prev.footer.linkedin),
      registrationFee: num(footer.registrationFee, prev.footer.registrationFee),
      brandName: str(footer.brandName, prev.footer.brandName),
      tagline: str(footer.tagline, prev.footer.tagline),
      description: str(footer.description, prev.footer.description),
      copyright: str(footer.copyright, prev.footer.copyright),
      subNote: str(footer.subNote, prev.footer.subNote),
    },
  };
}

export function ContentEditor({ initial }: { initial: SiteContentData }) {
  const [content, setContent] = useState<SiteContentData>(initial);
  const [tab, setTab] = useState<TabKey>("hero");
  const [saving, setSaving] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastKind, setToastKind] = useState<ToastKind>("success");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToastMessage(message);
    setToastKind(kind);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2800);
  }, []);

  // --- field setters -------------------------------------------------------
  const setHero = (field: keyof SiteContentData["hero"], value: string) =>
    setContent((c) => ({ ...c, hero: { ...c.hero, [field]: value } }));
  const setAbout = (
    field: keyof Omit<SiteContentData["about"], "highlights">,
    value: string
  ) => setContent((c) => ({ ...c, about: { ...c.about, [field]: value } }));
  const setAboutHighlights = (fn: (a: TitleDescItem[]) => TitleDescItem[]) =>
    setContent((c) => ({
      ...c,
      about: { ...c.about, highlights: fn(c.about.highlights) },
    }));
  const setMalaika = (field: keyof SiteContentData["malaika"], value: string) =>
    setContent((c) => ({ ...c, malaika: { ...c.malaika, [field]: value } }));
  const setFounder = (
    field: keyof Omit<SiteContentData["founder"], "bio">,
    value: string
  ) => setContent((c) => ({ ...c, founder: { ...c.founder, [field]: value } }));
  const setFounderBio = (fn: (a: string[]) => string[]) =>
    setContent((c) => ({ ...c, founder: { ...c.founder, bio: fn(c.founder.bio) } }));
  const setMentorsJury = (
    field: keyof Omit<SiteContentData["mentorsJury"], "people">,
    value: string
  ) =>
    setContent((c) => ({
      ...c,
      mentorsJury: { ...c.mentorsJury, [field]: value },
    }));
  const setMentorsJuryPeople = (fn: (a: TitleDescItem[]) => TitleDescItem[]) =>
    setContent((c) => ({
      ...c,
      mentorsJury: { ...c.mentorsJury, people: fn(c.mentorsJury.people) },
    }));
  const setEligibility = (
    field: keyof Omit<SiteContentData["eligibility"], "criteria">,
    value: string
  ) =>
    setContent((c) => ({
      ...c,
      eligibility: { ...c.eligibility, [field]: value },
    }));
  const setEligibilityCriteria = (fn: (a: string[]) => string[]) =>
    setContent((c) => ({
      ...c,
      eligibility: { ...c.eligibility, criteria: fn(c.eligibility.criteria) },
    }));
  const setFooterField = (
    field: keyof Omit<SiteContentData["footer"], "registrationFee">,
    value: string
  ) => setContent((c) => ({ ...c, footer: { ...c.footer, [field]: value } }));
  const setRegistrationFee = (value: number) =>
    setContent((c) => ({ ...c, footer: { ...c.footer, registrationFee: value } }));

  const setMarquee = (fn: (a: string[]) => string[]) =>
    setContent((c) => ({ ...c, marquee: fn(c.marquee) }));
  const setCountdown = (
    field: keyof SiteContentData["countdown"],
    value: string
  ) =>
    setContent((c) => ({ ...c, countdown: { ...c.countdown, [field]: value } }));
  const setCategoriesHeader = (
    field: keyof SiteContentData["categoriesHeader"],
    value: string
  ) =>
    setContent((c) => ({
      ...c,
      categoriesHeader: { ...c.categoriesHeader, [field]: value },
    }));
  const setRewardsHeader = (
    field: keyof SiteContentData["rewardsHeader"],
    value: string
  ) =>
    setContent((c) => ({
      ...c,
      rewardsHeader: { ...c.rewardsHeader, [field]: value },
    }));
  const setWorkshopsHeader = (
    field: keyof SiteContentData["workshopsHeader"],
    value: string
  ) =>
    setContent((c) => ({
      ...c,
      workshopsHeader: { ...c.workshopsHeader, [field]: value },
    }));
  const setPricing = (
    field: keyof SiteContentData["pricing"],
    value: string
  ) => setContent((c) => ({ ...c, pricing: { ...c.pricing, [field]: value } }));
  const setFaqHeader = (
    field: keyof SiteContentData["faqHeader"],
    value: string
  ) =>
    setContent((c) => ({ ...c, faqHeader: { ...c.faqHeader, [field]: value } }));

  const setCategories = (fn: (a: TitleDescItem[]) => TitleDescItem[]) =>
    setContent((c) => ({ ...c, categories: fn(c.categories) }));
  const setRewards = (fn: (a: TitleDescItem[]) => TitleDescItem[]) =>
    setContent((c) => ({ ...c, rewards: fn(c.rewards) }));
  const setWorkshops = (fn: (a: TitleDescItem[]) => TitleDescItem[]) =>
    setContent((c) => ({ ...c, workshops: fn(c.workshops) }));
  const setFaq = (fn: (a: FaqItem[]) => FaqItem[]) =>
    setContent((c) => ({ ...c, faq: fn(c.faq) }));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) {
        throw new Error(`Save failed (${res.status})`);
      }
      const data = (await res.json().catch(() => ({}))) as {
        content?: Record<string, unknown>;
      };
      setContent((prev) => coerceReturned(data.content, prev));
      showToast("success", "Content saved.");
    } catch (err) {
      console.error("Failed to save site content:", err);
      showToast("error", "Could not save content. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="mb-7 flex items-end justify-between gap-5 flex-wrap">
        <div>
          <h1 className="font-serif text-[32px] text-text font-medium leading-tight">
            Content
          </h1>
          <p className="text-text-muted text-[13px] mt-1">
            Edit the text shown on your website.
          </p>
        </div>
        <div className="flex gap-2.5">
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        </div>
      </div>

      <div className="bg-surface border border-border px-7 py-6">
        <div
          role="tablist"
          aria-label="Content sections"
          className="flex border-b border-border mb-7 overflow-x-auto"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`content-tab-${t.key}`}
                aria-selected={active}
                aria-controls={`content-pane-${t.key}`}
                onClick={() => setTab(t.key)}
                className={[
                  "px-[22px] py-3 text-[11px] tracking-[0.22em] uppercase font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap",
                  active
                    ? "text-gold border-gold"
                    : "text-text-muted border-transparent hover:text-text",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`content-pane-${tab}`}
          aria-labelledby={`content-tab-${tab}`}
        >
          {tab === "marquee" ? (
            <>
              <h3 className="font-serif text-[18px] text-text mb-4 font-medium">
                Marquee Phrases
              </h3>
              {content.marquee.map((phrase, i) => (
                <ParagraphRow
                  key={i}
                  num={i}
                  value={phrase}
                  label={`Marquee phrase ${i + 1}`}
                  onChange={(v) =>
                    setMarquee((a) => a.map((x, idx) => (idx === i ? v : x)))
                  }
                  onDelete={() =>
                    setMarquee((a) => a.filter((_, idx) => idx !== i))
                  }
                />
              ))}
              <SmallButton onClick={() => setMarquee((a) => [...a, ""])}>
                + Add Phrase
              </SmallButton>
            </>
          ) : null}

          {tab === "hero" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.hero.eyebrow}
                  onChange={(v) => setHero("eyebrow", v)}
                />
              </FormGrid>
              <FormGrid single>
                <TextAreaField
                  label="Main Title"
                  value={content.hero.title}
                  onChange={(v) => setHero("title", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
              </FormGrid>
              <FormGrid>
                <TextField
                  label="Script Line"
                  value={content.hero.scriptLine}
                  onChange={(v) => setHero("scriptLine", v)}
                />
                <TextField
                  label="Subtitle"
                  value={content.hero.subtitle}
                  onChange={(v) => setHero("subtitle", v)}
                />
                <TextField
                  label="Event Dates"
                  value={content.hero.eventDates}
                  onChange={(v) => setHero("eventDates", v)}
                />
                <TextField
                  label="Venue"
                  value={content.hero.venue}
                  onChange={(v) => setHero("venue", v)}
                />
                <TextField
                  label="Crowned By"
                  value={content.hero.crownedBy}
                  onChange={(v) => setHero("crownedBy", v)}
                />
                <TextField
                  label="Button Label"
                  value={content.hero.buttonLabel}
                  onChange={(v) => setHero("buttonLabel", v)}
                />
                <TextField
                  label="Secondary Button Label"
                  value={content.hero.secondaryCtaLabel}
                  onChange={(v) => setHero("secondaryCtaLabel", v)}
                />
                <TextField
                  label="Stat Label: Dates"
                  value={content.hero.datesLabel}
                  onChange={(v) => setHero("datesLabel", v)}
                />
                <TextField
                  label="Stat Label: Venue"
                  value={content.hero.venueLabel}
                  onChange={(v) => setHero("venueLabel", v)}
                />
                <TextField
                  label="Stat Label: Crowned By"
                  value={content.hero.crownedByLabel}
                  onChange={(v) => setHero("crownedByLabel", v)}
                />
              </FormGrid>
            </>
          ) : null}

          {tab === "about" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.about.eyebrow}
                  onChange={(v) => setAbout("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.about.sectionTitle}
                  onChange={(v) => setAbout("sectionTitle", v)}
                />
                <TextAreaField
                  label="Opening Line"
                  value={content.about.openingLine}
                  onChange={(v) => setAbout("openingLine", v)}
                />
                <TextAreaField
                  label="Paragraph 1"
                  value={content.about.paragraph1}
                  onChange={(v) => setAbout("paragraph1", v)}
                />
                <TextAreaField
                  label="Paragraph 2"
                  value={content.about.paragraph2}
                  onChange={(v) => setAbout("paragraph2", v)}
                />
              </FormGrid>
              <FormGrid>
                <TextField
                  label="Image Panel 1 Label"
                  value={content.about.panelLabel1}
                  onChange={(v) => setAbout("panelLabel1", v)}
                />
                <TextField
                  label="Image Panel 2 Label"
                  value={content.about.panelLabel2}
                  onChange={(v) => setAbout("panelLabel2", v)}
                />
              </FormGrid>
              <TitleDescPane
                heading="Highlights"
                noun="Highlight"
                addLabel="Add Highlight"
                items={content.about.highlights}
                setItems={setAboutHighlights}
              />
            </>
          ) : null}

          {tab === "malaika" ? (
            <FormGrid single>
              <TextField
                label="Eyebrow Text"
                value={content.malaika.eyebrow}
                onChange={(v) => setMalaika("eyebrow", v)}
              />
              <TextField
                label="Section Title"
                value={content.malaika.sectionTitle}
                onChange={(v) => setMalaika("sectionTitle", v)}
              />
              <TextAreaField
                label="Pull Quote"
                value={content.malaika.pullQuote}
                onChange={(v) => setMalaika("pullQuote", v)}
              />
              <TextAreaField
                label="Bio Paragraph"
                value={content.malaika.bio}
                onChange={(v) => setMalaika("bio", v)}
              />
              <TextField
                label="Image Eyebrow"
                value={content.malaika.imageEyebrow}
                onChange={(v) => setMalaika("imageEyebrow", v)}
              />
              <TextField
                label="Image Name"
                value={content.malaika.imageName}
                onChange={(v) => setMalaika("imageName", v)}
              />
              <TextField
                label="Signature Name"
                value={content.malaika.signatureName}
                onChange={(v) => setMalaika("signatureName", v)}
              />
              <TextField
                label="Sub Label"
                value={content.malaika.subLabel}
                onChange={(v) => setMalaika("subLabel", v)}
              />
            </FormGrid>
          ) : null}

          {tab === "countdown" ? (
            <FormGrid single>
              <TextField
                label="Eyebrow Text"
                value={content.countdown.eyebrow}
                onChange={(v) => setCountdown("eyebrow", v)}
              />
              <TextField
                label="Heading"
                value={content.countdown.sectionTitle}
                onChange={(v) => setCountdown("sectionTitle", v)}
                help="Wrap text in {gold}...{/gold} to make it gold italic."
              />
              <TextField
                label="Target Date (ISO)"
                value={content.countdown.targetDate}
                onChange={(v) => setCountdown("targetDate", v)}
                help="ISO format, e.g. 2026-10-28T18:00:00+05:30"
              />
            </FormGrid>
          ) : null}

          {tab === "founder" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.founder.eyebrow}
                  onChange={(v) => setFounder("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.founder.sectionTitle}
                  onChange={(v) => setFounder("sectionTitle", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
                <TextAreaField
                  label="Quote"
                  value={content.founder.quote}
                  onChange={(v) => setFounder("quote", v)}
                />
                <TextAreaField
                  label="Lead Paragraph"
                  value={content.founder.leadParagraph}
                  onChange={(v) => setFounder("leadParagraph", v)}
                />
              </FormGrid>
              <FormGrid>
                <TextField
                  label="Name"
                  value={content.founder.name}
                  onChange={(v) => setFounder("name", v)}
                />
                <TextField
                  label="Role"
                  value={content.founder.role}
                  onChange={(v) => setFounder("role", v)}
                />
              </FormGrid>
              <h3 className="font-serif text-[18px] text-text mb-4 font-medium">
                Bio Paragraphs
              </h3>
              {content.founder.bio.map((para, i) => (
                <ParagraphRow
                  key={i}
                  num={i}
                  value={para}
                  label={`Bio paragraph ${i + 1}`}
                  onChange={(v) =>
                    setFounderBio((a) =>
                      a.map((x, idx) => (idx === i ? v : x))
                    )
                  }
                  onDelete={() =>
                    setFounderBio((a) => a.filter((_, idx) => idx !== i))
                  }
                />
              ))}
              <SmallButton onClick={() => setFounderBio((a) => [...a, ""])}>
                + Add Paragraph
              </SmallButton>
            </>
          ) : null}

          {tab === "mentors" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.mentorsJury.eyebrow}
                  onChange={(v) => setMentorsJury("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.mentorsJury.sectionTitle}
                  onChange={(v) => setMentorsJury("sectionTitle", v)}
                />
                <TextAreaField
                  label="Intro"
                  value={content.mentorsJury.intro}
                  onChange={(v) => setMentorsJury("intro", v)}
                />
              </FormGrid>
              <TitleDescPane
                heading="Mentors & Jury"
                noun="Person"
                addLabel="Add Person"
                items={content.mentorsJury.people}
                setItems={setMentorsJuryPeople}
              />
            </>
          ) : null}

          {tab === "categories" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.categoriesHeader.eyebrow}
                  onChange={(v) => setCategoriesHeader("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.categoriesHeader.sectionTitle}
                  onChange={(v) => setCategoriesHeader("sectionTitle", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
                <TextAreaField
                  label="Intro"
                  value={content.categoriesHeader.intro}
                  onChange={(v) => setCategoriesHeader("intro", v)}
                />
              </FormGrid>
              <TitleDescPane
                heading="Pageant Categories"
                noun="Category"
                addLabel="Add Category"
                items={content.categories}
                setItems={setCategories}
              />
            </>
          ) : null}

          {tab === "eligibility" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Section Title"
                  value={content.eligibility.sectionTitle}
                  onChange={(v) => setEligibility("sectionTitle", v)}
                />
                <TextAreaField
                  label="Intro"
                  value={content.eligibility.intro}
                  onChange={(v) => setEligibility("intro", v)}
                />
              </FormGrid>
              <h3 className="font-serif text-[18px] text-text mb-4 font-medium">
                Eligibility Criteria
              </h3>
              {content.eligibility.criteria.map((para, i) => (
                <ParagraphRow
                  key={i}
                  num={i}
                  value={para}
                  label={`Criterion ${i + 1}`}
                  onChange={(v) =>
                    setEligibilityCriteria((a) =>
                      a.map((x, idx) => (idx === i ? v : x))
                    )
                  }
                  onDelete={() =>
                    setEligibilityCriteria((a) =>
                      a.filter((_, idx) => idx !== i)
                    )
                  }
                />
              ))}
              <SmallButton
                onClick={() => setEligibilityCriteria((a) => [...a, ""])}
              >
                + Add Criterion
              </SmallButton>
            </>
          ) : null}

          {tab === "rewards" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.rewardsHeader.eyebrow}
                  onChange={(v) => setRewardsHeader("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.rewardsHeader.sectionTitle}
                  onChange={(v) => setRewardsHeader("sectionTitle", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
                <TextAreaField
                  label="Intro"
                  value={content.rewardsHeader.intro}
                  onChange={(v) => setRewardsHeader("intro", v)}
                />
              </FormGrid>
              <TitleDescPane
                heading="Rewards & Recognition"
                noun="Reward"
                addLabel="Add Reward"
                items={content.rewards}
                setItems={setRewards}
              />
            </>
          ) : null}

          {tab === "workshops" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.workshopsHeader.eyebrow}
                  onChange={(v) => setWorkshopsHeader("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.workshopsHeader.sectionTitle}
                  onChange={(v) => setWorkshopsHeader("sectionTitle", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
                <TextAreaField
                  label="Intro"
                  value={content.workshopsHeader.intro}
                  onChange={(v) => setWorkshopsHeader("intro", v)}
                />
              </FormGrid>
              <TitleDescPane
                heading="Power Workshops"
                noun="Workshop"
                addLabel="Add Workshop"
                items={content.workshops}
                setItems={setWorkshops}
              />
            </>
          ) : null}

          {tab === "pricing" ? (
            <FormGrid single>
              <TextField
                label="Eyebrow Text"
                value={content.pricing.eyebrow}
                onChange={(v) => setPricing("eyebrow", v)}
              />
              <TextField
                label="Section Title"
                value={content.pricing.sectionTitle}
                onChange={(v) => setPricing("sectionTitle", v)}
                help="Wrap text in {gold}...{/gold} to make it gold italic."
              />
              <TextField
                label="Currency Label"
                value={content.pricing.currencyLabel}
                onChange={(v) => setPricing("currencyLabel", v)}
              />
              <TextField
                label="Fee Note"
                value={content.pricing.feeNote}
                onChange={(v) => setPricing("feeNote", v)}
              />
              <TextField
                label="Button Label"
                value={content.pricing.buttonLabel}
                onChange={(v) => setPricing("buttonLabel", v)}
              />
            </FormGrid>
          ) : null}

          {tab === "faq" ? (
            <>
              <FormGrid single>
                <TextField
                  label="Eyebrow Text"
                  value={content.faqHeader.eyebrow}
                  onChange={(v) => setFaqHeader("eyebrow", v)}
                />
                <TextField
                  label="Section Title"
                  value={content.faqHeader.sectionTitle}
                  onChange={(v) => setFaqHeader("sectionTitle", v)}
                  help="Wrap text in {gold}...{/gold} to make it gold italic."
                />
              </FormGrid>
              <h3 className="font-serif text-[18px] text-text mb-4 font-medium">
                FAQ
              </h3>
              {content.faq.map((it, i) => (
                <ItemRow
                  key={i}
                  num={i}
                  firstValue={it.question}
                  firstLabel={`Question ${i + 1}`}
                  firstPlaceholder="Question"
                  secondValue={it.answer}
                  secondLabel={`Answer ${i + 1}`}
                  secondPlaceholder="Answer"
                  onFirst={(v) =>
                    setFaq((a) =>
                      a.map((x, idx) => (idx === i ? { ...x, question: v } : x))
                    )
                  }
                  onSecond={(v) =>
                    setFaq((a) =>
                      a.map((x, idx) => (idx === i ? { ...x, answer: v } : x))
                    )
                  }
                  onDelete={() => setFaq((a) => a.filter((_, idx) => idx !== i))}
                />
              ))}
              <SmallButton
                onClick={() =>
                  setFaq((a) => [...a, { question: "", answer: "" }])
                }
              >
                + Add Question
              </SmallButton>
            </>
          ) : null}

          {tab === "footer" ? (
            <>
              <FormGrid>
                <TextField
                  label="Phone 1"
                  value={content.footer.phone1}
                  onChange={(v) => setFooterField("phone1", v)}
                />
                <TextField
                  label="Phone 2"
                  value={content.footer.phone2}
                  onChange={(v) => setFooterField("phone2", v)}
                />
                <TextField
                  label="Email"
                  type="email"
                  value={content.footer.email}
                  onChange={(v) => setFooterField("email", v)}
                />
                <TextField
                  label="Office Address"
                  value={content.footer.address}
                  onChange={(v) => setFooterField("address", v)}
                />
                <TextField
                  label="Instagram"
                  value={content.footer.instagram}
                  onChange={(v) => setFooterField("instagram", v)}
                />
                <TextField
                  label="Facebook"
                  value={content.footer.facebook}
                  onChange={(v) => setFooterField("facebook", v)}
                />
                <TextField
                  label="YouTube"
                  value={content.footer.youtube}
                  onChange={(v) => setFooterField("youtube", v)}
                />
                <TextField
                  label="LinkedIn"
                  value={content.footer.linkedin}
                  onChange={(v) => setFooterField("linkedin", v)}
                />
              </FormGrid>
              <FormGrid single>
                <NumberField
                  label="Registration Fee (INR)"
                  value={content.footer.registrationFee}
                  onChange={setRegistrationFee}
                />
                <TextField
                  label="Brand Name"
                  value={content.footer.brandName}
                  onChange={(v) => setFooterField("brandName", v)}
                />
                <TextField
                  label="Tagline"
                  value={content.footer.tagline}
                  onChange={(v) => setFooterField("tagline", v)}
                />
                <TextAreaField
                  label="Description"
                  value={content.footer.description}
                  onChange={(v) => setFooterField("description", v)}
                />
                <TextField
                  label="Copyright"
                  value={content.footer.copyright}
                  onChange={(v) => setFooterField("copyright", v)}
                />
                <TextField
                  label="Sub Note"
                  value={content.footer.subNote}
                  onChange={(v) => setFooterField("subNote", v)}
                />
              </FormGrid>
            </>
          ) : null}
        </div>

        <div className="sticky bottom-0 -mx-7 -mb-6 mt-[30px] px-7 py-4 bg-surface border-t border-border-strong flex justify-between items-center">
          <span className="text-[12px] text-text-muted">
            Make changes and click save
          </span>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </PrimaryButton>
        </div>
      </div>

      <Toast kind={toastKind} message={toastMessage} visible={toastVisible} />
    </>
  );
}

function TitleDescPane({
  heading,
  noun,
  addLabel,
  items,
  setItems,
}: {
  heading: string;
  noun: string;
  addLabel: string;
  items: TitleDescItem[];
  setItems: (fn: (a: TitleDescItem[]) => TitleDescItem[]) => void;
}) {
  return (
    <>
      <h3 className="font-serif text-[18px] text-text mb-4 font-medium">
        {heading}
      </h3>
      {items.map((it, i) => (
        <ItemRow
          key={i}
          num={i}
          firstValue={it.title}
          firstLabel={`${noun} ${i + 1} title`}
          firstPlaceholder="Title"
          secondValue={it.description}
          secondLabel={`${noun} ${i + 1} description`}
          secondPlaceholder="Description"
          onFirst={(v) =>
            setItems((a) =>
              a.map((x, idx) => (idx === i ? { ...x, title: v } : x))
            )
          }
          onSecond={(v) =>
            setItems((a) =>
              a.map((x, idx) => (idx === i ? { ...x, description: v } : x))
            )
          }
          onDelete={() => setItems((a) => a.filter((_, idx) => idx !== i))}
        />
      ))}
      <SmallButton
        onClick={() => setItems((a) => [...a, { title: "", description: "" }])}
      >
        + {addLabel}
      </SmallButton>
    </>
  );
}

function ItemRow({
  num,
  firstValue,
  firstLabel,
  firstPlaceholder,
  secondValue,
  secondLabel,
  secondPlaceholder,
  onFirst,
  onSecond,
  onDelete,
}: {
  num: number;
  firstValue: string;
  firstLabel: string;
  firstPlaceholder: string;
  secondValue: string;
  secondLabel: string;
  secondPlaceholder: string;
  onFirst: (v: string) => void;
  onSecond: (v: string) => void;
  onDelete: () => void;
}) {
  const n = String(num + 1).padStart(2, "0");
  return (
    <div className="grid gap-3.5 items-center mb-2 px-3.5 py-3 bg-bg border border-border grid-cols-[28px_1fr_40px] md:grid-cols-[36px_1fr_1.6fr_40px]">
      <span
        aria-hidden
        className="col-start-1 row-start-1 font-serif text-gold italic text-[18px]"
      >
        {n}
      </span>
      <input
        type="text"
        aria-label={firstLabel}
        value={firstValue}
        placeholder={firstPlaceholder}
        onChange={(e) => onFirst(e.target.value)}
        className="col-start-2 row-start-1 w-full bg-transparent border-0 outline-none text-text text-[13px] px-1.5 py-1.5 focus:bg-surface transition-colors"
      />
      <input
        type="text"
        aria-label={secondLabel}
        value={secondValue}
        placeholder={secondPlaceholder}
        onChange={(e) => onSecond(e.target.value)}
        className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 w-full bg-transparent border-0 outline-none text-text-muted text-[12px] px-1.5 py-1.5 focus:bg-surface transition-colors"
      />
      <button
        type="button"
        aria-label="Delete"
        title="Delete"
        onClick={onDelete}
        className="col-start-3 row-start-1 md:col-start-4 justify-self-center text-text-muted hover:bg-surface-2 hover:text-gold px-2.5 py-1.5 text-base leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
}

function ParagraphRow({
  num,
  value,
  label,
  onChange,
  onDelete,
}: {
  num: number;
  value: string;
  label: string;
  onChange: (v: string) => void;
  onDelete: () => void;
}) {
  const n = String(num + 1).padStart(2, "0");
  return (
    <div className="grid gap-3.5 items-start mb-2 px-3.5 py-3 bg-bg border border-border grid-cols-[28px_1fr_40px] md:grid-cols-[36px_1fr_40px]">
      <span
        aria-hidden
        className="col-start-1 row-start-1 font-serif text-gold italic text-[18px]"
      >
        {n}
      </span>
      <textarea
        aria-label={label}
        value={value}
        placeholder="Paragraph"
        onChange={(e) => onChange(e.target.value)}
        className="col-start-2 row-start-1 w-full bg-transparent border-0 outline-none text-text text-[13px] px-1.5 py-1.5 focus:bg-surface transition-colors resize-y min-h-[72px] leading-[1.6]"
      />
      <button
        type="button"
        aria-label="Delete"
        title="Delete"
        onClick={onDelete}
        className="col-start-3 row-start-1 justify-self-center text-text-muted hover:bg-surface-2 hover:text-gold px-2.5 py-1.5 text-base leading-none transition-colors"
      >
        ×
      </button>
    </div>
  );
}

function FormGrid({
  single,
  children,
}: {
  single?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={[
        "grid gap-5 mb-5 grid-cols-1",
        single ? "" : "md:grid-cols-2",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

const FIELD_INPUT_CLASS =
  "bg-bg border border-border text-text px-3.5 py-[11px] text-[13px] outline-none focus:border-gold transition-colors w-full";
const FIELD_LABEL_CLASS =
  "text-[10px] tracking-[0.25em] uppercase text-gold mb-2 font-medium";

function TextField({
  label,
  value,
  onChange,
  type = "text",
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  help?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_INPUT_CLASS}
      />
      {help ? (
        <span className="text-[11px] text-text-dim mt-1.5">{help}</span>
      ) : null}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD_INPUT_CLASS} resize-y min-h-[80px] leading-[1.6]`}
      />
      {help ? (
        <span className="text-[11px] text-text-dim mt-1.5">{help}</span>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(0);
            return;
          }
          const n = Number(raw);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className={FIELD_INPUT_CLASS}
      />
    </div>
  );
}

function PrimaryButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-[18px] py-[9px] text-[12px] tracking-[0.18em] uppercase font-medium border bg-gold text-bg border-gold hover:bg-gold-bright hover:border-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {children}
    </button>
  );
}

function SmallButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase font-medium border border-border-strong text-text bg-transparent hover:border-gold hover:text-gold transition-colors whitespace-nowrap"
    >
      {children}
    </button>
  );
}

function Toast({
  kind,
  message,
  visible,
}: {
  kind: ToastKind;
  message: string;
  visible: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed top-6 right-6 bg-surface border text-text px-[22px] py-[14px] text-[13px] z-[1000] flex items-center gap-3 transition-transform duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
        kind === "error" ? "border-danger" : "border-gold",
        visible ? "translate-x-0" : "translate-x-[120%]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={
          kind === "error" ? "text-danger text-lg" : "text-success text-lg"
        }
      >
        {kind === "error" ? "!" : "✓"}
      </span>
      <span>{message || " "}</span>
    </div>
  );
}
