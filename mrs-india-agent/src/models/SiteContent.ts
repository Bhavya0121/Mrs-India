import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const TitleDescSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const FaqSchema = new Schema(
  {
    question: { type: String },
    answer: { type: String },
  },
  { _id: false }
);

const SiteContentSchema = new Schema(
  {
    key: { type: String, default: "singleton", unique: true, index: true },
    marquee: { type: [String], default: [] },
    hero: {
      eyebrow: { type: String },
      title: { type: String },
      scriptLine: { type: String },
      subtitle: { type: String },
      eventDates: { type: String },
      venue: { type: String },
      crownedBy: { type: String },
      buttonLabel: { type: String },
      datesLabel: { type: String },
      venueLabel: { type: String },
      crownedByLabel: { type: String },
      secondaryCtaLabel: { type: String },
    },
    about: {
      sectionTitle: { type: String },
      openingLine: { type: String },
      paragraph1: { type: String },
      paragraph2: { type: String },
      highlights: { type: [TitleDescSchema], default: [] },
      eyebrow: { type: String },
      panelLabel1: { type: String },
      panelLabel2: { type: String },
    },
    malaika: {
      sectionTitle: { type: String },
      pullQuote: { type: String },
      bio: { type: String },
      imageEyebrow: { type: String },
      imageName: { type: String },
      signatureName: { type: String },
      subLabel: { type: String },
      eyebrow: { type: String },
    },
    countdown: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
      targetDate: { type: String },
    },
    founder: {
      sectionTitle: { type: String },
      quote: { type: String },
      name: { type: String },
      role: { type: String },
      bio: { type: [String], default: [] },
      eyebrow: { type: String },
      leadParagraph: { type: String },
    },
    mentorsJury: {
      sectionTitle: { type: String },
      intro: { type: String },
      people: { type: [TitleDescSchema], default: [] },
      eyebrow: { type: String },
    },
    categories: { type: [TitleDescSchema], default: [] },
    categoriesHeader: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
      intro: { type: String },
    },
    eligibility: {
      sectionTitle: { type: String },
      intro: { type: String },
      criteria: { type: [String], default: [] },
    },
    rewards: { type: [TitleDescSchema], default: [] },
    rewardsHeader: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
      intro: { type: String },
    },
    workshops: { type: [TitleDescSchema], default: [] },
    workshopsHeader: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
      intro: { type: String },
    },
    pricing: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
      currencyLabel: { type: String },
      feeNote: { type: String },
      buttonLabel: { type: String },
    },
    faq: { type: [FaqSchema], default: [] },
    faqHeader: {
      eyebrow: { type: String },
      sectionTitle: { type: String },
    },
    footer: {
      phone1: { type: String },
      phone2: { type: String },
      email: { type: String },
      address: { type: String },
      instagram: { type: String },
      facebook: { type: String },
      youtube: { type: String },
      linkedin: { type: String },
      registrationFee: { type: Number },
      brandName: { type: String },
      tagline: { type: String },
      description: { type: String },
      copyright: { type: String },
      subNote: { type: String },
    },
  },
  { timestamps: true, collection: "site_content" }
);

