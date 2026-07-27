"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, MonitorPlay, Link2 } from "lucide-react";

const links = [
  { href: "/", label: "Index", icon: Home },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/videos", label: "Videos", icon: MonitorPlay },
  { href: "/links", label: "Links", icon: Link2 },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="flex h-14 items-center border-b border-zinc-800 px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100">
          garbagedestroyer
        </Link>
      </div>

      <nav className="flex flex-1 flex-col p-3">
        <ul className="space-y-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-800 px-5 py-4">
        <p className="font-mono text-xs text-zinc-500">@prod.garbagedestroyer</p>
      </div>
    </aside>
  );
}
