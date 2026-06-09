import { connectToDatabase } from "@/lib/mongodb";
import SiteContent, {
  DEFAULT_SITE_CONTENT,
  type SiteContentData,
} from "@/models/SiteContent";

function mergeContent(fetched: Partial<SiteContentData>): SiteContentData {
  const d = DEFAULT_SITE_CONTENT;
  const f = fetched ?? {};

  const nonEmpty = <T>(arr: T[] | undefined, fallback: T[]): T[] =>
    Array.isArray(arr) && arr.length > 0 ? arr : fallback;

  return {
    key: f.key ?? d.key,
    marquee: nonEmpty(f.marquee, d.marquee),
    hero: { ...d.hero, ...(f.hero ?? {}) },
    about: {
      ...d.about,
      ...(f.about ?? {}),
      highlights: f.about?.highlights?.length
        ? f.about.highlights
        : d.about.highlights,
    },
    malaika: { ...d.malaika, ...(f.malaika ?? {}) },
    countdown: { ...d.countdown, ...(f.countdown ?? {}) },
    founder: { ...d.founder, ...(f.founder ?? {}) },
    categories: nonEmpty(f.categories, d.categories),
    categoriesHeader: { ...d.categoriesHeader, ...(f.categoriesHeader ?? {}) },
    rewards: nonEmpty(f.rewards, d.rewards),
    rewardsHeader: { ...d.rewardsHeader, ...(f.rewardsHeader ?? {}) },
    workshops: nonEmpty(f.workshops, d.workshops),
    workshopsHeader: { ...d.workshopsHeader, ...(f.workshopsHeader ?? {}) },
    mentorsJury: {
      ...d.mentorsJury,
      ...(f.mentorsJury ?? {}),
      people: nonEmpty(f.mentorsJury?.people, d.mentorsJury.people),
    },
    eligibility: {
      ...d.eligibility,
      ...(f.eligibility ?? {}),
      criteria: nonEmpty(f.eligibility?.criteria, d.eligibility.criteria),
    },
    pricing: { ...d.pricing, ...(f.pricing ?? {}) },
    faq: nonEmpty(f.faq, d.faq),
    faqHeader: { ...d.faqHeader, ...(f.faqHeader ?? {}) },
    footer: { ...d.footer, ...(f.footer ?? {}) },
  };
}

export async function getSiteContent(): Promise<SiteContentData> {
  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne({ key: "singleton" }).lean<
      Partial<SiteContentData>
    >();
    if (!doc) return DEFAULT_SITE_CONTENT;
    return mergeContent(doc);
  } catch (err) {
    console.error("getSiteContent failed:", err);
    return DEFAULT_SITE_CONTENT;
  }
}
