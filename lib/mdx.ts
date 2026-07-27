import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { Project, ProjectFrontmatter, ProjectStatus } from "./types";

export type { Project, ProjectFrontmatter, ProjectStatus };

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
        featured: data.featured ?? false,
        status: data.status ?? "active",
        org: data.org ?? "prodgarbagedestroyer",
        videoId: data.videoId,
        videoIds: Array.isArray(data.videoIds)
          ? data.videoIds.filter((value: unknown): value is string => typeof value === "string")
          : data.videoId
            ? [data.videoId]
            : [],
        videoUrl: data.videoUrl,
        sortOrder: data.sortOrder,
        coverImage: data.coverImage,
        homepage: data.homepage,
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
    if (a.frontmatter.sortOrder !== undefined && b.frontmatter.sortOrder !== undefined) {
      return a.frontmatter.sortOrder - b.frontmatter.sortOrder;
    }
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.frontmatter.featured);
}
