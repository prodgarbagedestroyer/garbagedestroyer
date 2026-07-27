import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { compileMdx } from "@/lib/compile-mdx";

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

  return (
    <div className="space-y-8">
      <header className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="rounded border border-border px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider text-muted">
            {project.frontmatter.language}
          </span>
          <time className="text-sm text-muted">{project.frontmatter.date}</time>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {project.frontmatter.title}
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          {project.frontmatter.description}
        </p>
        <div className="flex gap-3">
          {project.frontmatter.repo && (
            <a
              href={project.frontmatter.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              Repository
            </a>
          )}
          {project.frontmatter.demo && (
            <a
              href={project.frontmatter.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              Demo
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-800 px-1.5 py-0 text-[11px] text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="prose-custom">{content}</article>
    </div>
  );
}
