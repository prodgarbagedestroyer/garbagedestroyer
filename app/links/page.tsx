import {
  Film,
  FolderGit,
  Camera,
  Music2,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { verifiedLinks } from "@/content/links";

const iconMap: Record<string, typeof Film> = {
  YouTube: Film,
  GitHub: FolderGit,
  Instagram: Camera,
  TikTok: Music2,
  Facebook: Users,
};

export default function LinksPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Links
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Find me across the internet. YouTube and GitHub are the primary hubs.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {verifiedLinks.map((link) => {
          const Icon = iconMap[link.label] ?? ArrowUpRight;
          return (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
                <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-100" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100">{link.label}</p>
                <p className="truncate text-xs text-zinc-500">
                  {link.description}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
