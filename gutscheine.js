async function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim();
  const totalElement = document.querySelector(".cart-total");
  let total = parseFloat(totalElement.dataset.total);

  if (!code) {
    document.getElementById("voucherMessage").innerText = "❌ Bitte einen Code eingeben.";
    return;
  }

  try {
    const url = "https://script.google.com/macros/s/AKfycbyVvw64C9FdPzk0MVqITgYrDXMa7LGx3kQ8Ql-oGsn4HaaBrsgRb7WXaJPumbL2A6SS/exec";

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ action: "redeem", value: total, text: code }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.text();

    if (result.includes("Neuer Code") || result.includes("vollständig eingelöst")) {
      document.getElementById("voucherMessage").innerText = "✅ Gutschein angewendet!";
      // 👉 Hier: totalElement.innerText anpassen mit neuem Betrag
    } else {
      document.getElementById("voucherMessage").innerText = "❌ Ungültiger oder verbrauchter Code.";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("voucherMessage").innerText = "⚠️ Fehler beim Prüfen des Gutscheins.";
  }
}
