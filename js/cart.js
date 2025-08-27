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

// Warenkorb im HTML anzeigen
function renderCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<p>🛒 Warenkorb ist leer</p>`;
    return;
  }

  let html = `
    <div id="cart">
      <h2>Warenkorb</h2>
      <ul>
        ${cart.map(item => `
          <li>
            ${item.product} - ${item.price} € 
            <button onclick="updateQty('${item.product}', -1)">-</button>
            ${item.qty}
            <button onclick="updateQty('${item.product}', 1)">+</button>
          </li>
        `).join("")}
      </ul>
      <p><b>Gesamt: ${getTotal()} €</b></p>
      <button class="btn">Jetzt kaufen</button>
    </div>
  `;
  container.innerHTML = html;
}

// Initial rendern beim Laden
document.addEventListener("DOMContentLoaded", renderCart);
