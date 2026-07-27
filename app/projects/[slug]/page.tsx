import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { getVideosByProject, getVideoUrl } from "@/content/videos";
import { notFound } from "next/navigation";
import { compileMdx } from "@/lib/compile-mdx";
import { ExternalLink, GitBranch, Play, ArrowLeft, Film } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await compileMdx(project.raw);
  const relatedVideos = getVideosByProject(slug);
  const videoUrl = project.frontmatter.videoUrl
    ? project.frontmatter.videoUrl
    : project.frontmatter.videoId
      ? getVideoUrl(project.frontmatter.videoId)
      : null;

  return (
    <div className="space-y-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
      >
        <ArrowLeft className="h-3 w-3" />
        All projects
      </Link>

      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-zinc-700 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-500">
            {project.frontmatter.language}
          </span>
          {project.frontmatter.status === "experimental" && (
            <span className="rounded bg-zinc-800 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-600">
              experimental
            </span>
          )}
          {project.frontmatter.status === "archived" && (
            <span className="rounded bg-zinc-800 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-600">
              archived
            </span>
          )}
          <time className="font-mono text-xs text-zinc-600">
            {project.frontmatter.date}
          </time>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          {project.frontmatter.title}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-400">
          {project.frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-3">
          {project.frontmatter.repo && (
            <a
              href={project.frontmatter.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
            >
              <GitBranch className="h-4 w-4" />
              View Repository
            </a>
          )}
          {project.frontmatter.demo && (
            <a
              href={project.frontmatter.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              <Play className="h-4 w-4" />
              Watch Video
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-800/70 px-1.5 py-0 font-mono text-[11px] text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="prose-custom">{content}</article>

      {relatedVideos.length > 0 && (
        <div className="border-t border-zinc-800 pt-8">
          <h2 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500">
            <Film className="h-4 w-4" />
            Related Videos
          </h2>
          <div className="space-y-3">
            {relatedVideos.map((video) => (
              <a
                key={video.id}
                href={getVideoUrl(video.youtubeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition-colors hover:border-zinc-700"
              >
                <div className="flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded border border-zinc-800">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-200">
                    {video.title}
                  </p>
                  <p className="font-mono text-xs text-zinc-500">
                    {video.date} — {video.duration}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
