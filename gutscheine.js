// ============================
// Gutscheine
// ============================
const gutscheine = [
  { code: "PFALZ10", wert: 10 },
  { code: "ABENTEUER25", wert: 25 },
  { code: "SOMMER50", wert: 50 },
  { code: "GRATIS100", wert: 100 }
];

// ============================
// Gutschein anwenden
// ============================
function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim().toUpperCase();
  const msg = document.getElementById("voucherMessage");
  const found = gutscheine.find(g => g.code === code);

  if (!found) {
    msg.innerText = "❌ Gutschein ungültig oder abgelaufen.";
    msg.style.color = "red";
    eingelösterGutschein = null;
    saveCart();
    updateCart();
    document.getElementById("paypal-button-container").style.display = "block";
    return;
  }

  eingelösterGutschein = found;
  msg.innerHTML = `✅ Gutschein "${found.code}" eingelöst (${found.wert.toFixed(2)} € Rabatt).<br>
  Bitte <strong>nicht direkt bezahlen</strong> – du erhältst eine angepasste Rechnung per E-Mail.`;
  msg.style.color = "green";

  // PayPal ausblenden, wenn Gutschein genutzt wird
  document.getElementById("paypal-button-container").style.display = "none";
  saveCart();
  updateCart();
}
