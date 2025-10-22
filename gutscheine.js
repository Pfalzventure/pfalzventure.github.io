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
    document.getElementById("voucherForm").style.display = "none";
    return;
  }

  eingelösterGutschein = found;
  msg.innerHTML = `✅ Gutschein "${found.code}" eingelöst (${found.wert.toFixed(2)} € Rabatt).<br>
  Bitte <strong>nicht direkt bezahlen</strong> – du erhältst eine angepasste Rechnung per E-Mail.`;
  msg.style.color = "green";

  document.getElementById("paypal-button-container").style.display = "none";
  document.getElementById("voucherForm").style.display = "block";
  document.getElementById("usedVoucher").value = found.code;
  saveCart();
  updateCart();
}

// ============================
// E-Mail Benachrichtigung via Formspree
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("notifyForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("userEmail").value;
    const voucher = document.getElementById("usedVoucher").value;
    const msg = document.getElementById("notifyMessage");

    // 💡 Hier deinen echten Formspree-Link eintragen:
    const formspreeUrl = "https://formspree.io/f/DEIN_FORM_ID";

    // ============================
    // Warenkorb als Text zusammenbauen
    // ============================
    let cartText = cart.map(item =>
      `- ${item.name} – ${item.price.toFixed(2)} € x${item.qty}`
    ).join("\n");

    const sumBefore = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const rabatt = eingelösterGutschein ? eingelösterGutschein.wert : 0;
    const sumAfter = Math.max(0, sumBefore - rabatt);

    const bodyText = `
Neue Gutscheineinlösung auf Pfalzventure 🏕️

Email: ${email}
Gutschein: ${voucher}

Warenkorb:
${cartText}

Gesamtsumme (vor Rabatt): ${sumBefore.toFixed(2)} €
Rabatt: ${rabatt.toFixed(2)} €
Gesamt nach Rabatt: ${sumAfter.toFixed(2)} €
    `.trim();

    // ============================
    // Mail senden
    // ============================
    const response = await fetch(formspreeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,  // Kunde
        message: bodyText  // Wird im Mailtext angezeigt
      })
    });

    if (response.ok) {
      msg.innerText = "✅ Danke! Deine Daten wurden übermittelt.";
      msg.style.color = "green";
      form.reset();
    } else {
      msg.innerText = "❌ Fehler beim Senden. Bitte probiere es später erneut.";
      msg.style.color = "red";
    }
  });
});

