import { getAllProjects } from "@/lib/mdx";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="max-w-xl leading-relaxed text-muted">
          Technical explorations across systems programming, compilers, graphics, and web tooling.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            No projects yet. Add <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">.mdx</code> files to{" "}
            <code className="rounded bg-zinc-800 px-1 py-0.5 text-xs">content/projects/</code>.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group flex flex-col rounded-md border border-border bg-surface p-5 transition-colors hover:bg-surface-hover"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded border border-border px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider text-muted">
                  {project.frontmatter.language}
                </span>
                <time className="text-[11px] text-muted">
                  {project.frontmatter.date}
                </time>
              </div>
              <h2 className="mb-2 text-sm font-semibold tracking-tight group-hover:text-accent transition-colors">
                {project.frontmatter.title}
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-muted line-clamp-2">
                {project.frontmatter.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {project.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-800 px-1.5 py-0 text-[11px] text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
