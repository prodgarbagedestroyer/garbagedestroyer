"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, MonitorPlay, Link2, Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/videos", label: "Videos", icon: MonitorPlay },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/links", label: "Links", icon: Link2 },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavItems = () => (
    <ul className="space-y-0.5">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setMobileOpen(false)}
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
  );

  return (
    <>
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 md:hidden">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-100"
          onClick={() => setMobileOpen(false)}
        >
          garbagedestroyer
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-zinc-950/80 md:hidden" onClick={() => setMobileOpen(false)}>
          <nav
            className="h-full w-64 border-r border-zinc-800 bg-zinc-900 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <NavItems />
            <div className="mt-6 border-t border-zinc-800 pt-4">
              <p className="font-mono text-xs text-zinc-500">
                @prod.garbagedestroyer
              </p>
            </div>
          </nav>
        </div>
      )}

      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900">
        <div className="flex h-14 items-center border-b border-zinc-800 px-5">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100">
            garbagedestroyer
          </Link>
        </div>
        <nav className="flex flex-1 flex-col p-3">
          <NavItems />
        </nav>
        <div className="border-t border-zinc-800 px-5 py-4">
          <p className="font-mono text-xs text-zinc-500">@prod.garbagedestroyer</p>
        </div>
      </aside>
    </>
  );
}
