export type TitleDescItem = {
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SiteContentData = {
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
    highlights: TitleDescItem[];
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
  mentorsJury: {
    sectionTitle: string;
    intro: string;
    people: TitleDescItem[];
    eyebrow: string;
  };
  categories: TitleDescItem[];
  categoriesHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  eligibility: {
    sectionTitle: string;
    intro: string;
    criteria: string[];
  };
  rewards: TitleDescItem[];
  rewardsHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  workshops: TitleDescItem[];
  workshopsHeader: {
    eyebrow: string;
    sectionTitle: string;
    intro: string;
  };
  pricing: {
    eyebrow: string;
    sectionTitle: string;
    currencyLabel: string;
    feeNote: string;
    buttonLabel: string;
  };
  faq: FaqItem[];
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
