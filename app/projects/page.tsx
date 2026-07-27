import { getAllProjects } from "@/lib/mdx";
import { getVideosByProject } from "@/content/videos";
import Link from "next/link";
import { ExternalLink, Film, GitBranch } from "lucide-react";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Projects
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Public experiments and tools from the prodgarbagedestroyer org. Each
          project pairs a repo with a deep-dive breakdown.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">
            No projects yet. Add <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-300">.mdx</code> files to{" "}
            <code className="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-300">content/projects/</code>.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const relatedVideos = getVideosByProject(project.slug);

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
      )}
    </div>
  );
}
