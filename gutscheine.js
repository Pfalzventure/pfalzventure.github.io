<!-- ============================
     Warenkorb Popup
     ============================ -->
<div id="cart" style="display:none; position:fixed; top:80px; right:20px; background:white; border:1px solid #ccc; padding:20px; max-width:340px; box-shadow:0 2px 10px rgba(0,0,0,0.2); z-index:1000;">
  <h3>🛒 Dein Warenkorb</h3>
  <ul id="cart-items" class="cart-list"></ul>
  <p><strong>Gesamt: <span id="cart-total">0.00</span> €</strong></p>

  <!-- 🎟️ Gutschein-Eingabe -->
  <div class="cart-discount">
    <label for="voucherCode">🎟️ Gutschein einlösen:</label>
    <input type="text" id="voucherCode" placeholder="Code eingeben" />
    <button onclick="applyVoucher()">Einlösen</button>
    <p id="voucherMessage"></p>
  </div>

  <!-- 📧 Formular für Gutscheinbenachrichtigung -->
  <form id="voucherForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" style="display:none;">
    <input type="hidden" name="Gutscheincode" id="formVoucherCode">
    <input type="hidden" name="Warenkorb" id="formCart">
    <input type="email" name="Email" id="formEmail" placeholder="Deine E-Mail-Adresse" required>
    <button type="submit">Senden</button>
  </form>

  <!-- PayPal -->
  <div id="paypal-button-container"></div>

  <button onclick="toggleCart()" class="btn">Schließen</button>
</div>

<!-- ============================
     Footer
     ============================ -->
<footer>
  <p>© 2025 Pfalzventure – Robert Prokasky</p>
  <p><a href="impressum.html">Impressum</a> | <a href="datenschutz.html">Datenschutz</a></p>
</footer>

<!-- ============================
     SCRIPTS
     ============================ -->

<!-- ZUERST die Gutscheine laden -->
<script src="gutscheine.js"></script>

<script>
let cart = [];
let eingelösterGutschein = null;

// ==========================
// Warenkorb Grundfunktionen
// ==========================

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function loadCart() {
  let stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
  updateCart();
}

function getCartTotal() {
  let sum = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  if (eingelösterGutschein) {
    sum -= eingelösterGutschein.wert;
    if (sum < 0) sum = 0;
  }
  return sum;
}

function updateCart() {
  document.getElementById("cart-count")?.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
  const list = document.getElementById("cart-items");
  list.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} – ${item.price.toFixed(2)} € x ${item.qty}`;
    list.appendChild(li);
  });

  document.getElementById("cart-total").innerText = getCartTotal().toFixed(2);
}

function toggleCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.style.display = (cartDiv.style.display === "none") ? "block" : "none";
}

// ==========================
// Gutschein-Logik
// ==========================

function applyVoucher() {
  const code = document.getElementById("voucherCode").value.trim().toUpperCase();
  const msg = document.getElementById("voucherMessage");
  const found = gutscheine.find(g => g.code === code);

  if (!found) {
    msg.innerText = "❌ Gutschein ungültig oder abgelaufen.";
    eingelösterGutschein = null;
    updateCart();
    return;
  }

  eingelösterGutschein = found;
  msg.innerText = `✅ Gutschein "${code}" eingelöst: ${found.wert.toFixed(2)} € Rabatt.`;

  // Formular einblenden, damit Kunde E-Mail eintragen kann
  document.getElementById("voucherForm").style.display = "block";
  document.getElementById("formVoucherCode").value = code;
  document.getElementById("formCart").value = getCartSummary();

  updateCart();
}

// Warenkorb-Inhalt als Text (für Formspree-Mail)
function getCartSummary() {
  return cart.map(item => `${item.name} (${item.qty}x ${item.price.toFixed(2)}€)`).join("; ");
}

// ==========================
// PayPal Integration
// ==========================

if (window.paypal) {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: cart.map(item => `${item.name} x${item.qty}`).join("; "),
          amount: { currency_code: "EUR", value: getCartTotal().toFixed(2) }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert("Danke " + details.payer.name.given_name + "!");
        cart = [];
        saveCart();
        toggleCart();
      });
    }
  }).render('#paypal-button-container');
}

// ==========================
// Initialisierung
// ==========================
loadCart();
</script>
