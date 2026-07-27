import { Film, GitBranch } from "lucide-react";

interface ActivityItem {
  date: string;
  type: "video" | "repo";
  title: string;
  description: string;
  link: string;
}

const feed: ActivityItem[] = [
  {
    date: "2026-07-25",
    type: "video",
    title: "Rust vs Go: HTTP Throughput at 100K Connections",
    description:
      "Benchmarking raw HTTP server throughput — comparing async Rust (Tokio) against Go goroutines under heavy load.",
    link: "https://youtube.com/@prod.garbagedestroyer",
  },
  {
    date: "2026-07-20",
    type: "repo",
    title: "wasi-runtime-rs",
    description:
      "Pushed to main — A minimal WebAssembly System Interface runtime written in Rust. Supports WASI preview2 with component model.",
    link: "https://github.com/prodgarbagedestroyer/wasi-runtime-rs",
  },
  {
    date: "2026-07-15",
    type: "video",
    title: "I Rewrote My CLI in Zig (and Regretted It)",
    description:
      "A candid walkthrough of porting a 3K-line Rust CLI tool to Zig — what worked, what broke, and where each language shines.",
    link: "https://youtube.com/@prod.garbagedestroyer",
  },
  {
    date: "2026-07-10",
    type: "repo",
    title: "svelte-canvas-engine",
    description:
      "New release v0.4.0 — A high-performance 2D canvas rendering engine for Svelte 5, powered by WebGL with automatic batched draw calls.",
    link: "https://github.com/prodgarbagedestroyer/svelte-canvas-engine",
  },
  {
    date: "2026-07-05",
    type: "video",
    title: "Bun vs Deno vs Node: The 2026 Server-Side Runtime Showdown",
    description:
      "Cold starts, throughput, memory, and DX — a comprehensive look at where each runtime stands in mid-2026.",
    link: "https://youtube.com/@prod.garbagedestroyer",
  },
];

export default function IndexPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          garbagedestroyer
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Systems programming, software benchmarking, and technical commentary.
          Exploring Rust, Go, WebAssembly, and the tools that shape how we build.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Activity Feed
          </h2>
          <span className="font-mono text-[11px] text-zinc-600">Chronological</span>
        </div>

        <div className="relative ml-3 space-y-0 border-l border-zinc-800">
          {feed.map((item) => (
            <TimelineItem key={`${item.date}-${item.title}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TimelineItem({ item }: { item: ActivityItem }) {
  const Icon = item.type === "video" ? Film : GitBranch;

  return (
    <div className="relative pb-10 last:pb-0">
      <div className="absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
        <Icon className="h-3 w-3 text-zinc-400" />
      </div>

      <div className="ml-7 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase text-zinc-500">
            {item.type}
          </span>
          <time className="font-mono text-xs text-zinc-600">{item.date}</time>
        </div>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium text-zinc-200 transition-colors hover:text-zinc-100"
        >
          {item.title}
        </a>
        <p className="text-sm leading-relaxed text-zinc-400">
          {item.description}
        </p>
      </div>
    </div>
  );
}
