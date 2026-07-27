export default function IndexPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">garbagedestroyer</h1>
        <p className="max-w-xl leading-relaxed text-muted">
          Systems programming, software benchmarking, and technical commentary.
          Exploring Rust, Go, WebAssembly, and the tools that shape how we build.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            Activity Feed
          </h2>
          <span className="text-xs text-muted">Chronological</span>
        </div>

        <div className="space-y-8 border-l border-border pl-6">
          <FeedItem
            date="2026-07-25"
            type="video"
            title="Rust vs Go: HTTP Throughput at 100K Connections"
            description="Benchmarking raw HTTP server throughput — comparing async Rust (Tokio) against Go goroutines under heavy load."
            link="https://youtube.com/@prod.garbagedestroyer"
          />
          <FeedItem
            date="2026-07-20"
            type="repo"
            title="wasi-runtime-rs"
            description="Pushed to main — A minimal WebAssembly System Interface runtime written in Rust. Supports WASI preview2 with component model."
            link="https://github.com/prodgarbagedestroyer/wasi-runtime-rs"
          />
          <FeedItem
            date="2026-07-15"
            type="video"
            title="I Rewrote My CLI in Zig (and Regretted It)"
            description="A candid walkthrough of porting a 3K-line Rust CLI tool to Zig — what worked, what broke, and where each language shines."
            link="https://youtube.com/@prod.garbagedestroyer"
          />
          <FeedItem
            date="2026-07-10"
            type="repo"
            title="svelte-canvas-engine"
            description="New release v0.4.0 — A high-performance 2D canvas rendering engine for Svelte 5, powered by WebGL with automatic batched draw calls."
            link="https://github.com/prodgarbagedestroyer/svelte-canvas-engine"
          />
          <FeedItem
            date="2026-07-05"
            type="video"
            title="Bun vs Deno vs Node: The 2026 Server-Side Runtime Showdown"
            description="Cold starts, throughput, memory, and DX — a comprehensive look at where each runtime stands in mid-2026."
            link="https://youtube.com/@prod.garbagedestroyer"
          />
        </div>
      </section>
    </div>
  );
}

function FeedItem({
  date,
  type,
  title,
  description,
  link,
}: {
  date: string;
  type: "video" | "repo";
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="relative pb-8 last:pb-0">
      <div className="absolute -left-[25px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-border bg-surface">
        <span
          className={`block h-1.5 w-1.5 rounded-full ${
            type === "video" ? "bg-zinc-400" : "bg-zinc-500"
          }`}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="rounded border border-border px-1.5 py-0 text-[10px] font-medium uppercase tracking-wider text-muted">
            {type}
          </span>
          <time className="text-xs text-muted">{date}</time>
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium transition-colors hover:text-accent"
        >
          {title}
        </a>
        <p className="text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
