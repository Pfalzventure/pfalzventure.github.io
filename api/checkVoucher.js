export default async function handler(req, res) {
  // Nur POST-Anfragen zulassen
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // --- Eingehende Daten ---
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Missing code" });
    }

    // --- Deine Google Apps Script WebApp URL ---
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyVvw64C9FdPzk0MVqITgYrDXMa7LGx3kQ8Ql-oGsn4HaaBrsgRb7WXaJPumbL2A6SS/exec";

    // --- Secret aus Vercel-Umgebung ---
    const secret = process.env.GSHEET_SECRET;

    // --- Anfrage an dein Apps Script ---
    const response = await fetch(`${scriptUrl}?secret=${secret}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    // --- Antwort lesen ---
    const data = await response.json();

    // --- Durchreichen an deine Homepage ---
    return res.status(200).json(data);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}

