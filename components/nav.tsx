"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Projects" },
  { href: "/videos", label: "Videos" },
  { href: "/links", label: "Links" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          garbagedestroyer
        </Link>
      </div>

      <nav className="flex flex-1 flex-col p-3">
        <ul className="space-y-0.5">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-surface text-foreground"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-5 py-4">
        <p className="text-xs text-muted">prod.garbagedestroyer</p>
      </div>
    </aside>
  );
}
