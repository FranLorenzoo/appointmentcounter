import fs from "fs";
import path from "path";
import type { ServerResponse } from "http";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "counter.json");
const INITIAL_COUNT = 4;

const subscribers = new Set<ServerResponse>();

function readCount(): number {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (typeof parsed?.count === "number") return parsed.count;
  } catch {
    // fallthrough: initialize
  }
  writeCount(INITIAL_COUNT);
  return INITIAL_COUNT;
}

function writeCount(count: number): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify({ count }));
}

export function getCount(): number {
  return readCount();
}

export function increment(): number {
  const next = readCount() + 1;
  writeCount(next);
  broadcast(next);
  return next;
}

function broadcast(count: number): void {
  const payload = `data: ${JSON.stringify({ count })}\n\n`;
  for (const res of subscribers) {
    try {
      res.write(payload);
    } catch {
      subscribers.delete(res);
    }
  }
}

export function subscribe(res: ServerResponse): () => void {
  subscribers.add(res);
  return () => subscribers.delete(res);
}
