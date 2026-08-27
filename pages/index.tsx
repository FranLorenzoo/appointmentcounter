import { useEffect, useState } from "react";

const POLL_INTERVAL_MS = 2000;

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const res = await fetch("/api/counter", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") setCount(data.count);
      } catch {
        // swallow — retry on next tick
      }
    }

    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-700 sm:text-5xl dark:text-zinc-200">
        Citas agendadas por Tecna
      </h1>
      <div className="text-[24vw] font-bold leading-none tabular-nums text-black dark:text-white">
        {count ?? "–"}
      </div>
    </div>
  );
}
