interface Video {
  title: string;
  date: string;
  description: string;
  youtubeId: string;
  duration: string;
}

const videos: Video[] = [
  {
    title: "Rust vs Go: HTTP Throughput at 100K Connections",
    date: "2026-07-25",
    description:
      "Benchmarking raw HTTP server throughput — comparing async Rust (Tokio) against Go goroutines under heavy load. Latency percentiles, memory overhead, and CPU saturation.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "18:24",
  },
  {
    title: "I Rewrote My CLI in Zig (and Regretted It)",
    date: "2026-07-15",
    description:
      "A candid walkthrough of porting a 3K-line Rust CLI tool to Zig. Comptime metaprogramming, error handling patterns, and where each language excels.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "22:10",
  },
  {
    title: "Bun vs Deno vs Node: The 2026 Runtime Showdown",
    date: "2026-07-05",
    description:
      "Cold starts, throughput, memory footprint, and developer experience — a comprehensive look at where each server-side JavaScript runtime stands in mid-2026.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "31:15",
  },
  {
    title: "WebAssembly on the Edge: Is It Ready?",
    date: "2026-06-20",
    description:
      "Deploying Wasm modules to Cloudflare Workers, Fastly Compute, and a custom AOT runtime. Latency benchmarks and real-world viability assessment.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "25:42",
  },
  {
    title: "Building a JIT Compiler in Rust (Step by Step)",
    date: "2026-06-08",
    description:
      "From lexer to native code — implementing a simple JIT compiler using Cranelift. Covers IR generation, register allocation, and emitting x86-64 machine code.",
    youtubeId: "dQw4w9WgXcQ",
    duration: "45:30",
  },
];

export default function VideosPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Videos</h1>
        <p className="max-w-xl leading-relaxed text-muted">
          Software commentary, systems programming deep-dives, and benchmark analysis.
        </p>
      </header>

      <div className="space-y-6">
        {videos.map((video) => (
          <div
            key={video.youtubeId}
            className="flex flex-col gap-4 rounded-md border border-border bg-surface p-5 sm:flex-row"
          >
            <div className="aspect-video w-full shrink-0 overflow-hidden rounded border border-border sm:w-48">
              <div className="flex h-full items-center justify-center bg-zinc-900 text-xs text-muted">
                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center transition-colors hover:text-foreground"
                >
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-1">
                <a
                  href={`https://youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors hover:text-accent"
                >
                  {video.title}
                </a>
                <p className="text-sm leading-relaxed text-muted">
                  {video.description}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                <time>{video.date}</time>
                <span className="text-zinc-700">|</span>
                <span>{video.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
