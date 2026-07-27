import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), ".cache");

function ensureDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readCache<T>(key: string): T | null {
  try {
    const filePath = join(CACHE_DIR, `${key}.json`);
    if (!existsSync(filePath)) return null;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  try {
    ensureDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch {}
}
