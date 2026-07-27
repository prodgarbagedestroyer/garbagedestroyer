import { Film, GitBranch, ExternalLink, ArrowRight, Play, Star, GitFork } from "lucide-react";
import Link from "next/link";
import { getAllVideos, getVideoUrl, getVideoThumbnail, getChannelUrl } from "@/content/videos";
import { getFeaturedProjects } from "@/lib/mdx";
import { getOrgRepos } from "@/lib/github";
import { ORG_URLS } from "@/content/site";
import { verifiedLinks } from "@/content/links";

export default async function IndexPage() {
  const allVideos = await getAllVideos();
  const latestVideo = allVideos[0];
  const featuredProjects = getFeaturedProjects().slice(0, 4);
  const repos = await getOrgRepos();

  return (
    <div className="space-y-14">
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
            prod.garbagedestroyer
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-400">
            Benchmarks, systems experiments, and public builds. Watch the breakdown, then inspect the code.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={getChannelUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300"
          >
            <Play className="h-4 w-4" fill="currentColor" />
            Watch on YouTube
          </a>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
          >
            View Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={ORG_URLS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            <GitBranch className="h-4 w-4" />
            GitHub Org
          </a>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Latest Video
        </h2>
        <a
          href={getVideoUrl(latestVideo.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-video shrink-0 overflow-hidden sm:w-64">
              <img
                src={getVideoThumbnail(latestVideo.youtubeId, latestVideo.thumbnail)}
                alt={latestVideo.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                {latestVideo.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-10 w-10 text-zinc-100" fill="currentColor" />
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-zinc-100 group-hover:text-zinc-50 transition-colors">
                  {latestVideo.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400 line-clamp-2">
                  {latestVideo.description}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3 font-mono text-xs text-zinc-500">
                <time>{latestVideo.date}</time>
                <span className="text-zinc-700">|</span>
                <span>{latestVideo.duration}</span>
              </div>
            </div>
          </div>
        </a>
      </section>

      {featuredProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              All projects →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded border border-zinc-700 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-500">
                    {project.frontmatter.language}
                  </span>
                  {project.frontmatter.status === "experimental" && (
                    <span className="rounded bg-zinc-800 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-600">
                      experimental
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-sm font-semibold text-zinc-200 group-hover:text-zinc-100 transition-colors">
                  {project.frontmatter.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                  {project.frontmatter.description}
                </p>
                <div className="mt-auto flex items-center gap-3">
                  {project.frontmatter.repo && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                      <GitBranch className="h-3 w-3" />
                      repo
                    </span>
                  )}
                  {project.frontmatter.videoId && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                      <Film className="h-3 w-3" />
                      watch
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {repos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Public Repos
            </h2>
            <a
              href={ORG_URLS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              View all on GitHub →
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {repos.slice(0, 6).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
              >
                <div className="mb-2 flex items-center gap-2">
                  <GitBranch className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-zinc-100">
                    {repo.name}
                  </span>
                  {repo.isArchived && (
                    <span className="rounded border border-zinc-700 px-1.5 py-0 font-mono text-[10px] text-zinc-600">
                      archived
                    </span>
                  )}
                </div>
                <p className="mb-3 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                  {repo.description || "No description"}
                </p>
                <div className="mt-auto flex items-center gap-4 font-mono text-[11px] text-zinc-600">
                  {repo.language && (
                    <span>
                      <span className="mr-1 inline-block h-2 w-2 rounded-full bg-zinc-500 align-middle" />
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                  )}
                  {repo.forks > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {repo.forks}
                    </span>
                  )}
                  <span>{repo.updatedAt}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4 border-t border-zinc-800 pt-10">
        <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
          Recent Activity
        </h2>
        <div className="relative ml-3 space-y-0 border-l border-zinc-800">
          {allVideos.slice(1, 5).map((video) => (
            <div key={video.id} className="relative pb-8 last:pb-0">
              <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <Film className="h-3 w-3 text-zinc-400" />
              </div>
              <div className="ml-7 space-y-1">
                <time className="font-mono text-xs text-zinc-600">{video.date}</time>
                <a
                  href={getVideoUrl(video.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-100"
                >
                  {video.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          {verifiedLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
          <Link
            href="/links"
            className="font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            More links →
          </Link>
        </div>
      </section>
    </div>
  );
}
