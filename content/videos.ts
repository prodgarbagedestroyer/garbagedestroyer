import { ORG_URLS } from "./site";
import { fetchYouTubeVideos } from "@/lib/youtube";
import { getAllExternalShorts, type ExternalShort } from "./external-shorts";

export type VideoPlatform = "youtube" | "tiktok" | "instagram";

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  date: string;
  duration: string;
  description: string;
  relatedProjectSlugs: string[];
  featured: boolean;
  thumbnail?: string;
  isShort: boolean;
  platform: VideoPlatform;
  externalUrl?: string;
  relatedRepoUrls: string[];
}

export function getVideoUrl(youtubeId: string): string {
  return `https://youtube.com/watch?v=${youtubeId}`;
}

export function getVideoLink(video: Video): string {
  if (video.externalUrl) return video.externalUrl;
  return getVideoUrl(video.youtubeId);
}

export function getVideoThumbnail(
  youtubeId: string,
  customThumbnail?: string
): string {
  return customThumbnail ?? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getChannelUrl(): string {
  return ORG_URLS.youtube;
}

interface VideoMeta {
  relatedProjectSlugs: string[];
  featured: boolean;
  relatedRepoUrls: string[];
}

const videoMetaMap: Record<string, VideoMeta> = {
  UsylH6JQEdU: {
    relatedProjectSlugs: ["docker-size-race-benchmark-2026"],
    featured: true,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/docker-size-race-benchmark-2026",
    ],
  },
  dwSQRBjY0xY: {
    relatedProjectSlugs: ["throughput-race-benchmark-2026"],
    featured: true,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/throughput-race-benchmark-2026",
    ],
  },
  U8nmIIHhirY: {
    relatedProjectSlugs: ["throughput-race-benchmark-2026"],
    featured: true,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/throughput-race-benchmark-2026",
    ],
  },
  aByiIjyqKDg: {
    relatedProjectSlugs: ["go-rust-node-rest-api-benchmark-2026"],
    featured: true,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/go-rust-node-rest-api-benchmark-2026",
    ],
  },
  v86pZnjuyPc: {
    relatedProjectSlugs: ["go-rust-node-rest-api-benchmark-2026"],
    featured: false,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/go-rust-node-rest-api-benchmark-2026",
    ],
  },
  k9721039r30: {
    relatedProjectSlugs: ["alpine-rust-vs-optimized-java-2026"],
    featured: false,
    relatedRepoUrls: [
      "https://github.com/prodgarbagedestroyer/alpine-rust-vs-optimized-java-2026",
    ],
  },
  F9qRoa2bjPc: {
    relatedProjectSlugs: [],
    featured: true,
    relatedRepoUrls: [],
  },
  y0BmPPAZRuA: {
    relatedProjectSlugs: [],
    featured: true,
    relatedRepoUrls: [],
  },
  V0BGOxuygBM: {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  "hiFi-BJYm5s": {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  tm0qDQ45qpQ: {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  eJ0Szrbzzes: {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  "oLD-6lQ6IrU": {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  nui7WZrzogk: {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
  pTJcAafZTLo: {
    relatedProjectSlugs: [],
    featured: false,
    relatedRepoUrls: [],
  },
};

const fallbackVideos: Video[] = [
  {
    id: "fallback-1",
    title: "Latest content coming soon — subscribe on YouTube",
    youtubeId: "",
    date: "",
    duration: "",
    description:
      "Videos are auto-synced from YouTube. Check back shortly or visit the channel directly.",
    relatedProjectSlugs: [],
    featured: true,
    isShort: false,
    platform: "youtube",
    relatedRepoUrls: [],
  },
];

async function loadMergedVideos(): Promise<Video[]> {
  const live = await fetchYouTubeVideos();

  if (!live?.length) {
    return fallbackVideos;
  }

  return live.map((lv) => {
    const meta = videoMetaMap[lv.youtubeId] ?? {
      relatedProjectSlugs: [],
      featured: false,
      relatedRepoUrls: [],
    };
    return {
      id: lv.id,
      title: lv.title,
      youtubeId: lv.youtubeId,
      date: lv.date,
      duration: lv.duration || "",
      description: lv.description || "",
      relatedProjectSlugs: meta.relatedProjectSlugs,
      featured: meta.featured,
      thumbnail: lv.thumbnail,
      isShort: lv.isShort,
      platform: "youtube" as VideoPlatform,
      relatedRepoUrls: meta.relatedRepoUrls,
    };
  });
}

let cachedVideos: Video[] | null = null;

export async function getAllVideos(): Promise<Video[]> {
  if (cachedVideos) return cachedVideos;
  cachedVideos = await loadMergedVideos();
  return cachedVideos;
}

export async function getVideos({
  type,
  page = 1,
  perPage = 12,
}: {
  type?: "video" | "short";
  page?: number;
  perPage?: number;
} = {}): Promise<{ videos: Video[]; total: number; pages: number }> {
  const all = await getAllVideos();

  let filtered: Video[];

  if (type === "video") {
    filtered = all.filter((v) => !v.isShort);
  } else if (type === "short") {
    const ytShorts = all.filter((v) => v.isShort);
    const external = getAllExternalShorts().map(
      (es): Video => ({
        id: es.id,
        title: es.title,
        youtubeId: "",
        date: es.date,
        duration: "",
        description: es.description,
        relatedProjectSlugs: [],
        featured: false,
        thumbnail: es.thumbnail,
        isShort: true,
        platform: es.platform,
        externalUrl: es.url,
        relatedRepoUrls: [],
      })
    );
    filtered = [...ytShorts, ...external].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } else {
    filtered = all;
  }

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * perPage;
  const videos = filtered.slice(start, start + perPage);

  return { videos, total, pages };
}

export async function getFeaturedVideo(): Promise<Video | undefined> {
  const all = await getAllVideos();
  return all.find((v) => v.featured);
}

export async function getVideosByProject(slug: string): Promise<Video[]> {
  const all = await getAllVideos();
  return all.filter((v) => v.relatedProjectSlugs.includes(slug));
}

export function getShortsCount(videos: Video[]): number {
  return videos.filter((v) => v.isShort).length + getAllExternalShorts().length;
}

export function getVideosCount(videos: Video[]): number {
  return videos.filter((v) => !v.isShort).length;
}
