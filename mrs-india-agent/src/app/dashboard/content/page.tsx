import { connectToDatabase } from "@/lib/mongodb";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/models/SiteContent";
import { Application } from "@/models/Application";
import { auth } from "@/auth";
import type {
  SiteContentData,
  TitleDescItem,
  FaqItem,
} from "@/types/content";
import { Sidebar } from "../sidebar";
import { ContentEditor } from "./content-editor";

export const dynamic = "force-dynamic";

function str(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function strList(value: unknown, fallback: readonly string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((item) => str(item, ""));
}

function titleDescList(value: unknown): TitleDescItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    return {
      title: str(item.title, ""),
      description: str(item.description, ""),
    };
  });
}

function faqList(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw) => {
    const item = (raw ?? {}) as Record<string, unknown>;
    return {
      question: str(item.question, ""),
      answer: str(item.answer, ""),
    };
  });
}

/**
 * Merge a (possibly partial) stored document onto the defaults so every
 * field the controlled form binds to is always a defined string/number.
 */
function normalizeContent(raw: Record<string, unknown> | null): SiteContentData {
  const d = DEFAULT_SITE_CONTENT;
  const hero = (raw?.hero ?? {}) as Record<string, unknown>;
  const about = (raw?.about ?? {}) as Record<string, unknown>;
  const malaika = (raw?.malaika ?? {}) as Record<string, unknown>;
  const countdown = (raw?.countdown ?? {}) as Record<string, unknown>;
  const founder = (raw?.founder ?? {}) as Record<string, unknown>;
  const mentorsJury = (raw?.mentorsJury ?? {}) as Record<string, unknown>;
  const categoriesHeader = (raw?.categoriesHeader ?? {}) as Record<string, unknown>;
  const rewardsHeader = (raw?.rewardsHeader ?? {}) as Record<string, unknown>;
  const workshopsHeader = (raw?.workshopsHeader ?? {}) as Record<string, unknown>;
  const pricing = (raw?.pricing ?? {}) as Record<string, unknown>;
  const faqHeader = (raw?.faqHeader ?? {}) as Record<string, unknown>;
  const eligibility = (raw?.eligibility ?? {}) as Record<string, unknown>;
  const footer = (raw?.footer ?? {}) as Record<string, unknown>;

  return {
    marquee: raw?.marquee ? strList(raw.marquee, d.marquee) : [...d.marquee],
    hero: {
      eyebrow: str(hero.eyebrow, d.hero.eyebrow),
      title: str(hero.title, d.hero.title),
      scriptLine: str(hero.scriptLine, d.hero.scriptLine),
      subtitle: str(hero.subtitle, d.hero.subtitle),
      eventDates: str(hero.eventDates, d.hero.eventDates),
      venue: str(hero.venue, d.hero.venue),
      crownedBy: str(hero.crownedBy, d.hero.crownedBy),
      buttonLabel: str(hero.buttonLabel, d.hero.buttonLabel),
      datesLabel: str(hero.datesLabel, d.hero.datesLabel),
      venueLabel: str(hero.venueLabel, d.hero.venueLabel),
      crownedByLabel: str(hero.crownedByLabel, d.hero.crownedByLabel),
      secondaryCtaLabel: str(hero.secondaryCtaLabel, d.hero.secondaryCtaLabel),
    },
    about: {
      sectionTitle: str(about.sectionTitle, d.about.sectionTitle),
      openingLine: str(about.openingLine, d.about.openingLine),
      paragraph1: str(about.paragraph1, d.about.paragraph1),
      paragraph2: str(about.paragraph2, d.about.paragraph2),
      highlights: about.highlights
        ? titleDescList(about.highlights)
        : titleDescList(d.about.highlights),
      eyebrow: str(about.eyebrow, d.about.eyebrow),
      panelLabel1: str(about.panelLabel1, d.about.panelLabel1),
      panelLabel2: str(about.panelLabel2, d.about.panelLabel2),
    },
    malaika: {
      sectionTitle: str(malaika.sectionTitle, d.malaika.sectionTitle),
      pullQuote: str(malaika.pullQuote, d.malaika.pullQuote),
      bio: str(malaika.bio, d.malaika.bio),
      imageEyebrow: str(malaika.imageEyebrow, d.malaika.imageEyebrow),
      imageName: str(malaika.imageName, d.malaika.imageName),
      signatureName: str(malaika.signatureName, d.malaika.signatureName),
      subLabel: str(malaika.subLabel, d.malaika.subLabel),
      eyebrow: str(malaika.eyebrow, d.malaika.eyebrow),
    },
    countdown: {
      eyebrow: str(countdown.eyebrow, d.countdown.eyebrow),
      sectionTitle: str(countdown.sectionTitle, d.countdown.sectionTitle),
      targetDate: str(countdown.targetDate, d.countdown.targetDate),
    },
    founder: {
      sectionTitle: str(founder.sectionTitle, d.founder.sectionTitle),
      quote: str(founder.quote, d.founder.quote),
      name: str(founder.name, d.founder.name),
      role: str(founder.role, d.founder.role),
      bio: strList(founder.bio, d.founder.bio),
      eyebrow: str(founder.eyebrow, d.founder.eyebrow),
      leadParagraph: str(founder.leadParagraph, d.founder.leadParagraph),
    },
    mentorsJury: {
      sectionTitle: str(mentorsJury.sectionTitle, d.mentorsJury.sectionTitle),
      intro: str(mentorsJury.intro, d.mentorsJury.intro),
      people: mentorsJury.people
        ? titleDescList(mentorsJury.people)
        : titleDescList(d.mentorsJury.people),
      eyebrow: str(mentorsJury.eyebrow, d.mentorsJury.eyebrow),
    },
    categories: raw?.categories
      ? titleDescList(raw.categories)
      : titleDescList(d.categories),
    categoriesHeader: {
      eyebrow: str(categoriesHeader.eyebrow, d.categoriesHeader.eyebrow),
      sectionTitle: str(categoriesHeader.sectionTitle, d.categoriesHeader.sectionTitle),
      intro: str(categoriesHeader.intro, d.categoriesHeader.intro),
    },
    eligibility: {
      sectionTitle: str(eligibility.sectionTitle, d.eligibility.sectionTitle),
      intro: str(eligibility.intro, d.eligibility.intro),
      criteria: strList(eligibility.criteria, d.eligibility.criteria),
    },
    rewards: raw?.rewards ? titleDescList(raw.rewards) : titleDescList(d.rewards),
    rewardsHeader: {
      eyebrow: str(rewardsHeader.eyebrow, d.rewardsHeader.eyebrow),
      sectionTitle: str(rewardsHeader.sectionTitle, d.rewardsHeader.sectionTitle),
      intro: str(rewardsHeader.intro, d.rewardsHeader.intro),
    },
    workshops: raw?.workshops
      ? titleDescList(raw.workshops)
      : titleDescList(d.workshops),
    workshopsHeader: {
      eyebrow: str(workshopsHeader.eyebrow, d.workshopsHeader.eyebrow),
      sectionTitle: str(workshopsHeader.sectionTitle, d.workshopsHeader.sectionTitle),
      intro: str(workshopsHeader.intro, d.workshopsHeader.intro),
    },
    pricing: {
      eyebrow: str(pricing.eyebrow, d.pricing.eyebrow),
      sectionTitle: str(pricing.sectionTitle, d.pricing.sectionTitle),
      currencyLabel: str(pricing.currencyLabel, d.pricing.currencyLabel),
      feeNote: str(pricing.feeNote, d.pricing.feeNote),
      buttonLabel: str(pricing.buttonLabel, d.pricing.buttonLabel),
    },
    faq: raw?.faq ? faqList(raw.faq) : faqList(d.faq),
    faqHeader: {
      eyebrow: str(faqHeader.eyebrow, d.faqHeader.eyebrow),
      sectionTitle: str(faqHeader.sectionTitle, d.faqHeader.sectionTitle),
    },
    footer: {
      phone1: str(footer.phone1, d.footer.phone1),
      phone2: str(footer.phone2, d.footer.phone2),
      email: str(footer.email, d.footer.email),
      address: str(footer.address, d.footer.address),
      instagram: str(footer.instagram, d.footer.instagram),
      facebook: str(footer.facebook, d.footer.facebook),
      youtube: str(footer.youtube, d.footer.youtube),
      linkedin: str(footer.linkedin, d.footer.linkedin),
      registrationFee: num(footer.registrationFee, d.footer.registrationFee),
      brandName: str(footer.brandName, d.footer.brandName),
      tagline: str(footer.tagline, d.footer.tagline),
      description: str(footer.description, d.footer.description),
      copyright: str(footer.copyright, d.footer.copyright),
      subNote: str(footer.subNote, d.footer.subNote),
    },
  };
}

async function getContent(): Promise<SiteContentData> {
  await connectToDatabase();
  const doc = await SiteContent.findOne({ key: "singleton" }).lean();
  return normalizeContent((doc as Record<string, unknown> | null) ?? null);
}

async function getPendingCount(): Promise<number> {
  await connectToDatabase();
  return Application.countDocuments({ status: "pending" });
}

export default async function ContentPage() {
  const [session, content, pendingCount] = await Promise.all([
    auth(),
    getContent(),
    getPendingCount(),
  ]);
  const agentName = session?.user?.name ?? session?.user?.email ?? "Admin User";

  return (
    <div className="grid h-screen overflow-hidden grid-cols-[64px_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar pendingCount={pendingCount} agentName={agentName} />

      <main className="flex flex-col overflow-hidden">
        <header className="h-16 bg-surface border-b border-border flex items-center px-8 shrink-0">
          <div className="font-serif text-2xl text-text font-medium">Content</div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 animate-fade-in">
          <ContentEditor initial={content} />
        </div>
      </main>
    </div>
  );
}
