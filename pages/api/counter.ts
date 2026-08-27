import type { NextApiRequest, NextApiResponse } from "next";

import { getCount, increment } from "@/lib/counter";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ count: getCount() });
  }
  if (req.method === "POST") {
    return res.status(200).json({ count: increment() });
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).end();
}
