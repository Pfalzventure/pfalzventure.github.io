// partials/cart.js
// zentral: alle Funktionen, Eventlistener und PayPal-Init

// CART State
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Speicher / Laden
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  initPayPal();
}

function loadCart() {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");
  updateCart();
  initPayPal();
}

// Add / Qty
function addToCart(name, price, qty = 1) {
  const existing = cart.find(i => i.name === name && i.price === price);
  if (existing) existing.qty += qty;
  else cart.push({ name, price, qty });
  saveCart();
  triggerCartBounce();
}

function increaseQty(i) {
  cart[i].qty++;
  saveCart();
}
function decreaseQty(i) {
  if (--cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
}

// Anzeige
function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function updateCart() {
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = cart.reduce((s, i) => s + i.qty, 0);

  const list = document.getElementById("cart-items");
  if (!list) return;
  list.innerHTML = "";

  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-controls">
        <button onclick="decreaseQty(${i})">➖</button>
        <span class="cart-qty">${item.qty}</span>
        <button onclick="increaseQty(${i})">➕</button>
      </div>
      <div class="cart-price">${item.price.toFixed(2)} €</div>
    `;
    list.appendChild(li);
  });

  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.innerText = getCartTotal().toFixed(2);
}

// PayPal
function initPayPal() {
  if (typeof paypal === "undefined") return;
  const cont = document.getElementById("paypal-button-container");
  if (!cont) return;
  cont.innerHTML = "";
  if (cart.length === 0) return;

  paypal.Buttons({
    createOrder: (d, a) => a.order.create({
      purchase_units: [{
        description: cart.map(i => `${i.name} x${i.qty}`).join("; "),
        amount: { currency_code: "EUR", value: getCartTotal().toFixed(2) }
      }]
    }),
    onApprove: (d, a) => a.order.capture().then(det => {
      alert("Danke, " + (det.payer?.name?.given_name || "") + "!");
      cart = [];
      saveCart();
      closeCart();
    }),
    onError: (err) => {
      console.error("PayPal Fehler:", err);
      alert("⚠️ Zahlung fehlgeschlagen. Bitte erneut versuchen.");
    }
  }).render('#paypal-button-container');
}

// Gutschein (Formspree)
async function submitVoucherRequest() {
  const code = document.getElementById("voucherCode")?.value.trim();
  const email = document.getElementById("customerEmail")?.value.trim();
  const msgEl = document.getElementById("voucherMessage");
  if (!msgEl) return;
  if (!code) { msgEl.style.color = "red"; msgEl.textContent = "Bitte Gutscheincode eingeben."; return; }
  if (!email || !email.includes("@")) { msgEl.style.color = "red"; msgEl.textContent = "Bitte gültige E-Mail-Adresse eingeben."; return; }

  msgEl.style.color = "green";
  msgEl.textContent = "✅ Dein Gutscheincode wird geprüft. Du erhältst in Kürze eine angepasste Rechnung per E-Mail.";

  setTimeout(() => {
    const vc = document.getElementById("voucherCode");
    const ce = document.getElementById("customerEmail");
    if (vc) vc.value = "";
    if (ce) ce.value = "";
  }, 1000);

  try {
    const response = await fetch("https://formspree.io/f/mldlyqdz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _subject: "🪙 Neuer Gutschein eingelöst",
        code,
        kunden_email: email,
        warenkorb_summe: getCartTotal().toFixed(2),
        warenkorb_inhalt: cart.map(i => `${i.name} x${i.qty}`).join("; ")
      })
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    console.log("✅ Gutschein-Mail gesendet.");
  } catch (err) {
    console.error("Fehler beim Senden an Formspree:", err);
    msgEl.style.color = "red";
    msgEl.textContent = "⚠️ Gutschein konnte nicht gesendet werden. Bitte später erneut versuchen.";
  }
  setTimeout(() => { msgEl.textContent = ""; }, 8000);
}

// Öffnen / Schließen / Bounce / Click-outside
function toggleCart() {
  const el = document.getElementById("cart");
  if (!el) return;
  el.classList.toggle("open");
}
function closeCart() {
  const el = document.getElementById("cart");
  if (el) el.classList.remove("open");
}

function triggerCartBounce() {
  const cartIcon = document.getElementById("cart-toggle");
  if (!cartIcon) return setTimeout(triggerCartBounce, 100);
  cartIcon.classList.add("bounce");
  setTimeout(() => cartIcon.classList.remove("bounce"), 600);
}

// einmalig: Click-outside (idempotent)
if (!window.__cart_outside_bound) {
  window.__cart_outside_bound = true;
  document.addEventListener("click", function (event) {
    const cart = document.getElementById("cart");
    const toggle = document.getElementById("cart-toggle");
    if (!cart || !toggle) return;
    if (!cart.contains(event.target) && !toggle.contains(event.target)) {
      closeCart();
    }
  });
}

// Button bindings (delegated because elements may be injected)
document.addEventListener("click", function (e) {
  const t = e.target;
  if (!t) return;
  if (t.id === "cart-close-btn") { closeCart(); }
  if (t.id === "voucherSubmitBtn") { submitVoucherRequest(); }
});
