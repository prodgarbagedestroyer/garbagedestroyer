interface SocialLink {
  label: string;
  url: string;
  description: string;
}

const links: SocialLink[] = [
  {
    label: "YouTube",
    url: "https://youtube.com/@prod.garbagedestroyer",
    description: "Software commentary, benchmarks, and deep-dive tutorials.",
  },
  {
    label: "GitHub",
    url: "https://github.com/prodgarbagedestroyer",
    description: "Open-source projects in Rust, Go, Svelte, and WebAssembly.",
  },
  {
    label: "Twitter / X",
    url: "https://x.com/prodgarbagedestroyer",
    description: "Quick takes on systems programming and dev tooling.",
  },
  {
    label: "Discord",
    url: "https://discord.gg/prodgarbagedestroyer",
    description: "Community server for discussing projects and videos.",
  },
  {
    label: "Email",
    url: "mailto:prod@garbagedestroyer.com",
    description: "Direct line for collaborations, sponsorships, or inquiries.",
  },
  {
    label: "Twitch",
    url: "https://twitch.tv/prodgarbagedestroyer",
    description: "Live coding sessions — compilers, kernels, and game engines.",
  },
];

export default function LinksPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Links</h1>
        <p className="max-w-xl leading-relaxed text-muted">
          Find me across the internet. One link per platform, no clutter.
        </p>
      </header>

      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-md border border-border bg-surface px-5 py-4 transition-colors hover:bg-surface-hover"
          >
            <div className="space-y-0.5">
              <span className="text-sm font-medium">{link.label}</span>
              <p className="text-xs leading-relaxed text-muted">
                {link.description}
              </p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
