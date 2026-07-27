import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import {
  getAllVideos,
  getVideos,
  getVideoUrl,
  getVideoThumbnail,
  getChannelUrl,
  getShortsCount,
  getVideosCount,
} from "@/content/videos";
import { getProjectBySlug } from "@/lib/mdx";

interface Props {
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab === "shorts" ? "shorts" : sp.tab === "videos" ? "videos" : undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1") || 1);

  const all = await getAllVideos();
  const typeParam = tab === "shorts" ? "short" : tab === "videos" ? "video" : undefined;
  const { videos, total, pages } = await getVideos({ type: typeParam, page, perPage: 12 });
  const shortsCount = getShortsCount(all);
  const regularCount = getVideosCount(all);

  const tabs = [
    { key: undefined, label: "All", count: all.length },
    { key: "videos" as const, label: "Videos", count: regularCount },
    { key: "shorts" as const, label: "Shorts", count: shortsCount },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Videos
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Software benchmarks, systems deep-dives, and technical commentary.{" "}
          <a
            href={getChannelUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline underline-offset-2 transition-colors hover:text-zinc-100"
          >
            Subscribe on YouTube
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </p>
      </header>

      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        {tabs.map((t) => {
          const active =
            t.key === undefined ? !tab : tab === t.key;
          const href =
            t.key === undefined ? "/videos" : `/videos?tab=${t.key}`;
          return (
            <Link
              key={t.label}
              href={href}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t.label}
              <span className="font-mono text-[11px] text-zinc-500">
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

      {videos.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-sm text-zinc-500">No videos found.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {videos.map((video) => {
            const relatedProjects = video.relatedProjectSlugs
              .map((slug) => getProjectBySlug(slug))
              .filter(Boolean);

            return (
              <div
                key={video.id}
                className="flex flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700 sm:flex-row"
              >
                <a
                  href={getVideoUrl(video.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-video shrink-0 overflow-hidden sm:w-56"
                >
                  <img
                    src={getVideoThumbnail(
                      video.youtubeId,
                      video.thumbnail
                    )}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  {video.isShort && (
                    <div className="absolute left-2 top-2 rounded bg-purple-900/80 px-1.5 py-0 font-mono text-[10px] text-purple-300">
                      SHORT
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-10 w-10 text-zinc-100" fill="currentColor" />
                  </div>
                </a>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div className="space-y-2">
                    <a
                      href={getVideoUrl(video.youtubeId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-zinc-100 transition-colors hover:text-zinc-50"
                    >
                      {video.title}
                    </a>
                    <p className="text-sm leading-relaxed text-zinc-400 line-clamp-2">
                      {video.description}
                    </p>
                    {relatedProjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="font-mono text-[10px] uppercase text-zinc-600">
                          Related:
                        </span>
                        {relatedProjects.map((project) => (
                          <Link
                            key={project!.slug}
                            href={`/projects/${project!.slug}`}
                            className="rounded border border-zinc-700 px-1.5 py-0 font-mono text-[11px] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                          >
                            {project!.frontmatter.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-3 font-mono text-xs text-zinc-500">
                    <time>{video.date}</time>
                    {video.duration && (
                      <>
                        <span className="text-zinc-700">|</span>
                        <span>{video.duration}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2 font-mono text-sm">
          {page > 1 && (
            <Link
              href={`/videos${tab ? `?tab=${tab}` : ""}${page > 2 ? `&page=${page - 1}` : ""}`}
              className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              Previous
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
            const tabParam = tab;
            const href =
              `/videos${tabParam ? `?tab=${tabParam}` : ""}${p > 1 ? `${tabParam ? "&" : "?"}page=${p}` : ""}`;
            return (
              <Link
                key={p}
                href={href}
                className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                  p === page
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {p}
              </Link>
            );
          })}
          {page < pages && (
            <Link
              href={`/videos${tab ? `?tab=${tab}` : ""}&page=${page + 1}`}
              className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              Next
            </Link>
          )}
        </nav>
      )}

      {total > 0 && (
        <p className="text-center font-mono text-xs text-zinc-600">
          {total} video{total !== 1 ? "s" : ""} total
        </p>
      )}
    </div>
  );
}
