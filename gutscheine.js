async function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim();
  const message = document.getElementById("voucherMessage");
  const totalElement = document.getElementById("cart-total");
  let total = parseFloat(totalElement.innerText.replace(",", "."));

  if (!code) {
    message.innerText = "❌ Bitte einen Code eingeben.";
    return;
  }

  try {
    const url = "https://script.google.com/macros/s/AKfycbyMvpBl7abaGSNU4d9l7ouqKu-P0KlOnyUt7C4d7vW1DZS63e6zJZsBuvvQ4xWMxaph/exec"; // deine WebApp-URL

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "redeem",
        value: total,
        text: code
      })
    });

    const result = await res.json();

    if (result.status === "ok") {
      totalElement.innerText = result.newTotal.toFixed(2).replace(".", ",");
      message.innerText = result.message;

      if (result.newCode) {
        message.innerText += ` Neuer Code: ${result.newCode}`;
      }
    } else {
      message.innerText = result.message;
    }
  } catch (err) {
    console.error("Fehler beim Gutschein-Check:", err);
    message.innerText = "⚠️ Fehler bei der Verbindung zum Server.";
  }
}
