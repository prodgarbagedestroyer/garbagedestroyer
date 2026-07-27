const YOUTUBE_HANDLE = "prod.garbagedestroyer";
const CHANNEL_ID = "UClC6vGvALsZPGA2KeIFR8uQ";

interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  date: string;
  duration: string;
  description: string;
  thumbnail: string;
}

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return "0:00";
  const h = parseInt(m[1] ?? "0");
  const min = parseInt(m[2] ?? "0");
  const sec = parseInt(m[3] ?? "0");
  if (h > 0) return `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${min}:${String(sec).padStart(2, "0")}`;
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

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=20&playlistId=${uploadsId}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const playlistJson = await playlistRes.json();
    if (playlistJson.error) return null;

    const videoIds = playlistJson.items
      ?.map(
        (i: { contentDetails?: { videoId?: string } }) =>
          i.contentDetails?.videoId
      )
      .filter(Boolean)
      .join(",");
    if (!videoIds) return null;

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const videosJson = await videosRes.json();
    if (videosJson.error) return null;

    return (videosJson.items ?? []).map(
      (item: {
        id: string;
        snippet: {
          title: string;
          description: string;
          publishedAt: string;
          thumbnails: { high: { url: string } };
        };
        contentDetails: { duration: string };
      }) => ({
        id: item.id,
        title: item.snippet.title,
        youtubeId: item.id,
        date: item.snippet.publishedAt.slice(0, 10),
        duration: parseDuration(item.contentDetails.duration),
        description: item.snippet.description.slice(0, 300),
        thumbnail: item.snippet.thumbnails.high.url,
      })
    );
  } catch {
    return null;
  }
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

    return entries.map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title =
        entry
          .match(/<media:title>([^<]*)<\/media:title>/)?.[1]
          ?.replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"') ?? "";
      const published =
        entry
          .match(/<published>([^<]+)<\/published>/)?.[1]
          ?.slice(0, 10) ?? "";
      const desc =
        entry
          .match(/<media:description>([^<]*)<\/media:description>/)?.[1]
          ?.slice(0, 300) ?? "";
      const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

      return { id: `yt-${id}`, title, youtubeId: id, date: published, duration: "", description: desc, thumbnail };
    });
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
