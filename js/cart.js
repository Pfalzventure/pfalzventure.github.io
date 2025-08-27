// ===========================
// Warenkorb zentral mit localStorage
// ===========================

// Warenkorb laden oder neu erstellen
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Warenkorb speichern
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Artikel hinzufügen
function addToCart(product, price) {
  let item = cart.find(i => i.product === product);
  if (item) {
    item.qty++;
  } else {
    cart.push({ product, price, qty: 1 });
  }
  saveCart();
  renderCart();
}

// Artikelanzahl ändern
function updateQty(product, delta) {
  let item = cart.find(i => i.product === product);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.product !== product);
  }
  saveCart();
  renderCart();
}

// Gesamtsumme berechnen
function getTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);
}

// Warenkorb öffnen/schließen
function toggleCart() {
  const container = document.getElementById("cart-container");
  if (container) {
    container.classList.toggle("active");
  }
}

// Warenkorb im HTML anzeigen
function renderCart() {
  const container = document.getElementById("cart-container");
  const countSpan = document.getElementById("cart-count");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p>🛒 Warenkorb ist leer</p>`;
    if (countSpan) countSpan.textContent = "0";
    return;
  }

  let html = `
    <h3>Warenkorb</h3>
    <ul>
      ${cart.map(item => `
        <li>
          <span>${item.product} - ${item.price} €</span>
          <div class="quantity-controls">
            <button onclick="updateQty('${item.product}', -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateQty('${item.product}', 1)">+</button>
          </div>
        </li>
      `).join("")}
    </ul>
    <p><b>Gesamt: ${getTotal()} €</b></p>
    <button class="checkout-btn">Jetzt kaufen</button>
  `;
  container.innerHTML = html;

  // 🛒 Zähler im Header aktualisieren
  if (countSpan) {
    let totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    countSpan.textContent = totalQty;
  }
}

// Beim Laden einmal rendern
document.addEventListener("DOMContentLoaded", renderCart);
