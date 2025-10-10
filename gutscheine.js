async function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim();
  const totalElement = document.querySelector(".cart-total");
  let total = parseFloat(totalElement.dataset.total);

  const message = document.getElementById("voucherMessage");

  if (!code) {
    message.innerText = "❌ Bitte einen Code eingeben.";
    return;
  }

  try {
    // 🔒 Sicherer Zugriff über deine eigene API
    const res = await fetch("/api/checkVoucher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (data.valid) {
      // ✅ Gutschein gültig
      const newTotal = Math.max(total - data.value, 0);
      totalElement.dataset.total = newTotal.toFixed(2);
      totalElement.innerText = newTotal.toFixed(2) + " €";
      message.innerText = `✅ Gutschein gültig! (${data.value} € abgezogen)`;

      // Optional: Kunde anzeigen
      console.log("Gutscheininhaber:", data.customer);
    } else if (data.error) {
      message.innerText = "⚠️ Fehler: " + data.error;
    } else {
      message.innerText = "❌ Ungültiger oder verbrauchter Code.";
    }
  } catch (err) {
    console.error(err);
    message.innerText = "⚠️ Fehler beim Prüfen des Gutscheins.";
  }
}
