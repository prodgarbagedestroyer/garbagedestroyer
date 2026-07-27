import { ORG_URLS } from "./site";

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  date: string;
  duration: string;
  description: string;
  relatedProjectSlugs: string[];
  featured: boolean;
}

export function getVideoUrl(youtubeId: string): string {
  return `https://youtube.com/watch?v=${youtubeId}`;
}

export function getVideoThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getChannelUrl(): string {
  return ORG_URLS.youtube;
}

export const videos: Video[] = [
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

export function getAllVideos(): Video[] {
  return [...videos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedVideo(): Video | undefined {
  return videos.find((v) => v.featured);
}

export function getVideosByProject(slug: string): Video[] {
  return videos.filter((v) => v.relatedProjectSlugs.includes(slug));
}
