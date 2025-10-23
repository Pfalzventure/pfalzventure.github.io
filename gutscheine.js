/* ============================
   🎟️ Pfalzventure Gutschein-System
   ============================ */

// ✅ Liste gültiger Gutscheine (du kannst hier beliebig erweitern)
const GUTSCHEINE = [
  { code: "WALD50", betrag: 50 },   // 50 € Rabatt
  { code: "NEUKUNDE10", betrag: 10 },
  { code: "SURVIVAL25", betrag: 25 },
  { code: "Pfalz2025", betrag: 15 }
];

/**
 * Prüft, ob ein Gutschein gültig ist.
 * Wird von applyVoucher() in cart.html aufgerufen.
 * @param {string} code - Der eingegebene Gutscheincode
 * @returns {object} { valid: boolean, amount: number }
 */
function checkVoucher(code) {
  // Code immer in Großbuchstaben vergleichen
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
 * Optionale Zusatzfunktion (nicht zwingend nötig):
 * Kann z. B. serverseitig oder per E-Mail genutzt werden,
 * wenn du später Gutscheincodes dynamisch prüfen willst.
 */
function listAllVouchers() {
  console.table(GUTSCHEINE);
  return GUTSCHEINE.map(v => v.code);
}

console.log("🎟️ gutscheine.js geladen – bereit zur Verwendung");

