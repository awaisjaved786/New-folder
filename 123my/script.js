/* ---------- Slider logic ---------- */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideIndex = 0;

function showSlide(i){
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  dots[i].classList.add('active');
}
function nextSlide(){ slideIndex = (slideIndex + 1) % slides.length; showSlide(slideIndex); }
let slideTimer = setInterval(nextSlide, 5500);
dots.forEach(d => d.addEventListener('click', e => {
  clearInterval(slideTimer);
  slideIndex = Number(e.target.dataset.index);
  showSlide(slideIndex);
  slideTimer = setInterval(nextSlide, 5500);
}));

/* ---------- Sample product data (you can expand) ---------- */
const allProducts = {
  best: [
    { id:'ba56', name:"BA 56 KING'S EDITION", price:65000, img:'images/ba56.jpg' },
    { id:'pro15000', name:"Pro 15000", price:15000, img:'images/pro15000.jpg' },
    { id:'bigbang', name:"Big Bang Pro", price:39999, img:'images/bigbang.jpg' },
    { id:'plus12000', name:"Plus 12000", price:12000, img:'images/plus12000.jpg' }
  ],
  bats: [
    { id:'pro15000', name:"Pro 15000", price:15000, img:'images/pro15000.jpg' },
    { id:'plus12000', name:"Plus 12000", price:12000, img:'images/plus12000.jpg' },
    { id:'dragon', name:"CA Dragon", price:39000, img:'images/dragon.jpg' },
    { id:'ba56', name:"BA 56 KING'S EDITION", price:65000, img:'images/ba56.jpg' }
  ],
  balls: [
    { id:'redball', name:"Test Red Ball", price:1599, img:'images/redball.jpg' },
    { id:'whiteball', name:"White Match Ball", price:1299, img:'images/whiteball.jpg' }
  ],
  gloves: [
    { id:'glove1', name:"ACS Players Gloves", price:5499, img:'images/glove1.jpg' },
    { id:'glove2', name:"ACS Pro Gloves", price:4999, img:'images/glove2.jpg' }
  ],
  kits: [
    { id:'kit1', name:"ACS Complete Kit", price:39999, img:'images/kit1.jpg' },
    { id:'kit2', name:"ACS Starter Kit", price:11999, img:'images/kit2.jpg' }
  ]
};

/* ---------- Populate Best Sellers on homepage ---------- */
function populateBest(){
  const bestGrid = document.getElementById('bestGrid');
  if(!bestGrid) return;
  bestGrid.innerHTML = '';
  allProducts.best.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" onerror="this.style.opacity=.6">
      <h4>${p.name}</h4>
      <p class="price">PKR ${numberWithCommas(p.price)}</p>
      <div class="card-actions">
        <button class="btn small add-to-cart" data-id="${p.id}" data-price="${p.price}">Add to Cart</button>
        <a class="btn outline small" href="products.html#${p.id}">View</a>
      </div>
    `;
    bestGrid.appendChild(card);
  });
  attachAddButtons();
}

/* ---------- Populate All Products page (products.html) ---------- */
function populateAllProducts(){
  const mapping = { bats:'batsGrid', balls:'ballsGrid', gloves:'glovesGrid', kits:'kitsGrid' };
  Object.keys(mapping).forEach(cat=>{
    const el = document.getElementById(mapping[cat]);
    if(!el) return;
    el.innerHTML = '';
    (allProducts[cat]||[]).forEach(p=>{
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" onerror="this.style.opacity=.6">
        <h4>${p.name}</h4>
        <p class="price">PKR ${numberWithCommas(p.price)}</p>
        <div class="card-actions">
          <button class="btn small add-to-cart" data-id="${p.id}" data-price="${p.price}">Add to Cart</button>
        </div>
      `;
      el.appendChild(card);
    });
  });
  attachAddButtons();
}

/* ---------- Cart (localStorage) ---------- */
let cart = JSON.parse(localStorage.getItem('acs_cart') || '[]');

function attachAddButtons(){
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    btn.onclick = () => {
      const id = btn.dataset.id;
      const price = Number(btn.dataset.price);
      addToCart(id, price);
    };
  });
}

function addToCart(id, price){
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id, price, qty:1});
  saveCart();
  updateCartUI();
  alert('Added to cart');
}
function saveCart(){ localStorage.setItem('acs_cart', JSON.stringify(cart)); }
function updateCartUI(){
  const countEls = [document.getElementById('cartCount'), document.getElementById('cartCountProducts')];
  const totalCount = cart.reduce((s,i)=>s+i.qty,0);
  countEls.forEach(e=>{ if(e) e.textContent = totalCount; });
}
function numberWithCommas(x){ return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","); }

/* ---------- Load More (basic demonstration) ---------- */
document.addEventListener('click', function(e){
  if(e.target.classList.contains('load-more')){
    const cat = e.target.dataset.cat;
    // simple demo: duplicate category items to simulate load more
    if(allProducts[cat]) allProducts[cat] = allProducts[cat].concat(allProducts[cat]);
    populateAllProducts();
  }
});

/* ---------- Init on DOM ready ---------- */
document.addEventListener('DOMContentLoaded', function(){
  populateBest();
  populateAllProducts();
  updateCartUI();
  const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();
});
