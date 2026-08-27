import type { NextApiRequest, NextApiResponse } from "next";

import { getCount, subscribe } from "@/lib/counter";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  res.socket?.setKeepAlive?.(true);
  res.socket?.setTimeout?.(0);

  res.write(`data: ${JSON.stringify({ count: getCount() })}\n\n`);

  const unsubscribe = subscribe(res);

  req.on("close", () => {
    unsubscribe();
    res.end();
  });
}
