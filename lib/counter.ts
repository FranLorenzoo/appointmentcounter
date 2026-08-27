import { Redis } from "@upstash/redis";

const KEY = "appointmentcounter:count";
const INITIAL_COUNT = 6;

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  throw new Error(
    "Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN."
  );
}

const redis = new Redis({ url, token });

let seedPromise: Promise<unknown> | null = null;
function ensureSeeded(): Promise<unknown> {
  if (!seedPromise) {
    seedPromise = redis.set(KEY, INITIAL_COUNT, { nx: true }).catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

export async function getCount(): Promise<number> {
  await ensureSeeded();
  const value = await redis.get<number>(KEY);
  return typeof value === "number" ? value : INITIAL_COUNT;
}

export async function increment(): Promise<number> {
  await ensureSeeded();
  return await redis.incr(KEY);
}
