"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

export function SearchInput() {
  const router = useRouter();
  const sp = useSearchParams();
  const [value, setValue] = useState(sp.get("q") ?? "");

  useEffect(() => {
    setValue(sp.get("q") ?? "");
  }, [sp]);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(sp.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(`/projects${qs ? `?${qs}` : ""}`);
    },
    [value, sp, router]
  );

  const clear = useCallback(() => {
    setValue("");
    const params = new URLSearchParams(sp.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(`/projects${qs ? `?${qs}` : ""}`);
  }, [sp, router]);

  return (
    <form onSubmit={submit} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search projects..."
        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 pr-8 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}
