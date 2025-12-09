import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const paymentId = req.query.id;
  if (!paymentId) return res.status(400).json({ status: "missing_id" });

  const status = await kv.get(`payment:${paymentId}`);
  return res.status(200).json({ status: status || "unknown" });
}
