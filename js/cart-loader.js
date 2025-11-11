// ============================
// cart-loader.js
// ============================
// Lädt das zentrale Warenkorb-HTML (partials/cart.html)
// und sorgt dafür, dass cart.js erst nach dem Einfügen aktiv ist.

(async function loadCartHTML() {
  const CART_PARTIAL_PATH = "partials/cart.html"; // falls nötig, Pfad anpassen!
  const TARGET_ID = "cart-container"; // Ziel-DIV, in das der Warenkorb eingefügt wird

  // Prüfe, ob das Ziel-Element existiert (zur Sicherheit)
  let target = document.getElementById(TARGET_ID);
  if (!target) {
    // Wenn nicht vorhanden, wird es dynamisch am Body-Ende eingefügt
    target = document.createElement("div");
    target.id = TARGET_ID;
    document.body.appendChild(target);
  }

  try {
    // Lade das Warenkorb-HTML asynchron
    const response = await fetch(CART_PARTIAL_PATH);
    if (!response.ok) throw new Error(`Fehler beim Laden von ${CART_PARTIAL_PATH}: ${response.status}`);
    const html = await response.text();

    // Füge den HTML-Inhalt in die Seite ein
    target.innerHTML = html;

    console.log("✅ Warenkorb-HTML erfolgreich geladen.");

    // Falls cart.js noch nicht geladen wurde → nachladen
    if (!window.addToCart || !window.updateCart) {
      const script = document.createElement("script");
      script.src = "partials/cart.js"; // Pfad ggf. anpassen
      script.onload = () => {
        console.log("✅ cart.js wurde nachgeladen.");
        if (typeof loadCart === "function") loadCart(); // initiales Laden
      };
      document.body.appendChild(script);
    } else {
      // cart.js ist bereits da → einfach initialisieren
      if (typeof loadCart === "function") loadCart();
    }

  } catch (err) {
    console.error("❌ Fehler beim Laden des Warenkorb-HTML:", err);
    target.innerHTML = `<p style="color:red;text-align:center;">⚠️ Warenkorb konnte nicht geladen werden.</p>`;
  }
})();
