import { readCache, writeCache } from "./cache";

const GITHUB_ORG = "prodgarbagedestroyer";
const CACHE_KEY = "github-repos";

export interface GitHubRepo {
  name: string;
  fullName: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  isArchived: boolean;
  topics: string[];
}

async function fetchOrgRepos(): Promise<GitHubRepo[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "garbagedestroyer.com/1.0",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?type=public&sort=updated&per_page=100`,
      { headers, next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const repos = await res.json();
    if (!Array.isArray(repos)) return null;

    return repos.map(
      (r: {
        name: string;
        full_name: string;
        description: string | null;
        html_url: string;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        updated_at: string;
        archived: boolean;
        topics: string[];
      }) => ({
        name: r.name,
        fullName: r.full_name,
        description: r.description ?? "",
        url: r.html_url,
        language: r.language ?? "",
        stars: r.stargazers_count,
        forks: r.forks_count,
        updatedAt: r.updated_at.slice(0, 10),
        isArchived: r.archived,
        topics: r.topics ?? [],
      })
    );
  } catch {
    return null;
  }
}

let cachedRepos: GitHubRepo[] | null = null;

export async function getOrgRepos(): Promise<GitHubRepo[]> {
  if (cachedRepos) return cachedRepos;

  const live = await fetchOrgRepos();
  if (live !== null) {
    writeCache(CACHE_KEY, live);
    cachedRepos = live;
    return cachedRepos;
  }

  const fromCache = readCache<GitHubRepo[]>(CACHE_KEY);
  cachedRepos = fromCache ?? [];
  return cachedRepos;
}
