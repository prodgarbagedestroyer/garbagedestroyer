import Link from "next/link";
import { Play, ExternalLink } from "lucide-react";
import { getAllVideos, getVideoUrl, getVideoThumbnail, getChannelUrl } from "@/content/videos";
import { getProjectBySlug } from "@/lib/mdx";

export default function VideosPage() {
  const videos = getAllVideos();

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
                  src={getVideoThumbnail(video.youtubeId)}
                  alt={video.title}
                  className="h-full w-full object-cover"
                />
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
                  <span className="text-zinc-700">|</span>
                  <span>{video.duration}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
