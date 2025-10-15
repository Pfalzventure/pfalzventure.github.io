async function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim();
  const totalElement = document.querySelector(".cart-total");
  const message = document.getElementById("voucherMessage");

  let total = parseFloat(totalElement?.dataset.total || 0);

  if (!code) {
    message.innerText = "❌ Bitte einen Code eingeben.";
    return;
  }

  try {
    // 🔒 Anfrage an dein Google Apps Script (statt /api/checkVoucher)
    const res = await fetch("https://script.google.com/macros/s/AKfycbzHL23yHZ7I9-VT13pgp78tqakpyPEdDPEaopxCamfwNCL8wLkuWN0Aqw7gfNmMKMjg/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (data.valid) {
      // ✅ Gutschein gültig
      const newTotal = Math.max(total - parseFloat(data.balance), 0);
      totalElement.dataset.total = newTotal.toFixed(2);
      totalElement.innerText = newTotal.toFixed(2) + " €";
      message.innerText = `✅ Gutschein gültig! (${data.balance} € abgezogen)`;

      console.log("Restwert:", data.balance, "€");
    } else if (data.redeemed) {
      message.innerText = "❌ Gutschein wurde bereits eingelöst.";
    } else if (data.error) {
      message.innerText = "⚠️ Fehler: " + data.error;
    } else {
      message.innerText = "❌ Ungültiger Gutschein-Code.";
    }
  } catch (err) {
    console.error(err);
    message.innerText = "⚠️ Fehler beim Prüfen des Gutscheins.";
  }
}
