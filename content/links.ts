import { ORG_URLS } from "./site";

export interface SocialLink {
  label: string;
  url: string;
  description: string;
}

export const verifiedLinks: SocialLink[] = [
  {
    label: "YouTube",
    url: ORG_URLS.youtube,
    description: "Software benchmarks, deep-dives, and systems commentary.",
  },
  {
    label: "GitHub",
    url: ORG_URLS.github,
    description: "Public projects and experiments.",
  },
];

export const unverifiedLinks: SocialLink[] = [
  {
    label: "Twitter / X",
    url: "https://x.com/prodgarbagedestroyer",
    description: "Quick takes on systems programming and dev tooling.",
  },
  {
    label: "Email",
    url: "mailto:prod@garbagedestroyer.com",
    description: "Collaborations and inquiries.",
  },
];
