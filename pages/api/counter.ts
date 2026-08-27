import type { NextApiRequest, NextApiResponse } from "next";

import { getCount, increment } from "@/lib/counter";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ count: await getCount() });
  }
  if (req.method === "POST") {
    return res.status(200).json({ count: await increment() });
  }
  res.setHeader("Allow", "GET, POST");
  return res.status(405).end();
}
