import {
  Film,
  FolderGit,
  AtSign,
  TvMinimalPlay,
  MessageCircle,
  Mail,
  ArrowUpRight,
} from "lucide-react";

interface SocialLink {
  label: string;
  url: string;
  description: string;
  icon: typeof Film;
}

const links: SocialLink[] = [
  {
    label: "YouTube",
    url: "https://youtube.com/@prod.garbagedestroyer",
    description: "Software commentary, benchmarks, and deep-dive tutorials.",
    icon: Film,
  },
  {
    label: "GitHub",
    url: "https://github.com/prodgarbagedestroyer",
    description: "Open-source projects in Rust, Go, Svelte, and WebAssembly.",
    icon: FolderGit,
  },
  {
    label: "Twitter / X",
    url: "https://x.com/prodgarbagedestroyer",
    description: "Quick takes on systems programming and dev tooling.",
    icon: AtSign,
  },
  {
    label: "Discord",
    url: "https://discord.gg/prodgarbagedestroyer",
    description: "Community server for discussing projects and videos.",
    icon: MessageCircle,
  },
  {
    label: "Email",
    url: "mailto:prod@garbagedestroyer.com",
    description: "Direct line for collaborations, sponsorships, or inquiries.",
    icon: Mail,
  },
  {
    label: "Twitch",
    url: "https://twitch.tv/prodgarbagedestroyer",
    description: "Live coding sessions — compilers, kernels, and game engines.",
    icon: TvMinimalPlay,
  },
];

export default function LinksPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Links
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Find me across the internet. One link per platform, no clutter.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <link.icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-100" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-100">{link.label}</p>
              <p className="truncate text-xs text-zinc-500">
                {link.description}
              </p>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        ))}
      </div>
    </div>
  );
}
