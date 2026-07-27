import { getAllProjects } from "@/lib/mdx";
import { getAllVideos } from "@/content/videos";
import Link from "next/link";
import { ExternalLink, Film, GitBranch } from "lucide-react";
import { Suspense } from "react";
import { SearchInput } from "@/components/search-input";

interface Props {
  searchParams: Promise<{ lang?: string; q?: string }>;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const allProjects = getAllProjects();
  const activeLang = sp.lang ?? null;
  const query = sp.q?.toLowerCase() ?? null;

  const languages = [
    ...new Set(
      allProjects
        .map((p) => p.frontmatter.language)
        .filter(Boolean)
        .sort()
    ),
  ];

  let filtered = allProjects;

  if (activeLang) {
    filtered = filtered.filter(
      (p) =>
        p.frontmatter.language.toLowerCase() === activeLang.toLowerCase()
    );
  }

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.frontmatter.title.toLowerCase().includes(query) ||
        p.frontmatter.description.toLowerCase().includes(query) ||
        p.frontmatter.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  const allVideos = await getAllVideos();
  const videosBySlug = new Map<string, typeof allVideos>();
  for (const video of allVideos) {
    for (const slug of video.relatedProjectSlugs) {
      const list = videosBySlug.get(slug) ?? [];
      list.push(video);
      videosBySlug.set(slug, list);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Projects
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Public experiments and tools from prodgarbagedestroyer and
          prod-garbage-destroyer. Each project pairs a repo with benchmark data.
        </p>
      </header>

      <div className="space-y-4">
        <Suspense>
          <SearchInput />
        </Suspense>

        {languages.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href={`/projects${query ? `?q=${query}` : ""}`}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                !activeLang
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              All
            </Link>
            {languages.map((lang) => {
              const active = activeLang?.toLowerCase() === lang.toLowerCase();
              const params = new URLSearchParams();
              if (active) {
                // clicking active language deselects it
              } else {
                params.set("lang", lang);
              }
              if (query) params.set("q", query);
              const qs = params.toString();
              return (
                <Link
                  key={lang}
                  href={`/projects${qs ? `?${qs}` : ""}`}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                    active
                      ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  {lang}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-sm text-zinc-500">
            No projects match this filter.
          </p>
        </div>
      ) : (
        <>
          <p className="font-mono text-xs text-zinc-600">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((project) => {
              const relatedVideos = videosBySlug.get(project.slug) ?? [];

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded border border-zinc-700 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-500">
                      {project.frontmatter.language}
                    </span>
                    {project.frontmatter.featured && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0 font-mono text-[10px] uppercase text-zinc-500">
                        featured
                      </span>
                    )}
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
                    <time className="ml-auto font-mono text-[11px] text-zinc-600">
                      {project.frontmatter.date}
                    </time>
                  </div>

                  <h2 className="mb-2 text-sm font-semibold tracking-tight text-zinc-200 group-hover:text-accent transition-colors">
                    {project.frontmatter.title}
                  </h2>
                  <p className="mb-4 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                    {project.frontmatter.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-zinc-800/70 px-1.5 py-0 font-mono text-[10px] text-zinc-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
                      {project.frontmatter.repo && (
                        <span className="inline-flex items-center gap-1 transition-colors group-hover:text-zinc-400">
                          <GitBranch className="h-3 w-3" />
                          repo
                        </span>
                      )}
                      {project.frontmatter.demo && (
                        <span className="inline-flex items-center gap-1 transition-colors group-hover:text-zinc-400">
                          <ExternalLink className="h-3 w-3" />
                          demo
                        </span>
                      )}
                      {relatedVideos.length > 0 && (
                        <span className="inline-flex items-center gap-1 transition-colors group-hover:text-zinc-400">
                          <Film className="h-3 w-3" />
                          video
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
