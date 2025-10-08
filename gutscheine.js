async function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim();
  const message = document.getElementById("voucherMessage");
  const totalElement = document.getElementById("cart-total");
  let total = parseFloat(totalElement.innerText.replace(",", "."));
  if (isNaN(total)) total = 0;

  if (!code) {
    message.innerText = "❌ Bitte einen Code eingeben.";
    return;
  }

  message.innerText = "🔎 Gutschein wird geprüft…";
  console.log("Sende Payload an WebApp (ohne Content-Type):", { action: "redeem", value: total, text: code });

  try {
    const url = "https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec"; // deine exec-URL

    // WICHTIG: kein headers: { "Content-Type": "application/json" }
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ action: "redeem", value: total, text: code })
    });

    console.log("HTTP-Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Roh-Antwort:", text);

    // Versuch JSON zu parsen
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      message.innerText = "⚠️ Serverantwort nicht JSON — siehe Konsole.";
      return;
    }

    if (result.status === "ok") {
      totalElement.innerText = (typeof result.newTotal !== "undefined" ? Number(result.newTotal).toFixed(2) : 0).replace(".", ",");
      message.innerText = result.message || "✅ Gutschein angewendet!";
      if (result.newCode) message.innerText += ` Neuer Code: ${result.newCode}`;
    } else {
      message.innerText = result.message || "❌ Code ungültig oder verbraucht.";
    }
  } catch (err) {
    console.error("Fetch-Fehler:", err);
    message.innerText = "⚠️ Fehler bei der Verbindung zum Server.";
  }
}
