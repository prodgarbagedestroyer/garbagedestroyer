export const SITE = {
  displayName: "garbagedestroyer",
  handle: "@prod.garbagedestroyer",
  githubOrg: "prodgarbagedestroyer",
  youtubeHandle: "@prod.garbagedestroyer",
  domain: "garbagedestroyer.com",
} as const;

export const ORG_URLS = {
  youtube: `https://youtube.com/${SITE.youtubeHandle}`,
  github: `https://github.com/${SITE.githubOrg}`,
} as const;