export type SiteContentDoc = InferSchemaType<typeof SiteContentSchema> & {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const SiteContent: Model<SiteContentDoc> =
  (models.SiteContent as Model<SiteContentDoc>) ||
  model<SiteContentDoc>("SiteContent", SiteContentSchema);

/**
 * Default Rising Queen content returned by GET when no singleton exists yet,
 * and seeded by scripts/seed-content.mjs. Keep the two in sync.
 */
export const DEFAULT_SITE_CONTENT = {
  key: "singleton",
  marquee: [
    "Registrations Now Open",
    "Crowned by Sushmita Sen",
    "28 — 31 Oct 2026 · Goa",
    "The Rising Queen · Season 01",
  ],
  hero: {
    eyebrow: "Mrs India Rising Queen 2026",
    title: "Rising Queen",
    scriptLine: "Where Every Woman Reigns",
    subtitle:
      "A national platform celebrating the grace, strength, and ambition of married women across India.",
    eventDates: "15–18 December 2026",
    venue: "Gurgaon, Haryana",
    crownedBy: "Crowned by Malaika Arora",
    buttonLabel: "Apply Now",
    datesLabel: "Dates",
    venueLabel: "Venue",
    crownedByLabel: "Crowned By",
    secondaryCtaLabel: "Discover More",
  },
  about: {
    sectionTitle: "About the Pageant",
    openingLine: "More than a crown — a movement.",
    paragraph1:
      "Mrs India Rising Queen is a celebration of married women who balance family, career, and dreams with unmatched grace. Our platform empowers women to step into the spotlight and own their stories.",
    paragraph2:
      "From grooming and personality development to a grand finale on a national stage, every contestant embarks on a transformative journey designed to crown the queen within.",
    highlights: [
      {
        title: "5-Star Luxury Stay",
        description:
          "Curated stages and rituals designed for the modern Indian woman.",
      },
      {
        title: "Life Changing",
        description:
          "An inaugural season. A founding cohort. A legacy in the making.",
      },
      {
        title: "International Standard",
        description:
          "Mentors, judges, and craft from India's most respected names.",
      },
      {
        title: "Historic",
        description:
          "A coronation moment that becomes the story of your life.",
      },
    ],
    eyebrow: "About The Rising Queen",
    panelLabel1: "The Coronation",
    panelLabel2: "A New Era",
  },
  malaika: {
    sectionTitle: "Mentored by Malaika Arora",
    pullQuote: "Every woman deserves a stage to shine — this is yours.",
    bio: "Actor, entrepreneur, and fitness icon Malaika Arora brings her star power and mentorship to Rising Queen, guiding contestants to discover their confidence and grace.",
    imageEyebrow: "The Crowning Moment",
    imageName: "Sushmita Sen",
    signatureName: "Sushmita Sen",
    subLabel: "Crowning Diva · Season 01",
    eyebrow: "The Face of the Crown",
  },
  countdown: {
    eyebrow: "The Coronation Begins In",
    sectionTitle: "A new era of {gold}glamour{/gold}",
    targetDate: "2026-10-28T18:00:00+05:30",
  },
  founder: {
    sectionTitle: "Meet the {gold}Founder.{/gold}",
    quote:
      "I built The Rising Queen for every woman who was ever told to wait her turn. This stage is her turn.",
    name: "Madhulika Verma",
    role: "Founder & Director",
    bio: [
      "Madhulika Verma spent over a decade in the corporate world with global leaders like IBM, Hewitt, Citibank, and American Express, mastering the discipline, poise, and leadership that define her today.",
      "A certified Image Consultant, she has personally coached and transformed over 3,000 women, helping them rediscover their confidence, presence, and sense of self.",
      "Her own journey on stage saw her crowned a Top Finalist at Mrs India Women of Dignity 2023 and honoured as Miss Empowering Beauty by Nari First.",
      "She founded The Rising Queen with a single vision: to give every woman a stage that celebrates her strength, her story, and her right to shine.",
    ],
    eyebrow: "The Visionary",
    leadParagraph:
      "This pageant is for every woman ready to wear her confidence, own her crown, and finally shine unapologetically. This is her runway, her voice, her crown, and her time to shine.",
  },
  mentorsJury: {
    sectionTitle: "Mentors & Jury",
    intro:
      "A curated panel of India's most respected voices in fashion, business, wellness and the arts.",
    eyebrow: "The Council",
    people: [
      {
        title: "Anaita Adajania",
        description: "Celebrity Stylist & Fashion Director",
      },
      { title: "Sandip Parker", description: "Master Choreographer" },
      {
        title: "Namrata Soni",
        description: "Celebrity Makeup & Beauty Expert",
      },
      { title: "Vandana Luthra", description: "Wellness Entrepreneur" },
      { title: "Rhea Kapoor", description: "Producer & Creative Director" },
      { title: "Dr. Meghna Rao", description: "Confidence & Mindset Coach" },
    ],
  },
  categories: [
    {
      title: "Diva",
      description:
        "For women aged 25–35 ready to redefine elegance and confidence.",
    },
    {
      title: "Queen",
      description: "For women aged 36–45 who lead with poise and purpose.",
    },
    {
      title: "Legend",
      description: "For women aged 46 and above who inspire generations.",
    },
    {
      title: "Shakti",
      description:
        "A special category celebrating women of extraordinary resilience and social impact.",
    },
  ],
  categoriesHeader: {
    eyebrow: "Five Crowns, Five Stories",
    sectionTitle: "The {gold}Categories.{/gold}",
    intro: "Five paths. One stage. Choose where you belong.",
  },
  eligibility: {
    sectionTitle: "Eligibility",
    intro:
      "The Rising Queen of India welcomes women from every walk of life. If you carry a dream and the courage to wear it, the stage is yours.",
    criteria: [
      "Age — 18 years and above. No upper limit. Grace is timeless.",
      "Marital Status — Open to all. Single, married, divorced, widowed, or otherwise.",
      "Residency — Open to Indian residents. NRIs with valid Indian passport welcome.",
      "Background — Homemakers, professionals, students, entrepreneurs. Every story matters here.",
    ],
  },
  rewards: [
    {
      title: "Title & Crown",
      description: "The official Rising Queen crown, sash, and title.",
    },
    {
      title: "Cash Prize",
      description: "A cash reward for the winners of each category.",
    },
    {
      title: "Brand Endorsements",
      description: "Opportunities to become the face of leading brands.",
    },
    {
      title: "Magazine Feature",
      description: "A featured spread in a national lifestyle magazine.",
    },
    {
      title: "Professional Portfolio",
      description: "A complete photoshoot with celebrity photographers.",
    },
    {
      title: "International Trip",
      description: "An all-expenses-paid trip for the grand winner.",
    },
    {
      title: "Grooming Sessions",
      description: "Exclusive workshops with industry experts.",
    },
    {
      title: "Media Coverage",
      description: "Press and digital coverage across national platforms.",
    },
  ],
  rewardsHeader: {
    eyebrow: "Beyond the Crown",
    sectionTitle: "Rewards & {gold}Recognition.{/gold}",
    intro:
      "Every finalist walks away with more than a title. She walks away with a transformed life.",
  },
  workshops: [
    {
      title: "Runway & Ramp Walk",
      description:
        "Master the art of the ramp with professional choreographers.",
    },
    {
      title: "Personality Development",
      description: "Build confidence, communication, and stage presence.",
    },
    {
      title: "Makeup & Styling",
      description: "Hands-on grooming sessions with celebrity stylists.",
    },
    {
      title: "Fitness & Wellness",
      description: "Holistic fitness routines tailored for the stage.",
    },
    {
      title: "Public Speaking",
      description: "Express yourself with clarity and command.",
    },
    {
      title: "Etiquette & Poise",
      description: "Refine your grace for every occasion.",
    },
  ],
  workshopsHeader: {
    eyebrow: "Power Workshops",
    sectionTitle: "The {gold}Finishing Touch.{/gold}",
    intro:
      "Confidence is not a trait. It is a lifestyle, crafted by world-class mentors.",
  },
  pricing: {
    eyebrow: "Reserve Your Stage",
    sectionTitle: "Step into your {gold}crown.{/gold}",
    currencyLabel: "INR",
    feeNote: "Registration Fee · Non-Refundable",
    buttonLabel: "Begin Application",
  },
  faq: [
    {
      question: "Who can participate?",
      answer:
        "Any married woman who is an Indian citizen aged 25 and above can apply.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "Yes, a nominal registration fee applies to confirm your participation.",
    },
    {
      question: "Where is the event held?",
      answer: "The grand finale takes place in Gurgaon, Haryana.",
    },
    {
      question: "Do I need prior experience?",
      answer: "No prior pageant or modeling experience is required.",
    },
    {
      question: "What does the journey include?",
      answer:
        "Grooming, workshops, auditions, and a national-level grand finale.",
    },
    {
      question: "How do I apply?",
      answer:
        "Click Apply Now and fill out the registration form to begin your journey.",
    },
  ],
  faqHeader: {
    eyebrow: "Questions Answered",
    sectionTitle: "Before you {gold}apply.{/gold}",
  },
  footer: {
    phone1: "+91 98765 43210",
    phone2: "+91 98765 43211",
    email: "info@mrsindiarisingqueen.com",
    address: "DLF Cyber City, Gurgaon, Haryana 122002",
    instagram: "https://instagram.com/mrsindiarisingqueen",
    facebook: "https://facebook.com/mrsindiarisingqueen",
    youtube: "https://youtube.com/@mrsindiarisingqueen",
    linkedin: "https://linkedin.com/company/mrsindiarisingqueen",
    registrationFee: 2999,
    brandName: "THE RISING QUEEN",
    tagline: "~ A Coronation of Becoming ~",
    description:
      "India's most glamorous pageant for women. A celebration of grace, ambition, and the crowns we carry within.",
    copyright: "© 2026 The Rising Queen of India. All rights reserved.",
    subNote: "Designed with intention.",
  },
} as const;
