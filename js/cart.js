// cart.js
let cart = [];

// ============================
// Warenkorb: laden/speichern
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
// Warenkorb: Anzeige
// ============================
function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateCart() {
  let countElem = document.getElementById("cart-count");
  if (countElem) {
    countElem.innerText = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  let itemsList = document.getElementById("cart-items");
  if (itemsList) {
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
  }

  let totalElem = document.getElementById("cart-total");
  if (totalElem) {
    totalElem.innerText = getCartTotal().toFixed(2);
  }
}

// ============================
// Warenkorb: Menge ändern
// ============================
function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
}

function decreaseQty(index) {
  cart[index].qty -= 1;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
}

// ============================
// Warenkorb: Anzeige / Toggle
// ============================
function toggleCart() {
  let cartDiv = document.getElementById("cart");
  if (cartDiv) {
    cartDiv.style.display = (cartDiv.style.display === "none") ? "block" : "none";
  }
}

// ============================
// Produkte hinzufügen
// ============================
function addToCart(name, price) {
  let existing = cart.find(item => item.name === name && item.price === price);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart();
}

function addCourseVoucher(selectId) {
  let select = document.getElementById(selectId);
  let selected = Array.from(select.selectedOptions).map(opt => opt.textContent);

  if (selected.length === 0) {
    alert("Bitte wähle einen Termin aus!");
    return;
  }

  cart.push({
    name: "Kurs-Gutschein",
    price: 1.00,
    qty: 1,
    termine: selected
  });
  saveCart();
}

function addVoucher(inputId) {
  let amount = parseFloat(document.getElementById(inputId).value);
  if (amount < 10) amount = 10;
  cart.push({ name: "Wert-Gutschein", price: amount, qty: 1 });
  saveCart();
}

// ============================
// PayPal-Integration (nur wenn Container da ist)
// ============================
function initPayPal() {
  let paypalContainer = document.getElementById("paypal-button-container");
  if (paypalContainer) {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            description: cart.map(item => {
              let desc = `${item.name} x${item.qty}`;
              if (item.termine) {
                desc += ` [${item.termine.join(", ")}]`;
              }
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
          alert("Vielen Dank, " + details.payer.name.given_name + "! Deine Bestellung war erfolgreich.");
          cart = [];
          saveCart();
          toggleCart();
        });
      }
    }).render('#paypal-button-container');
  }
}

// ============================
// Initial laden
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  initPayPal();
});
