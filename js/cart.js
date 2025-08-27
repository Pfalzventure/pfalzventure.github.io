function initShopScripts() {
  let cart = [];

  // ============================
  // Kurstermine laden
  // ============================
  fetch("assets/kurstermine.json")
    .then(res => res.json())
    .then(data => {
      let select = document.getElementById("kursTermine");
      if (select && data.termine) {
        data.termine.forEach(t => {
          let opt = document.createElement("option");
          opt.value = t.id;
          opt.textContent = t.text;
          select.appendChild(opt);
        });
      }
    })
    .catch(() => {
      let select = document.getElementById("kursTermine");
      if (select) {
        let opt = document.createElement("option");
        opt.textContent = "Keine Termine verfügbar";
        select.appendChild(opt);
      }
    });

  // ============================
  // Produkt hinzufügen
  // ============================
  window.addToCart = function(name, price) {
    let existing = cart.find(item => item.name === name && item.price === price);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart();
  };

  // ============================
  // Kurs-Gutschein
  // ============================
  window.addCourseVoucher = function() {
    let select = document.getElementById("kursTermine");
    if (!select) return;

    let selected = Array.from(select.selectedOptions).map(opt => opt.textContent);

    if (selected.length === 0) {
      alert("Bitte wähle einen Termin aus!");
      return;
    }

    // Nur neuen Kurs hinzufügen, wenn er nicht identisch vorhanden ist
    cart.push({
      name: "Kurs-Gutschein",
      price: 1.00,
      qty: 1,
      termine: selected
    });
    saveCart();
  };

  // ============================
  // Wert-Gutschein
  // ============================
  window.addVoucher = function() {
    let amountInput = document.getElementById("voucherAmount");
    if (!amountInput) return;

    let amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount < 10) amount = 10;

    cart.push({ name: "Wert-Gutschein", price: amount, qty: 1 });
    saveCart();
  };

  // ============================
  // Menge ändern
  // ============================
  function increaseQty(i) { cart[i].qty++; saveCart(); }
  function decreaseQty(i) {
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
    saveCart();
  }

  // ============================
  // Gesamt
  // ============================
  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  // ============================
  // Cart speichern/laden
  // ============================
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
  }
  function loadCart() {
    let stored = localStorage.getItem("cart");
    if (stored) cart = JSON.parse(stored);
    updateCart();
  }

  // ============================
  // Cart anzeigen
  // ============================
  function updateCart() {
    // Anzahl im Header
    let countEl = document.getElementById("cart-count");
    if (countEl) {
      countEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
    }

    // Warenkorb-Items
    let itemsList = document.getElementById("cart-items");
    if (!itemsList) return;
    itemsList.innerHTML = "";

    cart.forEach((item, i) => {
      let li = document.createElement("li");
      li.classList.add("cart-item");

      let span = document.createElement("span");
      span.innerText = `${item.name} – ${item.price.toFixed(2)} €`;
      if (item.termine) {
        span.innerText += `\n(Termine: ${item.termine.join(", ")})`;
      }

      let controls = document.createElement("div");
      controls.classList.add("cart-controls");

      let minusBtn = document.createElement("button");
      minusBtn.innerText = "➖";
      minusBtn.onclick = () => decreaseQty(i);

      let qtySpan = document.createElement("span");
      qtySpan.innerText = item.qty;
      qtySpan.classList.add("cart-qty");

      let plusBtn = document.createElement("button");
      plusBtn.innerText = "➕";
      plusBtn.onclick = () => increaseQty(i);

      controls.appendChild(minusBtn);
      controls.appendChild(qtySpan);
      controls.appendChild(plusBtn);

      li.appendChild(span);
      li.appendChild(controls);
      itemsList.appendChild(li);
    });

    // Gesamtbetrag
    let totalEl = document.getElementById("cart-total");
    if (totalEl) {
      totalEl.innerText = getCartTotal().toFixed(2);
    }

    // PayPal Buttons nur aktivieren, wenn es Produkte gibt
    let paypalContainer = document.getElementById("paypal-button-container");
    if (paypalContainer) {
      paypalContainer.innerHTML = "";
      if (cart.length > 0) {
        paypal.Buttons({
          createOrder: function(data, actions) {
            return actions.order.create({
              purchase_units: [{
                description: cart.map(item => {
                  let desc = `${item.name} x${item.qty}`;
                  if (item.termine) desc += ` [${item.termine.join(", ")}]`;
                  return desc;
                }).join("; "),
                amount: {
                  currency_code: "EUR",
                  value: getCartTotal().toFixed(2)
                }
              }]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              alert("Vielen Dank, " + details.payer.name.given_name +
                "! Deine Bestellung wurde erfolgreich abgeschlossen.");
              cart = [];
              saveCart();
              toggleCart();
            });
          }
        }).render('#paypal-button-container');
      }
    }
  }

  // ============================
  // Cart anzeigen/verbergen
  // ============================
  window.toggleCart = function() {
    let cartDiv = document.getElementById("cart");
    if (!cartDiv) return;
    cartDiv.style.display = (cartDiv.style.display === "block") ? "none" : "block";
  };

  // ============================
  // Start
  // ============================
  loadCart();
}
