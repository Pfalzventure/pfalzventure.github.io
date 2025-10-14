export default async function handler(req, res) {
  try {
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/testkey`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Upstash Error: ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      message: "Verbindung zu Upstash funktioniert 🎉",
      value: data.result ?? null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fehler bei REST-Test",
      error: error.message,
    });
  }
}

 
