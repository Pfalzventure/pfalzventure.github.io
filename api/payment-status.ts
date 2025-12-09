import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // erlaubt alle Domains
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // --- ID prüfen ---
  const paymentId = req.query.id;
  if (!paymentId) return res.status(400).json({ status: "missing_id" });

  // --- Status aus KV lesen ---
  const status = await kv.get(`payment:${paymentId}`);
  return res.status(200).json({ status: status || "unknown" });
}
