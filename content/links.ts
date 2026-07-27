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
  {
    label: "Instagram",
    url: ORG_URLS.instagram,
    description: "Behind the scenes and project previews.",
  },
  {
    label: "TikTok",
    url: ORG_URLS.tiktok,
    description: "Short-form coding clips and tech takes.",
  },
  {
    label: "Facebook",
    url: ORG_URLS.facebook,
    description: "Updates and community announcements.",
  },
  {
    label: "Email",
    url: ORG_URLS.email,
    description: "Collaborations and inquiries.",
  },
];
