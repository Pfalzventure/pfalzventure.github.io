export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Rohdaten vom PayPal Webhook
    const event = req.body;

    console.log("Webhook Event:", event);

    // Beispiel: Kauf abgeschlossen
    if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      const payerEmail = event.resource.payer.email_address;

      // TODO: Mailversand (z. B. über Nodemailer oder ein SMTP)
      console.log(`Neue Bestellung von: ${payerEmail}`);
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
