import { Redis } from "@upstash/redis";

const KEY = "appointmentcounter:count";
const INITIAL_COUNT = 6;

const redis = Redis.fromEnv();

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
