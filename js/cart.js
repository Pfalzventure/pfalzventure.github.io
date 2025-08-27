function initShopScripts() {
  let cart = [];

  // ---- Kurstermine laden ----
  fetch("assets/kurstermine.json")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("kursTermine");
      if (select && data && Array.isArray(data.termine)) {
        // clear fallback entries
        select.innerHTML = "";
        data.termine.forEach(t => {
          const opt = document.createElement("option");
          opt.value = t.id ?? t.text;
          opt.textContent = t.text ?? t.id;
          select.appendChild(opt);
        });
      }
    })
    .catch(() => {
      const select = document.getElementById("kursTermine");
      if (select) {
        select.innerHTML = "";
        const opt = document.createElement("option");
        opt.textContent = "Keine Termine verfügbar";
        select.appendChild(opt);
      }
    });

  // ---- Globale API (für Buttons) ----
  window.addToCart = function(name, price) {
    const existing = cart.find(i => i.name === name && i.price === price && !i.termine);
    if (existing) existing.qty += 1;
    else cart.push({ name, price, qty: 1 });
    saveCart();
  };

  window.addCourseVoucher = function() {
    const select = document.getElementById("kursTermine");
    if (!select) return alert("Termin-Auswahl nicht gefunden.");
    const selected = Array.from(select.selectedOptions).map(o => o.textContent);
    if (selected.length === 0) return alert("Bitte wähle einen Termin aus!");
    cart.push({ name: "Kurs-Gutschein", price: 1.00, qty: 1, termine: selected });
    saveCart();
  };

  window.addVoucher = function() {
    const amountInput = document.getElementById("voucherAmount");
    if (!amountInput) return alert("Voucher-Feld nicht gefunden.");
    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount < 10) amount = 10;
    cart.push({ name: "Wert-Gutschein", price: amount, qty: 1 });
    saveCart();
  };

  // ---- Mengen-Änderung ----
  function increaseQty(i) { cart[i].qty++; saveCart(); }
  function decreaseQty(i) {
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart();
  }

  function getCartTotal() {
    return cart.reduce((s, it) => s + it.price * it.qty, 0);
  }

  // ---- persistenz ----
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }
  function loadCart() {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try { cart = JSON.parse(stored) || []; } catch { cart = []; }
    }
    updateCart();
  }

  // ---- Darstellung aktualisieren ----
  function updateCart() {
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.innerText = cart.reduce((s, i) => s + i.qty, 0);

    const itemsList = document.getElementById("cart-items");
    if (!itemsList) return;
    itemsList.innerHTML = "";

    cart.forEach((item, i) => {
      const li = document.createElement("li");
      li.classList.add("cart-item");

      const span = document.createElement("span");
      span.innerText = `${item.name} – ${item.price.toFixed(2)} €`;
      if (item.termine) span.innerText += `\n(Termine: ${item.termine.join(", ")})`;

      const controls = document.createElement("div");
      controls.classList.add("cart-controls");

      const minus = document.createElement("button");
      minus.innerText = "➖";
      minus.onclick = () => decreaseQty(i);

      const qty = document.createElement("span");
      qty.classList.add("cart-qty");
      qty.innerText = item.qty;

      const plus = document.createElement("button");
      plus.innerText = "➕";
      plus.onclick = () => increaseQty(i);

      controls.appendChild(minus);
      controls.appendChild(qty);
      controls.appendChild(plus);

      li.appendChild(span);
      li.appendChild(controls);
      itemsList.appendChild(li);
    });

    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.innerText = getCartTotal().toFixed(2);

    // PayPal rendern nur wenn Items vorhanden
    const paypalContainer = document.getElementById("paypal-button-container");
    if (paypalContainer) {
      paypalContainer.innerHTML = ""; // vorherige Buttons entfernen
      if (cart.length > 0 && typeof paypal !== "undefined") {
        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                description: cart.map(it => {
                  let desc = `${it.name} x${it.qty}`;
                  if (it.termine) desc += ` [${it.termine.join(", ")}]`;
                  return desc;
                }).join("; "),
                amount: { currency_code: "EUR", value: getCartTotal().toFixed(2) }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              alert("Vielen Dank, " + (details.payer?.name?.given_name || "") + "! Deine Bestellung wurde abgeschlossen.");
              cart = [];
              saveCart();
              toggleCart();
            });
          }
        }).render('#paypal-button-container');
      }
    }
  }

  // ---- toggle ----
  window.toggleCart = function() {
    const cartDiv = document.getElementById("cart");
    if (!cartDiv) return;
    cartDiv.style.display = (cartDiv.style.display === "block") ? "none" : "block";
  };

  // ---- Start ----
  loadCart();
}
