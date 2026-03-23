let cart = [];

function addToCart(item, price) {
  cart.push({item, price});
  displayCart();
}

function displayCart() {
  const cartDiv = document.getElementById('cart-items');
  if (!cartDiv) return;

  cartDiv.innerHTML = '';
  let total = 0;

  cart.forEach((c, index) => {
    total += c.price;
    cartDiv.innerHTML += `<p>${c.item} - ₹${c.price}</p>`;
  });

  document.getElementById('total').innerText = total;
}

function goToPayment() {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'payment.html';
}

function loadPayment() {
  let cartData = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  const summary = document.getElementById('summary');

  cartData.forEach(item => {
    total += item.price;
    summary.innerHTML += `<p>${item.item} - ₹${item.price}</p>`;
  });

  document.getElementById('total').innerText = total;
}
