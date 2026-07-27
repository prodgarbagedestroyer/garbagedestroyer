import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

export interface ProjectFrontmatter {
  title: string;
  description: string;
  tags: string[];
  date: string;
  repo?: string;
  demo?: string;
  language: string;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  raw: string;
}

const PROJECTS_DIR = join(process.cwd(), "content/projects");

export function getProjectSlugs(): string[] {
  try {
    const files = readdirSync(PROJECTS_DIR);
    return files
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const filePath = join(PROJECTS_DIR, `${slug}.mdx`);
    const raw = readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    if (!data.title || !data.description) {
      return null;
    }

    return {
      slug,
      frontmatter: {
        title: data.title,
        description: data.description,
        tags: data.tags ?? [],
        date: data.date ?? "",
        repo: data.repo,
        demo: data.demo,
        language: data.language ?? "Unknown",
      },
      raw: content,
    };
  } catch {
    return null;
  }
}

export function getAllProjects(): Project[] {
  const slugs = getProjectSlugs();
  const projects = slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => p !== null);

  return projects.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}
