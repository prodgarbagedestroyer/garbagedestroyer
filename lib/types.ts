export type ProjectStatus = "active" | "archived" | "experimental";

export interface ProjectFrontmatter {
  title: string;
  description: string;
  tags: string[];
  date: string;
  repo?: string;
  demo?: string;
  language: string;
  featured: boolean;
  status: ProjectStatus;
  org: string;
  videoId?: string;
  videoIds?: string[];
  videoUrl?: string;
  sortOrder?: number;
  coverImage?: string;
  homepage?: string;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  raw: string;
}
