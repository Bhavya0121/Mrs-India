import { Schema, model, models } from "mongoose";
import { REGISTRATION_FEE } from "@/lib/constants";

const titleDescSchema = new Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const siteContentSchema = new Schema(
  {
    key: { type: String, default: "singleton", unique: true, index: true },
    marquee: { type: [String], default: [] },
    hero: {
      eyebrow: { type: String, default: "" },
      title: { type: String, default: "" },
      scriptLine: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      eventDates: { type: String, default: "" },
      venue: { type: String, default: "" },
      crownedBy: { type: String, default: "" },
      buttonLabel: { type: String, default: "" },
      datesLabel: { type: String, default: "" },
      venueLabel: { type: String, default: "" },
      crownedByLabel: { type: String, default: "" },
      secondaryCtaLabel: { type: String, default: "" },
    },
    about: {
      sectionTitle: { type: String, default: "" },
      openingLine: { type: String, default: "" },
      paragraph1: { type: String, default: "" },
      paragraph2: { type: String, default: "" },
      highlights: { type: [titleDescSchema], default: [] },
      eyebrow: { type: String, default: "" },
      panelLabel1: { type: String, default: "" },
      panelLabel2: { type: String, default: "" },
    },
    malaika: {
      sectionTitle: { type: String, default: "" },
      pullQuote: { type: String, default: "" },
      bio: { type: String, default: "" },
      imageEyebrow: { type: String, default: "" },
      imageName: { type: String, default: "" },
      signatureName: { type: String, default: "" },
      subLabel: { type: String, default: "" },
      eyebrow: { type: String, default: "" },
    },
    countdown: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
      targetDate: { type: String, default: "" },
    },
    founder: {
      sectionTitle: { type: String, default: "" },
      quote: { type: String, default: "" },
      name: { type: String, default: "" },
      role: { type: String, default: "" },
      bio: { type: [String], default: [] },
      eyebrow: { type: String, default: "" },
      leadParagraph: { type: String, default: "" },
    },
    categories: { type: [titleDescSchema], default: [] },
    categoriesHeader: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
      intro: { type: String, default: "" },
    },
    rewards: { type: [titleDescSchema], default: [] },
    rewardsHeader: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
      intro: { type: String, default: "" },
    },
    workshops: { type: [titleDescSchema], default: [] },
    workshopsHeader: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
      intro: { type: String, default: "" },
    },
    mentorsJury: {
      sectionTitle: { type: String, default: "" },
      intro: { type: String, default: "" },
      people: { type: [titleDescSchema], default: [] },
      eyebrow: { type: String, default: "" },
    },
    eligibility: {
      sectionTitle: { type: String, default: "" },
      intro: { type: String, default: "" },
      criteria: { type: [String], default: [] },
    },
    pricing: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
      currencyLabel: { type: String, default: "" },
      feeNote: { type: String, default: "" },
      buttonLabel: { type: String, default: "" },
    },
    faq: { type: [faqSchema], default: [] },
    faqHeader: {
      eyebrow: { type: String, default: "" },
      sectionTitle: { type: String, default: "" },
    },
    footer: {
      phone1: { type: String, default: "" },
      phone2: { type: String, default: "" },
      email: { type: String, default: "" },
      address: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      registrationFee: { type: Number, default: REGISTRATION_FEE },
      brandName: { type: String, default: "" },
      tagline: { type: String, default: "" },
      description: { type: String, default: "" },
      copyright: { type: String, default: "" },
      subNote: { type: String, default: "" },
    },
  },
  { collection: "site_content", timestamps: true }
);

export type TitleDesc = { title: string; description: string };
export type Faq = { question: string; answer: string };

