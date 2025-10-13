// /api/checkVoucher.js

import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Kein Code übergeben" });
  }

  try {
    // Gutschein aus DB lesen
    const voucher = await kv.hgetall(`voucher:${code}`);

    if (!voucher || !voucher.value) {
      return res.status(200).json({ valid: false });
    }

    if (voucher.used === "true") {
      return res.status(200).json({ valid: false });
    }

    // Atomar entwerten: Nur wenn nicht benutzt
    const alreadyUsed = await kv.hget(`voucher:${code}`, "used");
    if (alreadyUsed === "true") {
      return res.status(200).json({ valid: false });
    }

    await kv.hset(`voucher:${code}`, { used: "true", usedAt: Date.now() });

    return res.status(200).json({
      valid: true,
      value: parseFloat(voucher.value),
      customer: voucher.customer || null,
    });
  } catch (err) {
    console.error("Fehler in checkVoucher:", err);
    return res.status(500).json({ error: "Serverfehler beim Prüfen" });
  }
}
