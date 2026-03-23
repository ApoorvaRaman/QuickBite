// ======================= CART INITIALIZATION =======================
let cart;

try {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
} catch {
  cart = [];
}

// ======================= SAVE FUNCTION =======================
function save() {
  cart = cart.filter(item => item && item.name);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// ======================= ADD TO CART =======================
function addToCart(name, price) {
  let item = cart.find(i => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({
      name: name,
      price: Number(price) || 0,
      qty: 1
    });
  }

  save();
}

// ======================= CHANGE QUANTITY =======================
function changeQty(name, delta) {
  let item = cart.find(i => i.name === name);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.name !== name);
  }

  save();
}

// ======================= REMOVE ITEM =======================
function removeItem(name) {
  cart = cart.filter(i => i.name !== name);
  save();
}

// ======================= TOTAL CALCULATION =======================
function total() {
  let sum = 0;

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    sum += price * qty;
  });

  return sum;
}

// ======================= RENDER CART =======================
function renderCart() {
  const box = document.getElementById('cart-items');
  if (!box) return;

  box.innerHTML = '';

  let totalAmount = 0;

  if (cart.length === 0) {
    box.innerHTML = "<p>Your cart is empty</p>";
  }

  cart.forEach(item => {
    if (!item || !item.name) return;

    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    const itemTotal = price * qty;

    totalAmount += itemTotal;

    box.innerHTML += `
      <div class="row">
        <div>
          <b>${item.name}</b><br>
          ₹${price} x ${qty}
        </div>

        <div class="qty">
          <button onclick="changeQty('${item.name}', -1)">-</button>
          <span>${qty}</span>
          <button onclick="changeQty('${item.name}', 1)">+</button>
        </div>

        <span class="remove" onclick="removeItem('${item.name}')">🗑</span>
      </div>
      <hr>
    `;
  });

  const t = document.getElementById('total');
  if (t) t.innerText = totalAmount;
}

// ======================= NAVIGATION =======================
function goToPayment() {
  if (!cart.length) {
    alert("Cart is empty");
    return;
  }
  window.location.href = 'payment.html';
}

// ======================= PAYMENT PAGE LOAD =======================
function loadPayment() {
  renderCart();

  const grand = document.getElementById('grand');
  if (grand) {
    grand.innerText = total();
  }

  renderInvoice();
}

// ======================= INVOICE =======================
function renderInvoice() {
  const inv = document.getElementById('invoice');
  if (!inv) return;

  const orderId = 'QB' + Date.now().toString().slice(-6);

  let html = `
    <div class='invoice'>
      <h3>Invoice</h3>
      <p>Order ID: <b>${orderId}</b></p>
      <p>Date: ${new Date().toLocaleString()}</p>
      <hr>
  `;

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;

    html += `<p>${item.name} x ${qty} — ₹${price * qty}</p>`;
  });

  html += `
      <hr>
      <p class='total'>Total: ₹${total()}</p>
    </div>
  `;

  inv.innerHTML = html;
}

// ======================= DELIVERY TIMER =======================
function startTimer() {
  let secs = 900; // 15 minutes
  const el = document.getElementById('timer');

  if (!el) return;

  const interval = setInterval(() => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;

    el.innerText = `ETA: ${m}:${s.toString().padStart(2, '0')}`;

    secs--;

    if (secs < 0) {
      clearInterval(interval);
      el.innerText = "Delivered";
      setStep(4);
    }
  }, 1000);
}

// ======================= TRACKING STATUS =======================
function setStep(n) {
  const steps = document.querySelectorAll('.status-step');

  steps.forEach((step, index) => {
    step.classList.toggle('active', index < n);
  });
}

// ======================= SEARCH =======================
function filterRestaurants() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const query = input.value.toLowerCase();

  document.querySelectorAll('.res-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(query) ? 'block' : 'none';
  });
}
