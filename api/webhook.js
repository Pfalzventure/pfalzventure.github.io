// api/webhook.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    // PayPal schickt JSON
    const body = req.body;

    // Deine neue Webhook-ID von PayPal
    const WEBHOOK_ID = "85L6062605761571E";

    // Sicherheitsprüfung: stimmt die ID?
    if (!body.id || body.id !== WEBHOOK_ID) {
      return res.status(400).send("Ungültige Webhook-ID");
    }

    // Hier kannst du auf Events reagieren:
    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      console.log("Neue Bestellung eingegangen!");
      // TODO: hier E-Mail-Bestätigung an Kunden versenden
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    res.status(500).send("Internal Server Error");
  }
}
