// script.js
const PRODUCTS_FILE = 'products.json';
let PRODUCTS = [];

// load products
async function loadProducts(){
  const res = await fetch(PRODUCTS_FILE);
  PRODUCTS = await res.json();
  renderFeatured();
  renderProducts();
  updateCartCount();
}

function renderFeatured(){
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0,4).map(p=>productCard(p)).join('');
  attachAddButtons();
}

function renderProducts(){
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p=>productCard(p)).join('');
  attachAddButtons();
}

function productCard(p){
  return `<div class="product">
    <a href="product.html?id=${p.id}">
      <img src="${p.img}" alt="${escapeHtml(p.title)}" />
    </a>
    <h3>${escapeHtml(p.title)}</h3>
    <p>$${p.price.toFixed(2)}</p>
    <a class="btn" data-add="${p.id}">Add to cart</a>
  </div>`;
}

function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// attach add-to-cart event listeners
function attachAddButtons(){
  document.querySelectorAll('[data-add]').forEach(btn=>{
    btn.onclick = ()=> {
      const id = btn.getAttribute('data-add');
      addToCart(id,1);
      updateCartCount();
      alert('Added to cart');
    };
  });
}

// CART: stored in localStorage as {id: qty}
function getCart(){
  const raw = localStorage.getItem('acs_cart') || '{}';
  return JSON.parse(raw);
}
function setCart(c){ localStorage.setItem('acs_cart', JSON.stringify(c)); }
function addToCart(id, qty=1){
  const c = getCart();
  c[id] = (c[id]||0) + qty;
  setCart(c);
  updateCartCount();
}
function removeFromCart(id){
  const c = getCart();
  delete c[id];
  setCart(c);
  updateCartCount();
}
function updateCartCount(){
  const c = getCart();
  const count = Object.values(c).reduce((s,n)=>s+n,0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

// render product detail page
window.renderProductDetail = function(id, container){
  const p = PRODUCTS.find(x=>x.id===id);
  if (!p) { container.innerHTML = '<p>Product not found</p>'; return;}
  container.innerHTML = `
    <div class="product-detail">
      <img src="${p.img}" alt="${escapeHtml(p.title)}" style="max-width:360px;border-radius:8px" />
      <div class="pd-info">
        <h2>${escapeHtml(p.title)}</h2>
        <p>${escapeHtml(p.desc)}</p>
        <p><strong>$${p.price.toFixed(2)}</strong></p>
        <div>
          <a class="btn" id="add-product">Add to Cart</a>
        </div>
      </div>
    </div>
  `;
  document.getElementById('add-product').onclick = ()=>{
    addToCart(p.id,1);
    alert('Added to cart');
  };
};

// render cart page
window.renderCart = function(container){
  const c = getCart();
  if (Object.keys(c).length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  let html = '<table class="cart-table"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>';
  let total = 0;
  for (const id of Object.keys(c)){
    const qty = c[id];
    const p = PRODUCTS.find(x=>x.id===id);
    if (!p) continue;
    const line = qty * p.price;
    total += line;
    html += `<tr>
      <td>${escapeHtml(p.title)}</td>
      <td>${qty}</td>
      <td>$${line.toFixed(2)}</td>
      <td><a data-remove="${id}">Remove</a></td>
    </tr>`;
  }
  html += `</tbody></table><div class="cart-total"><strong>Total: $${total.toFixed(2)}</strong></div>
    <div style="margin-top:12px"><a href="#" id="checkout" class="btn">Checkout</a></div>`;
  container.innerHTML = html;

  document.querySelectorAll('[data-remove]').forEach(a=>{
    a.onclick = ()=>{
      const id = a.getAttribute('data-remove');
      removeFromCart(id);
      window.renderCart(container);
    };
  });

  document.getElementById('checkout').onclick = (e)=>{
    e.preventDefault();
    alert('Checkout not implemented in demo. Use a payment gateway in production.');
  };
};

// Simple slider auto-advance
function startSlider(){
  const slider = document.getElementById('slider');
  if (!slider) return;
  let idx = 0;
  const slides = slider.children;
  setInterval(()=>{
    idx = (idx+1) % slides.length;
    slider.style.transform = `translateX(-${idx*100}%)`;
  },4000);
}

// search box
document.addEventListener('input', e=>{
  if (e.target && e.target.id==='search'){
    const q = e.target.value.toLowerCase();
    const grid = document.getElementById('product-grid') || document.getElementById('featured-grid');
    if (!grid) return;
    const list = PRODUCTS.filter(p=> p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    grid.innerHTML = list.map(productCard).join('');
    attachAddButtons();
  }
});

window.addEventListener('DOMContentLoaded', async ()=>{
  await loadProducts();
  startSlider();
});
