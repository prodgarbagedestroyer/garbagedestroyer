import { ORG_URLS } from "./site";
import { fetchYouTubeVideos } from "@/lib/youtube";
import { getAllExternalShorts } from "./external-shorts";
import { getAllProjects } from "@/lib/mdx";
import videoSync from "./video-sync.json";

export type VideoPlatform = "youtube" | "tiktok" | "instagram";
export type VideoSyncStatus = "project" | "standalone" | "unmapped";

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
  syncStatus: VideoSyncStatus;
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
  relatedRepoUrls?: string[];
  syncStatus: VideoSyncStatus;
}

type VideoOverride = {
  featured?: boolean;
  mapping?: "standalone";
};

const videoOverrides = videoSync as Record<string, VideoOverride>;

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function buildProjectVideoIndex(): Map<string, VideoMeta> {
  const index = new Map<string, VideoMeta>();

  for (const project of getAllProjects()) {
    const videoIds = project.frontmatter.videoIds ?? [];
    if (videoIds.length === 0) continue;

    for (const videoId of videoIds) {
      const current = index.get(videoId) ?? {
        relatedProjectSlugs: [],
        relatedRepoUrls: [],
        featured: false,
        syncStatus: "project" as const,
      };

      current.relatedProjectSlugs = unique([
        ...current.relatedProjectSlugs,
        project.slug,
      ]);
      current.relatedRepoUrls = unique([
        ...(current.relatedRepoUrls ?? []),
        project.frontmatter.repo ?? "",
      ]);
      current.featured = current.featured || project.frontmatter.featured;

      index.set(videoId, current);
    }
  }

  return index;
}

function mergeVideoMeta(projectMeta?: VideoMeta, overrideMeta?: VideoOverride): VideoMeta {
  const relatedProjectSlugs = unique([
    ...(projectMeta?.relatedProjectSlugs ?? []),
  ]);
  const syncStatus: VideoSyncStatus =
    relatedProjectSlugs.length > 0
      ? "project"
      : overrideMeta?.mapping === "standalone"
        ? "standalone"
        : "unmapped";

  return {
    relatedProjectSlugs,
    relatedRepoUrls: unique([
      ...(projectMeta?.relatedRepoUrls ?? []),
    ]),
    featured: overrideMeta?.featured ?? projectMeta?.featured ?? false,
    syncStatus,
  };
}

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
    syncStatus: "standalone",
  },
];

async function loadMergedVideos(): Promise<Video[]> {
  const live = await fetchYouTubeVideos();

  if (!live?.length) {
    return fallbackVideos;
  }

  const projectVideoIndex = buildProjectVideoIndex();

  return live.map((lv) => {
    const projectMeta = projectVideoIndex.get(lv.youtubeId);
    const overrideMeta = videoOverrides[lv.youtubeId];
    const meta = mergeVideoMeta(projectMeta, overrideMeta);

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
      relatedRepoUrls: meta.relatedRepoUrls ?? [],
      syncStatus: meta.syncStatus,
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
        syncStatus: "standalone",
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