export type SiteContentData = {
  key: string;
  marquee: string[];
  hero: {
    eyebrow: string;
    title: string;
    scriptLine: string;
    subtitle: string;
    eventDates: string;
    venue: string;
    crownedBy: string;
    buttonLabel: string;
    datesLabel: string;
    venueLabel: string;
    crownedByLabel: string;
    secondaryCtaLabel: string;
  };
  about: {
    sectionTitle: string;
    openingLine: string;
    paragraph1: string;
    paragraph2: string;
    highlights: TitleDesc[];
    eyebrow: string;
    panelLabel1: string;
    panelLabel2: string;
  };
  malaika: {
    sectionTitle: string;
    pullQuote: string;
    bio: string;
    imageEyebrow: string;
    imageName: string;
    signatureName: string;
    subLabel: string;
    eyebrow: string;
  };
  countdown: {
    eyebrow: string;
    sectionTitle: string;
    targetDate: string;
  };
  founder: {
    sectionTitle: string;
    quote: string;
    name: string;
    role: string;
    bio: string[];
    eyebrow: string;
    leadParagraph: string;
  };
  categories: TitleDesc[];
  categoriesHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  rewards: TitleDesc[];
  rewardsHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  workshops: TitleDesc[];
  workshopsHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  mentorsJury: {
    sectionTitle: string;
    intro: string;
    people: TitleDesc[];
    eyebrow: string;
  };
  eligibility: {
    sectionTitle: string;
    intro: string;
    criteria: string[];
  };
  pricing: {
    eyebrow: string;
    sectionTitle: string;
    currencyLabel: string;
    feeNote: string;
    buttonLabel: string;
  };
  faq: Faq[];
  faqHeader: {
    eyebrow: string;
    sectionTitle: string;
  };
  footer: {
    phone1: string;
    phone2: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    registrationFee: number;
    brandName: string;
    tagline: string;
    description: string;
    copyright: string;
    subNote: string;
  };
};

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  key: "singleton",
  marquee: [
    "Registrations Now Open",
    "Crowned by Sushmita Sen",
    "28 — 31 Oct 2026 · Goa",
    "The Rising Queen · Season 01",
  ],
  hero: {
    eyebrow: "Bold. Beautiful. Unstoppable",
    title: "Crown your\n{gold}story.{/gold}",
    scriptLine: "~ a coronation ~",
    subtitle:
      "Four nights of glamour, growth, and grace. A stage where every woman finds her crown.",
    eventDates: "28 — 31 Oct’26",
    venue: "Goa, India",
    crownedBy: "Sushmita Sen",
    buttonLabel: "Begin Application",
    datesLabel: "Dates",
    venueLabel: "Venue",
    crownedByLabel: "Crowned By",
    secondaryCtaLabel: "Discover More",
  },
  about: {
    sectionTitle: "The Rising {gold}Star{/gold}",
    openingLine: "The Rising Queen is more than a pageant. It is a celebration of becoming.",
    paragraph1:
      "Our mission is to empower future icons of elegance and strength, giving every woman the opportunity to inspire, influence, and rise beyond boundaries.",
    paragraph2: "",
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
    sectionTitle: "Crowned by {gold}Sushmita Sen.{/gold}",
    pullQuote:
      "\"The Rising Queen is the celebration our women have been waiting for. It is fierce, it is feminine, and it is unapologetically royal.\"",
    bio:
      "Bollywood icon. Fitness mogul. Fashion authority. A definitive voice of modern Indian womanhood. Sushmita Sen joins us as the Crowning Diva of our inaugural season, elevating this stage into something truly historic.",
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
      "I built The Rising Queen for every woman who was ever told to wait for her turn. This stage is her turn.",
    name: "Madhulika Verma",
    role: "Founder & Director",
    bio: [
      "20+ years in training, recruitment, sales, marketing, and operations with IBM, Hewitt, Citibank, and American Express.",
      "Certified Image Consultant and Soft Skills Trainer who has empowered 3,000+ individuals.",
      "Top Finalist, Mrs. India Women of Dignity 2023, and titled Miss Empowering Beauty by Nari First.",
      "Her vision: to help women rise beyond fear and lead with confidence.",
    ],
    eyebrow: "The Visionary",
    leadParagraph:
      "This pageant is for every woman ready to wear her confidence, own her crown, and finally shine unapologetically. This is her runway, her voice, her crown, and her time to shine.",
  },
  categories: [
    {
      title: "Diva",
      description: "For women ready to redefine elegance and confidence.",
    },
    {
      title: "Queen",
      description: "For women who lead with poise and purpose.",
    },
    {
      title: "Legend",
      description: "For women who inspire generations.",
    },
    {
      title: "Shakti",
      description: "A special category celebrating women of extraordinary resilience and social impact.",
    },
  ],
  categoriesHeader: {
    eyebrow: "Five Crowns, Five Stories",
    sectionTitle: "The {gold}Categories.{/gold}",
    intro: "Five paths. One stage. Choose where you belong.",
  },
  rewards: [
    { title: "Coronation by Sushmita Sen", description: "A historic crowning moment on the grand finale stage with Bollywood’s reigning icon." },
    { title: "National Magazine Cover", description: "Grace the cover of a leading lifestyle publication as the new face of grace." },
    { title: "OTT Reality Show Entry", description: "A direct slot on a Bollywood-backed reality show streaming nationwide." },
    { title: "Exclusive Podcast Feature", description: "Tell your story on India’s most-listened-to women’s podcast." },
    { title: "Pan-India Cultural Tour", description: "Represent the crown at signature cultural showcases across India." },
    { title: "Premier Media Coverage", description: "Coverage across digital, print, and broadcast platforms nationwide." },
    { title: "Luxury Sponsor Hampers", description: "Curated gifts from India’s leading luxury, beauty, and lifestyle brands." },
    { title: "Lifetime Sisterhood", description: "Permanent entry into the Rising Queen alumna circle and mentor network." },
  ],
  rewardsHeader: {
    eyebrow: "Beyond the Crown",
    sectionTitle: "Rewards & {gold}Recognition.{/gold}",
    intro:
      "Every finalist walks away with more than a title. She walks away with a transformed life.",
  },
  workshops: [
    { title: "Ramp Walk & Posing", description: "Master the runway with industry choreographers. Learn the carriage, the pause, the gaze." },
    { title: "Glam, Skin & Hair", description: "Pro makeup, skincare regimens, and editorial hair styling led by celebrity artists." },
    { title: "Confidence & Etiquette", description: "Public speaking, presentation, dining etiquette, and the grace of presence." },
    { title: "Wellness & Nutrition", description: "Sustainable fitness, gut health, and the science of feeling extraordinary every day." },
    { title: "Entrepreneurial Bootcamp", description: "A full-day intensive for women who want to launch, lead, and scale their own ventures." },
    { title: "Spiritual & Mental Wellness", description: "Mindfulness, healing, and tools to anchor yourself in any storm." },
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
  mentorsJury: {
    sectionTitle: "Mentors & {gold}Jury.{/gold}",
    intro:
      "A curated panel of India's most respected voices in fashion, business, wellness and the arts.",
    eyebrow: "The Council",
    people: [
      { title: "Anaita Adajania", description: "Celebrity Stylist & Fashion Director" },
      { title: "Sandip Parker", description: "Master Choreographer" },
      { title: "Namrata Soni", description: "Celebrity Makeup & Beauty Expert" },
      { title: "Vandana Luthra", description: "Wellness Entrepreneur" },
      { title: "Rhea Kapoor", description: "Producer & Creative Director" },
      { title: "Dr. Meghna Rao", description: "Confidence & Mindset Coach" },
    ],
  },
  eligibility: {
    sectionTitle: "Who Can Apply",
    intro:
      "The Rising Queen of India welcomes women from every walk of life. If you carry a dream and the courage to wear it, the stage is yours.",
    criteria: [
      "Age — 18 years and above. No upper limit. Grace is timeless.",
      "Marital Status — Open to all. Single, married, divorced, widowed, or otherwise.",
      "Residency — Open to Indian residents. NRIs with valid Indian passport welcome.",
      "Background — Homemakers, professionals, students, entrepreneurs. Every story matters here.",
    ],
  },
  faq: [
    {
      question: "What does the registration fee include?",
      answer: "The registration fee covers your application processing, audition stage, and shortlisting evaluation. Selected finalists will be informed about finale-stage costs separately.",
    },
    {
      question: "Is the registration fee refundable?",
      answer: "No, the registration fee is strictly non-refundable. It is invested into your application review and audition process from the moment you apply.",
    },
    {
      question: "Do I need prior modelling experience?",
      answer: "Absolutely not. The Rising Queen is built for every woman with confidence and a story to tell. Our workshops are designed to prepare you fully.",
    },
    {
      question: "Where will the auditions be held?",
      answer: "Auditions will be conducted both online via video submission and in-person across major Indian cities. Details will be shared after registration.",
    },
    {
      question: "What happens after I register?",
      answer: "You will receive an application form within 24 hours of payment, followed by audition guidelines. Shortlisted candidates fly to Goa for the four-day finale week.",
    },
    {
      question: "Are travel and accommodation provided?",
      answer: "For finalists selected for the Goa finale, accommodation during the event is included. Travel costs to and from Goa are borne by the participant unless otherwise specified.",
    },
  ],
  faqHeader: {
    eyebrow: "Questions Answered",
    sectionTitle: "Before you {gold}apply.{/gold}",
  },
  footer: {
    phone1: "+91 88266 01653",
    phone2: "+91 88264 56677",
    email: "therisingqueenofindia@gmail.com",
    address: "The Rising Queen, Sector 17, Gurgaon, Haryana, India",
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    registrationFee: REGISTRATION_FEE,
    brandName: "THE RISING QUEEN",
    tagline: "~ A Coronation of Becoming ~",
    description:
      "India's most glamorous pageant for women. A celebration of grace, ambition, and the crowns we carry within.",
    copyright: "© 2026 The Rising Queen of India. All rights reserved.",
    subNote: "Designed with intention.",
  },
};

const SiteContent =
  models.SiteContent || model("SiteContent", siteContentSchema);

export default SiteContent;
