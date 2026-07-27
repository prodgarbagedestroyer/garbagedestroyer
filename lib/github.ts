import { readCache, writeCache } from "./cache";

const GITHUB_USER = "prodgarbagedestroyer";
const SOURCES = [
  { type: "user" as const, name: "prodgarbagedestroyer" },
  { type: "org" as const, name: "prod-garbage-destroyer" },
];
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

async function fetchRepos(
  type: "user" | "org",
  name: string
): Promise<GitHubRepo[] | null> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "garbagedestroyer.com/1.0",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/${type === "org" ? "orgs" : "users"}/${name}/repos?type=public&sort=updated&per_page=100`,
      { headers, next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];

    const repos = await res.json();
    if (!Array.isArray(repos)) return [];

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
    return [];
  }
}

async function fetchAllRepos(): Promise<GitHubRepo[] | null> {
  const results = await Promise.all(
    SOURCES.map((s) => fetchRepos(s.type, s.name))
  );

  const merged = results.flat().filter(Boolean) as GitHubRepo[];

  if (merged.length === 0) return null;

  const seen = new Set<string>();
  const deduped = merged.filter((r) => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  deduped.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return deduped;
}

let cachedRepos: GitHubRepo[] | null = null;

export async function getOrgRepos(): Promise<GitHubRepo[]> {
  if (cachedRepos) return cachedRepos;

  const live = await fetchAllRepos();
  if (live !== null) {
    writeCache(CACHE_KEY, live);
    cachedRepos = live;
    return cachedRepos;
  }

  const fromCache = readCache<GitHubRepo[]>(CACHE_KEY);
  cachedRepos = fromCache ?? [];
  return cachedRepos;
}
