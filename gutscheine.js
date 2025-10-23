/* ============================
   🎟️ Pfalzventure Gutschein-System
   ============================ */

// ✅ Liste gültiger Gutscheine
const GUTSCHEINE = [
  { code: "WALD50", betrag: 50 },   // 50 € Rabatt
  { code: "NEUKUNDE10", betrag: 10 },
  { code: "SURVIVAL25", betrag: 25 },
  { code: "Pfalz2025", betrag: 15 }
];

/**
 * Prüft, ob ein Gutschein gültig ist.
 * Wird von applyVoucher() aus cart.html aufgerufen.
 * @param {string} code - Der eingegebene Gutscheincode
 * @returns {object} { valid: boolean, amount: number }
 */
function checkVoucher(code) {
  const clean = code.trim().toUpperCase();
  const found = GUTSCHEINE.find(g => g.code.toUpperCase() === clean);

  if (found) {
    console.log(`✅ Gutschein "${found.code}" gefunden (${found.betrag} € Rabatt)`);
    return { valid: true, amount: found.betrag };
  } else {
    console.warn(`❌ Gutschein "${code}" ungültig`);
    return { valid: false, amount: 0 };
  }
}

/**
 * Visuelles Feedback für den Nutzer
 * @param {string} msg - Nachrichtentext
 * @param {boolean} success - true = grün, false = rot
 */
function showVoucherMessage(msg, success = true) {
  const el = document.getElementById("voucherMessage");
  if (!el) return;

  el.textContent = msg;
  el.style.color = success ? "green" : "red";
  el.style.fontWeight = "600";
  el.style.marginTop = "5px";

  // Nachricht nach 4 Sekunden wieder ausblenden
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => {
    el.textContent = "";
  }, 4000);
}

/* ====================================
   🔁 Erweiterung von applyVoucher()
   ==================================== */

function applyVoucher() {
  const input = document.getElementById("voucherCode");
  if (!input) return;

  const code = input.value.trim();
  if (!code) {
    showVoucherMessage("Bitte einen Gutscheincode eingeben.", false);
    return;
  }

  const result = checkVoucher(code);
  if (result.valid) {
    eingelösterGutschein = { code, wert: result.amount };
    saveCart();
    updateCart();
    showVoucherMessage(`✅ Gutschein "${code}" eingelöst: -${result.amount} €`, true);
  } else {
    eingelösterGutschein = null;
    saveCart();
    updateCart();
    showVoucherMessage("❌ Ungültiger Gutschein-Code!", false);
  }
}

/**
 * Nur zur Übersicht für dich:
 * Zeigt alle gültigen Codes in der Konsole an.
 */
function listAllVouchers() {
  console.table(GUTSCHEINE);
  return GUTSCHEINE.map(v => v.code);
}

console.log("🎟️ gutscheine.js geladen – bereit zur Verwendung");
