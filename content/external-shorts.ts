export type ExternalPlatform = "tiktok" | "instagram";

export interface ExternalShort {
  id: string;
  title: string;
  platform: ExternalPlatform;
  url: string;
  date: string;
  description: string;
  thumbnail?: string;
}

export const externalShorts: ExternalShort[] = [
  // Add TikTok and Instagram Reels entries below.
  // Example:
  // {
  //   id: "my-first-tiktok",
  //   title: "Rust memory model explained in 60s",
  //   platform: "tiktok",
  //   url: "https://www.tiktok.com/@prodgarbagedestroyer/video/123456789",
  //   date: "2026-07-26",
  //   description: "Quick explainer on ownership and borrowing.",
  // },
];

export const externalPlatformUrls: Record<ExternalPlatform, string> = {
  tiktok: "https://tiktok.com/@prodgarbagedestroyer",
  instagram: "https://instagram.com/prod.garbagedestroyer",
};

export function getAllExternalShorts(): ExternalShort[] {
  return [...externalShorts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
