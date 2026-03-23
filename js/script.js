let cart = JSON.parse(localStorage.getItem('cart')||'[]');

function save(){localStorage.setItem('cart',JSON.stringify(cart));renderCart();}

function addToCart(name,price){
  let it=cart.find(i=>i.name===name);
  if(it) it.qty++; else cart.push({name,price,qty:1});
  save();
}

function changeQty(name,delta){
  let it=cart.find(i=>i.name===name); if(!it) return;
  it.qty+=delta; if(it.qty<=0) cart=cart.filter(i=>i.name!==name);
  save();
}

function removeItem(name){cart=cart.filter(i=>i.name!==name);save();}

function total(){return cart.reduce((s,i)=>s+i.price*i.qty,0)}

function renderCart(){
  const box=document.getElementById('cart-items'); if(!box) return;
  box.innerHTML='';
  cart.forEach(i=>{
    box.innerHTML+=`<div class="row"><div><b>${i.name}</b><br>₹${i.price} x ${i.qty}</div>
      <div class="qty">
        <button onclick="changeQty('${i.name}',-1)">-</button>
        <span>${i.qty}</span>
        <button onclick="changeQty('${i.name}',1)">+</button>
      </div>
      <span class="remove" onclick="removeItem('${i.name}')">🗑</span></div><hr>`;
  });
  const t=document.getElementById('total'); if(t) t.innerText=total();
}

function goToPayment(){ if(!cart.length) return alert('Cart is empty'); location.href='payment.html'; }

function loadPayment(){ renderCart(); document.getElementById('grand').innerText=total(); renderInvoice(); }

function renderInvoice(){
  const inv=document.getElementById('invoice'); if(!inv) return;
  const id='QB'+Date.now().toString().slice(-6);
  let html=`<div class='invoice'><h3>Invoice</h3><p>Order ID: <b>${id}</b></p><p>Date: ${new Date().toLocaleString()}</p><hr>`;
  cart.forEach(i=> html+=`<p>${i.name} x ${i.qty} — ₹${i.price*i.qty}</p>`);
  html+=`<hr><p class='total'>Total: ₹${total()}</p></div>`;
  inv.innerHTML=html;
}
function startTimer(){
  let secs=900; // 15 min
  const el=document.getElementById('timer');
  const int=setInterval(()=>{
    const m=Math.floor(secs/60), s=secs%60;
    el.innerText=`ETA: ${m}:${s.toString().padStart(2,'0')}`;
    secs--; if(secs<0){clearInterval(int); el.innerText='Delivered'; setStep(4);} 
  },1000);
}

function setStep(n){
  document.querySelectorAll('.status-step').forEach((e,i)=> e.classList.toggle('active', i<n));
}

// Homepage search filter
function filterRestaurants(){
  const q=document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('.res-card').forEach(c=>{
    const name=c.dataset.name.toLowerCase();
    c.style.display = name.includes(q) ? 'block' : 'none';
  });
}

