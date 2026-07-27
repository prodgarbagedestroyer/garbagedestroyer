import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const PROJECTS_DIR = join(ROOT, "content", "projects");
const VIDEO_SYNC_FILE = join(ROOT, "content", "video-sync.json");
const CACHE_DIR = join(ROOT, ".cache");
const CHANNEL_ID = "UClC6vGvALsZPGA2KeIFR8uQ";
const CACHE_KEY = "youtube-videos";

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function readCache(key) {
  try {
    const filePath = join(CACHE_DIR, `${key}.json`);
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {}
}

function loadVideoSync() {
  try {
    if (!existsSync(VIDEO_SYNC_FILE)) return {};
    return JSON.parse(readFileSync(VIDEO_SYNC_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function detectShort(title, durationSeconds) {
  if (/#shorts/i.test(title)) return true;
  if (durationSeconds > 0 && durationSeconds <= 60) return true;
  return false;
}

async function enrichShortStatus(videos) {
  const enriched = await Promise.all(
    videos.map(async (video) => {
      if (video.isShort) return video;
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`;
        const res = await fetch(oembedUrl);
        if (!res.ok) return video;
        const data = await res.json();
        const width = data.thumbnail_width ?? 0;
        const height = data.thumbnail_height ?? 0;
        return height > width ? { ...video, isShort: true } : video;
      } catch {
        return video;
      }
    })
  );

  return enriched;
}

async function fetchYouTubeVideos() {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
    );
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
    const videos = entries.map((entry) => {
      const youtubeId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeXml(
        entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ?? ""
      );
      const date =
        entry.match(/<published>([^<]+)<\/published>/)?.[1]?.slice(0, 10) ?? "";
      const description =
        decodeXml(
          entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? ""
        ).slice(0, 300);

      return {
        id: `yt-${youtubeId}`,
        youtubeId,
        title,
        date,
        description,
        duration: "",
        durationSeconds: 0,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        isShort: detectShort(title, 0),
      };
    });

    const enriched = await enrichShortStatus(videos);
    writeCache(CACHE_KEY, enriched);
    return { videos: enriched, source: "network" };
  } catch {
    const cached = readCache(CACHE_KEY);
    if (Array.isArray(cached)) {
      return { videos: cached, source: "cache" };
    }
    return { videos: [], source: "none" };
  }
}

function loadProjects() {
  return readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = readFileSync(join(PROJECTS_DIR, file), "utf-8");
      const { data } = matter(raw);
      const videoIds = Array.isArray(data.videoIds)
        ? data.videoIds.filter((value) => typeof value === "string")
        : typeof data.videoId === "string" && data.videoId
          ? [data.videoId]
          : [];

      return {
        slug,
        title: data.title ?? slug,
        repo: typeof data.repo === "string" ? data.repo : null,
        videoIds,
      };
    });
}

function buildIndices(projects) {
  const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
  const videoToProjects = new Map();

  for (const project of projects) {
    for (const videoId of project.videoIds) {
      const current = videoToProjects.get(videoId) ?? [];
      current.push(project);
      videoToProjects.set(videoId, current);
    }
  }

  return { projectBySlug, videoToProjects };
}

function audit(projects, videos, videoSync) {
  const { videoToProjects } = buildIndices(projects);
  const liveVideoIds = new Set(videos.map((video) => video.youtubeId).filter(Boolean));

  const standaloneVideos = videos.filter(
    (video) => videoSync[video.youtubeId]?.mapping === "standalone"
  );
  const unmappedVideos = videos.filter((video) => {
    if (videoToProjects.has(video.youtubeId)) return false;
    return videoSync[video.youtubeId]?.mapping !== "standalone";
  });
  const staleProjectMappings = [];
  const duplicateVideoMappings = [];
  const projectRepoIssues = [];
  const staleStandaloneMappings = [];

  for (const project of projects) {
    if (!project.repo) {
      projectRepoIssues.push({
        slug: project.slug,
        issue: "missing repo url",
      });
    }

    for (const videoId of project.videoIds) {
      if (!liveVideoIds.has(videoId)) {
        staleProjectMappings.push({
          slug: project.slug,
          videoId,
        });
      }
    }
  }

  for (const [videoId, config] of Object.entries(videoSync)) {
    if (config?.mapping === "standalone" && !liveVideoIds.has(videoId)) {
      staleStandaloneMappings.push({ videoId });
    }
  }

  for (const [videoId, mappedProjects] of videoToProjects.entries()) {
    if (mappedProjects.length > 1) {
      duplicateVideoMappings.push({
        videoId,
        slugs: mappedProjects.map((project) => project.slug),
      });
    }
  }

  return {
    totalProjects: projects.length,
    totalVideos: videos.length,
    standaloneVideos,
    unmappedVideos,
    staleProjectMappings,
    staleStandaloneMappings,
    duplicateVideoMappings,
    projectRepoIssues,
  };
}

function printSection(title, rows, renderRow) {
  console.log(`\n${title} (${rows.length})`);
  if (rows.length === 0) {
    console.log("  none");
    return;
  }
  for (const row of rows) {
    console.log(`  - ${renderRow(row)}`);
  }
}

async function main() {
  const projects = loadProjects();
  const videoSync = loadVideoSync();
  const { videos, source } = await fetchYouTubeVideos();
  const report = audit(projects, videos, videoSync);

  console.log("Video Sync Audit");
  console.log(`Source: ${source}`);
  console.log(`Projects: ${report.totalProjects}`);
  console.log(`Videos: ${report.totalVideos}`);
  console.log(`Standalone videos: ${report.standaloneVideos.length}`);

  printSection("Standalone videos", report.standaloneVideos, (video) => {
    return `${video.youtubeId} | ${video.date} | ${video.title}`;
  });

  printSection("Unmapped live videos", report.unmappedVideos, (video) => {
    return `${video.youtubeId} | ${video.date} | ${video.title}`;
  });

  printSection("Project videoIds missing from channel feed", report.staleProjectMappings, (row) => {
    return `${row.slug} -> ${row.videoId}`;
  });

  printSection("Standalone videoIds missing from channel feed", report.staleStandaloneMappings, (row) => {
    return row.videoId;
  });

  printSection("Videos mapped to multiple projects", report.duplicateVideoMappings, (row) => {
    return `${row.videoId} -> ${row.slugs.join(", ")}`;
  });

  printSection("Projects with repo metadata issues", report.projectRepoIssues, (row) => {
    return `${row.slug} -> ${row.issue}`;
  });

  const hasFailures =
    report.unmappedVideos.length > 0 ||
    report.staleProjectMappings.length > 0 ||
    report.staleStandaloneMappings.length > 0 ||
    report.duplicateVideoMappings.length > 0 ||
    report.projectRepoIssues.length > 0;

  process.exitCode = hasFailures ? 1 : 0;
}

await main();
