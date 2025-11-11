// ============================
// 🛒 Zentraler Warenkorb-Loader
// ============================

document.addEventListener("DOMContentLoaded", async () => {
  // Prüfen, ob Warenkorb bereits existiert (z. B. bei SPA)
  if (document.querySelector("#cart")) {
    console.log("ℹ️ Warenkorb bereits vorhanden");
    return;
  }

  try {
    // cart.html laden
    const res = await fetch("partials/cart.html");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // temporär einfügen
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();

    // alle Elemente in Body einfügen (inkl. Styles)
    Array.from(temp.children).forEach(el => document.body.appendChild(el));

    console.log("✅ Warenkorb-HTML geladen");

    // Warten, bis cart.js wirklich im DOM aktiv ist
    const waitForCartJS = (maxTries = 30) => {
      if (typeof loadCart === "function" && typeof updateCart === "function") {
        try {
          loadCart();
          console.log("✅ Warenkorb-Skripte aktiv");
        } catch (err) {
          console.warn("⚠️ loadCart() konnte nicht ausgeführt werden:", err);
        }
      } else if (maxTries > 0) {
        setTimeout(() => waitForCartJS(maxTries - 1), 200);
      } else {
        console.error("❌ cart.js wurde nicht gefunden oder noch nicht geladen");
      }
    };

    waitForCartJS();

  } catch (err) {
    console.error("❌ Fehler beim Laden des Warenkorbs:", err);
  }
});
