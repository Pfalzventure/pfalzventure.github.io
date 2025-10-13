import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Testwert schreiben und lesen
    await redis.set("testKey", "Hallo Pfalzventure!");
    const value = await redis.get("testKey");

    return res.status(200).json({
      success: true,
      message: "Verbindung zu Upstash funktioniert 🎉",
      value,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

 
