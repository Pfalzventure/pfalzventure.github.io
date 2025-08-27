/* =====================================================
   Globale Warenkorb-Logik für ALLE Seiten
   ===================================================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🟢 Warenkorb speichern
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// 🟢 Produkt zum Warenkorb hinzufügen
function addToCart(productId, title, price, qty = 1, extraInfo = "") {
  const existing = cart.find(item => item.id === productId && item.extraInfo === extraInfo);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, title, price, qty, extraInfo });
  }
  saveCart();
}

// 🟢 Produktmenge ändern
function updateCartItem(productId, extraInfo, change) {
  const item = cart.find(i => i.id === productId && i.extraInfo === extraInfo);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(i => !(i.id === productId && i.extraInfo === extraInfo));
    }
    saveCart();
  }
}

// 🟢 Gesamtsumme berechnen
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
}

// 🟢 Warenkorb-UI aktualisieren
function updateCartUI() {
  const cartList = document.querySelector(".cart-list");
  const cartTotal = document.querySelector(".cart-total");

  if (!cartList) return; // Falls UI auf einer Seite nicht existiert

  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("cart-item");

    // Text links
    const text = document.createElement("span");
    text.textContent = item.title + (item.extraInfo ? " (" + item.extraInfo + ")" : "");

    // Steuerung rechts
    const controls = document.createElement("div");
    controls.classList.add("cart-controls");

    const btnMinus = document.createElement("button");
    btnMinus.textContent = "−";
    btnMinus.onclick = () => updateCartItem(item.id, item.extraInfo, -1);

    const qty = document.createElement("span");
    qty.classList.add("cart-qty");
    qty.textContent = item.qty;

    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.onclick = () => updateCartItem(item.id, item.extraInfo, 1);

    const price = document.createElement("span");
    price.classList.add("cart-price");
    price.textContent = (item.price * item.qty).toFixed(2) + " €";

    controls.appendChild(btnMinus);
    controls.appendChild(qty);
    controls.appendChild(btnPlus);
    controls.appendChild(price);

    li.appendChild(text);
    li.appendChild(controls);

    cartList.appendChild(li);
  });

  if (cartTotal) {
    cartTotal.textContent = "Gesamt: " + getCartTotal() + " €";
  }
}

// 🟢 Warenkorb öffnen/schließen
function toggleCart() {
  document.querySelector(".cart-dropdown").classList.toggle("active");
}

// =====================================================
// Initialisierung (aufgerufen NACH Laden des Headers)
// =====================================================
function initShopScripts() {
  // Warenkorb-Button aktivieren
  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.onclick = toggleCart;
  }

  // Warenkorb UI initial laden
  updateCartUI();

  // PayPal Buttons (falls vorhanden)
  if (document.getElementById("paypal-button-container")) {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: getCartTotal()
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert("Danke, " + details.payer.name.given_name + "! Deine Bestellung war erfolgreich.");
          cart = [];
          saveCart();
        });
      }
    }).render("#paypal-button-container");
  }
}

