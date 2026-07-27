const YOUTUBE_HANDLE = "prod.garbagedestroyer";
const CHANNEL_ID = "UClC6vGvALsZPGA2KeIFR8uQ";
const MAX_API_PAGES = 5;
const PAGE_SIZE = 50;

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  date: string;
  duration: string;
  durationSeconds: number;
  description: string;
  thumbnail: string;
  isShort: boolean;
}

function parseDuration(
  iso: string
): { display: string; seconds: number } {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return { display: "0:00", seconds: 0 };
  const h = parseInt(m[1] ?? "0");
  const min = parseInt(m[2] ?? "0");
  const sec = parseInt(m[3] ?? "0");
  const total = h * 3600 + min * 60 + sec;
  if (h > 0)
    return {
      display: `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`,
      seconds: total,
    };
  return { display: `${min}:${String(sec).padStart(2, "0")}`, seconds: total };
}

function detectShort(
  title: string,
  durationSeconds: number
): boolean {
  if (/#shorts/i.test(title)) return true;
  if (durationSeconds > 0 && durationSeconds <= 60) return true;
  return false;
}

async function fetchViaDataAPI(): Promise<YouTubeVideo[] | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  try {
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YOUTUBE_HANDLE}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const channelJson = await channelRes.json();
    if (channelJson.error) return null;

    const uploadsId =
      channelJson.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsId) return null;

    let allItems: {
      contentDetails?: { videoId?: string };
    }[] = [];
    let pageToken: string | undefined;

    for (let page = 0; page < MAX_API_PAGES; page++) {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=${PAGE_SIZE}&playlistId=${uploadsId}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ""}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      const json = await res.json();
      if (json.error) break;

      allItems = allItems.concat(json.items ?? []);
      pageToken = json.nextPageToken;
      if (!pageToken) break;
    }

    const videoIds = allItems
      .map((i) => i.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");
    if (!videoIds) return null;

    const chunkSize = 50;
    const idChunks: string[] = [];
    const ids = videoIds.split(",");
    for (let i = 0; i < ids.length; i += chunkSize) {
      idChunks.push(ids.slice(i, i + chunkSize).join(","));
    }

    let allVideos: {
      id: string;
      snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: { high: { url: string } };
      };
      contentDetails: { duration: string };
    }[] = [];

    for (const chunk of idChunks) {
      const vRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${chunk}&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      const vJson = await vRes.json();
      if (!vJson.error) {
        allVideos = allVideos.concat(vJson.items ?? []);
      }
    }

    return allVideos.map((item) => {
      const dur = parseDuration(item.contentDetails.duration);
      return {
        id: item.id,
        title: item.snippet.title,
        youtubeId: item.id,
        date: item.snippet.publishedAt.slice(0, 10),
        duration: dur.display,
        durationSeconds: dur.seconds,
        description: item.snippet.description.slice(0, 300),
        thumbnail: item.snippet.thumbnails.high.url,
        isShort: detectShort(item.snippet.title, dur.seconds),
      };
    });
  } catch {
    return null;
  }
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function enrichShortStatus(
  videos: YouTubeVideo[]
): Promise<YouTubeVideo[]> {
  const results = await Promise.all(
    videos.map(async (video) => {
      if (video.isShort) return video;
      try {
        const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.youtubeId}&format=json`;
        const res = await fetch(oembedUrl, { next: { revalidate: 86400 } });
        if (!res.ok) return video;
        const data = await res.json();
        const w = data.thumbnail_width ?? 0;
        const h = data.thumbnail_height ?? 0;
        if (h > w) {
          return { ...video, isShort: true };
        }
      } catch {}
      return video;
    })
  );
  return results;
}

async function fetchViaRSS(): Promise<YouTubeVideo[] | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const xml = await res.text();
    const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

    const videos = entries.map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title =
        decodeXml(
          entry.match(/<media:title>([^<]*)<\/media:title>/)?.[1] ?? ""
        );
      const published =
        entry
          .match(/<published>([^<]+)<\/published>/)?.[1]
          ?.slice(0, 10) ?? "";
      const desc =
        entry
          .match(/<media:description>([^<]*)<\/media:description>/)?.[1]
          ?.slice(0, 300) ?? "";
      const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

      return {
        id: `yt-${id}`,
        title,
        youtubeId: id,
        date: published,
        duration: "",
        durationSeconds: 0,
        description: desc,
        thumbnail,
        isShort: detectShort(title, 0),
      };
    });

    return enrichShortStatus(videos);
  } catch {
    return null;
  }
}

export async function fetchYouTubeVideos(): Promise<YouTubeVideo[] | null> {
  const fromAPI = await fetchViaDataAPI();
  if (fromAPI?.length) return fromAPI;

  const fromRSS = await fetchViaRSS();
  if (fromRSS?.length) return fromRSS;

  return null;
}
