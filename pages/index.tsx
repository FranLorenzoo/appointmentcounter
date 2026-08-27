import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/counter-stream");
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.count === "number") setCount(data.count);
      } catch {
        // ignore malformed events
      }
    };
    return () => es.close();
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
