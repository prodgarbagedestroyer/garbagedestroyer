import { ORG_URLS } from "./site";
import { fetchYouTubeVideos } from "@/lib/youtube";

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  date: string;
  duration: string;
  description: string;
  relatedProjectSlugs: string[];
  featured: boolean;
  thumbnail?: string;
}

export function getVideoUrl(youtubeId: string): string {
  return `https://youtube.com/watch?v=${youtubeId}`;
}

export function getVideoThumbnail(
  youtubeId: string,
  customThumbnail?: string
): string {
  return customThumbnail ?? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getChannelUrl(): string {
  return ORG_URLS.youtube;
}

const staticVideos: Video[] = [
  {
    id: "rust-vs-go-http",
    title: "Rust vs Go: HTTP Throughput at 100K Connections",
    youtubeId: "placeholder-rust-go-http",
    date: "2026-07-25",
    duration: "18:24",
    description:
      "Benchmarking raw HTTP server throughput — comparing async Rust (Tokio) against Go goroutines under heavy load. Latency percentiles, memory overhead, and CPU saturation.",
    relatedProjectSlugs: [],
    featured: true,
  },
  {
    id: "zig-cli-rewrite",
    title: "I Rewrote My CLI in Zig (and Regretted It)",
    youtubeId: "placeholder-zig-cli",
    date: "2026-07-15",
    duration: "22:10",
    description:
      "A candid walkthrough of porting a 3K-line Rust CLI tool to Zig. Comptime metaprogramming, error handling patterns, and where each language excels.",
    relatedProjectSlugs: [],
    featured: false,
  },
  {
    id: "runtime-showdown-2026",
    title: "Bun vs Deno vs Node: The 2026 Server-Side Runtime Showdown",
    youtubeId: "placeholder-runtime-showdown",
    date: "2026-07-05",
    duration: "31:15",
    description:
      "Cold starts, throughput, memory footprint, and developer experience — a comprehensive look at where each server-side JavaScript runtime stands in mid-2026.",
    relatedProjectSlugs: [],
    featured: true,
  },
  {
    id: "wasm-on-the-edge",
    title: "WebAssembly on the Edge: Is It Ready?",
    youtubeId: "placeholder-wasm-edge",
    date: "2026-06-20",
    duration: "25:42",
    description:
      "Deploying Wasm modules to Cloudflare Workers, Fastly Compute, and a custom AOT runtime. Latency benchmarks and real-world viability assessment.",
    relatedProjectSlugs: ["wasi-runtime-rs"],
    featured: false,
  },
  {
    id: "jit-compiler-rust",
    title: "Building a JIT Compiler in Rust (Step by Step)",
    youtubeId: "placeholder-jit-compiler",
    date: "2026-06-08",
    duration: "45:30",
    description:
      "From lexer to native code — implementing a simple JIT compiler using Cranelift. Covers IR generation, register allocation, and emitting x86-64 machine code.",
    relatedProjectSlugs: ["jit-compiler-cranelift"],
    featured: true,
  },
];

async function loadMergedVideos(): Promise<Video[]> {
  const live = await fetchYouTubeVideos();

  if (!live?.length) {
    return staticVideos;
  }

  return live.map((lv) => {
    const match = staticVideos.find((sv) => sv.youtubeId === lv.youtubeId);
    return {
      id: lv.id,
      title: lv.title,
      youtubeId: lv.youtubeId,
      date: lv.date,
      duration: lv.duration || match?.duration || "",
      description: lv.description || match?.description || "",
      relatedProjectSlugs: match?.relatedProjectSlugs ?? [],
      featured: match?.featured ?? false,
      thumbnail: lv.thumbnail,
    };
  });
}

let cachedVideos: Video[] | null = null;

export async function getAllVideos(): Promise<Video[]> {
  if (cachedVideos) return cachedVideos;
  cachedVideos = await loadMergedVideos();
  return cachedVideos;
}

export async function getFeaturedVideo(): Promise<Video | undefined> {
  const all = await getAllVideos();
  return all.find((v) => v.featured);
}

export async function getVideosByProject(slug: string): Promise<Video[]> {
  const all = await getAllVideos();
  return all.filter((v) => v.relatedProjectSlugs.includes(slug));
}
