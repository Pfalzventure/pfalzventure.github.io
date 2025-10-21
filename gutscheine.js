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
    // ✅ Anfrage an dein Google Apps Script mit Code als URL-Parameter
    const res = await fetch(`https://script.google.com/macros/s/AKfycbw_PoTi00WXNZTlhhxn8BZgIiIcDXqo2OkwZeiTMBueOkKhCk2EjJZTwiAfk5DY9Jk2/exec?code=${encodeURIComponent(code)}`);
    const data = await res.json();

    if (data.valid) {
      const newTotal = Math.max(total - data.balance, 0);
      totalElement.dataset.total = newTotal.toFixed(2);
      totalElement.innerText = newTotal.toFixed(2) + " €";
      message.innerText = `✅ Gutschein gültig! (${data.balance} € abgezogen)`;
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
