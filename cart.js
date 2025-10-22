let cart = [];
let eingelösterGutschein = null;

function addTestItem() {
  cart.push({ name: "Survival Kurs", price: 100, qty: 1 });
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("voucher", JSON.stringify(eingelösterGutschein));
  updateCart();
}

function loadCart() {
  let stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
  let storedVoucher = localStorage.getItem("voucher");
  if (storedVoucher) eingelösterGutschein = JSON.parse(storedVoucher);
  updateCart();
}

function getCartTotal() {
  let sum = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (eingelösterGutschein) sum -= eingelösterGutschein.wert;
  if (sum < 0) sum = 0;
  return sum;
}

function updateCart() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return; // Seite hat evtl. noch keinen Warenkorb
  countEl.innerText = cart.reduce((sum, i) => sum + i.qty, 0);
  let list = document.getElementById("cart-items");
  list.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.innerText = `${item.name} – ${item.price.toFixed(2)} € x ${item.qty}`;
    list.appendChild(li);
  });
  document.getElementById("cart-total").innerText = getCartTotal().toFixed(2);
}

function toggleCart() {
  const cartDiv = document.getElementById("cart");
  cartDiv.style.display = (cartDiv.style.display === "none") ? "block" : "none";
}

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
      eingelösterGutschein = null;
      saveCart();
      toggleCart();
    });
  }
}).render('#paypal-button-container');

loadCart();
