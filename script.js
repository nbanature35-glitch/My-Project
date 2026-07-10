// Kofi Honu Gallery - script.js
// Shared across pages. Uses localStorage for users and cart.

const SIZE_PRICES = { S:100, M:150, L:200, XL:250 };
const IMAGE_BASE = 'The Story Painter';

const PAINTINGS = [
  { id:3, title:'Baobab Memory', image:`${IMAGE_BASE}/painting3.jpg`, base:100,
    story:'A lone baobab holds generations of stories beneath its branches, where evening light meets whispered tradition.' },
  { id:4, title:'Moonlit Coast', image:`${IMAGE_BASE}/painting4.jpg`, base:100,
    story:'A coastal evening scene where moonlight and surf blend into quiet reflection and gentle motion.' },
  { id:5, title:'Sunrise Market', image:`${IMAGE_BASE}/painting5.jpg`, base:100,
    story:'Early market hours capture the warmth of sunrise, fresh produce, and the lively hum of a day beginning.' },
  { id:7, title:'Drum Circle Harmony', image:`${IMAGE_BASE}/painting7.jpg`, base:100,
    story:'A circle of drums pulses with rhythm, capturing celebration, community and the heartbeat of a night.' },
  { id:8, title:'River Mist Reverie', image:`${IMAGE_BASE}/painting8.jpg`, base:100,
    story:'Soft mist rises over river waters as boats glide slowly, carrying dreams and dialogue between banks.' },
  { id:9, title:'Ashanti Gold Weave', image:`${IMAGE_BASE}/painting9.jpg`, base:100,
    story:'A richly woven scene inspired by tradition, gold accents and hands working together to create beauty.' },
  { id:10, title:'Savannah Whisper', image:`${IMAGE_BASE}/painting10.jpg`, base:100,
    story:'Open savannahs and quiet hues evoke the stillness of dawn and the whisper of distant horizons.' },
  { id:13, title:'Canvas Bloom', image:`${IMAGE_BASE}/painting13.jpg`, base:120,
    story:'An abstract burst of color where petals and paint merge into a warm celebration of life.' },
  { id:14, title:'Woven Light', image:`${IMAGE_BASE}/painting14.jpg`, base:120,
    story:'Light pours through textured brushstrokes, creating a tapestry of energy and handcrafted pattern.' },
  { id:15, title:'Petal Rhythm', image:`${IMAGE_BASE}/painting15.jpg`, base:120,
    story:'A floral-inspired canvas with gentle movement, soft color and a sense of graceful motion.' },
  { id:17, title:'Golden Echo', image:`${IMAGE_BASE}/painting17.jpg`, base:120,
    story:'Warm golden tones echo across the surface like sunlight reflected on polished wood.' },
  { id:18, title:'Misty Horizon', image:`${IMAGE_BASE}/painting18.jpg`, base:120,
    story:'A distant horizon emerges through layers of mist, inviting calm and quiet curiosity.' },
  { id:19, title:'Velvet Dawn', image:`${IMAGE_BASE}/painting19.jpg`, base:120,
    story:'Deep, luxurious shades blend into the first light of dawn, creating a rich, inviting atmosphere.' },
  { id:20, title:'Twilight Bloom', image:`${IMAGE_BASE}/painting20.jpg`, base:120,
    story:'Evening color blooms in the sky like a painting within a painting, full of depth and wonder.' }
];

// Storage helpers
function getUsers(){return JSON.parse(localStorage.getItem('sp_users')||'[]')}
function saveUsers(u){localStorage.setItem('sp_users',JSON.stringify(u))}
function setCurrentUser(email){localStorage.setItem('sp_currentUser',email)}
function getCurrentUser(){return localStorage.getItem('sp_currentUser')}

function getCart(){return JSON.parse(localStorage.getItem('sp_cart')||'[]')}
function saveCart(c){localStorage.setItem('sp_cart',JSON.stringify(c)); updateCartCount();}

function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cartLink').forEach(el=>el.textContent=`Cart(${count})`);
}

function requireAuth(){
  const page = document.body.dataset.page;
  if(page && page!=='home' && page!=='gallery' && page!=='cart' && page!=='') return;
  if(window.location.pathname.endsWith('index.html')||window.location.pathname.endsWith('/')) return;
  if(!getCurrentUser()){
    window.location = 'index.html';
  }
}

function initNavbar(){
  updateCartCount();
  document.querySelectorAll('#logoutBtn').forEach(btn=>{
    btn.addEventListener('click',()=>{ localStorage.removeItem('sp_currentUser'); window.location='index.html'; });
  });
}

function getStoryPreview(text){
  const end = text.indexOf('.') > 40 ? text.indexOf('.') + 1 : Math.min(text.length, 100);
  const preview = text.slice(0, end).trim();
  return preview.length > 110 ? preview.slice(0, 110) + '…' : preview;
}

// Index page handlers
if(document.body.dataset.page===undefined && window.location.pathname.endsWith('Index.html')===false && window.location.pathname.endsWith('index.html')===false && window.location.pathname.endsWith('/')===false){
  // nothing
}

document.addEventListener('DOMContentLoaded',()=>{
  const path = window.location.pathname.split('/').pop() || 'index.html';
  // Normalize index name
  if(['index.html','Index.html',''].includes(path)){
    // index page
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const showLogin = document.getElementById('showLogin');

    showLogin && showLogin.addEventListener('click',(e)=>{ e.preventDefault(); signupForm.classList.add('hidden'); loginForm.classList.remove('hidden'); });

    signupForm && signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const users = getUsers();
      if(users.find(u=>u.email===email)){
        alert('Account already exists. Please login.');
        return;
      }
      users.push({name,email,password});
      saveUsers(users);
      setCurrentUser(email);
      window.location='home.html';
    });

    loginForm && loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const users = getUsers();
      const user = users.find(u=>u.email===email && u.password===password);
      if(!user){ alert('Invalid credentials'); return; }
      setCurrentUser(email);
      window.location='home.html';
    });
    return;
  }

  // For non-index pages require auth
  if(!getCurrentUser()){ window.location='index.html'; return; }

  // init navbar
  initNavbar();

  // page-specific
  const page = document.body.dataset.page;
  if(page==='home') renderHome();
  if(page==='gallery') renderGallery();
  if(page==='cart') renderCart();
});

// RENDER HOME
function renderHome(){
  const featured = PAINTINGS.slice(0,6);
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML='';
  featured.forEach(p=>{
    const card = document.createElement('div');
    card.className='bg-white rounded-xl p-4 shadow-lg hover:-translate-y-1 transition';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="card-img rounded-md mb-3" />
      <div>
        <div class="font-semibold text-lg">${p.title}</div>
        <div class="text-sm text-gray-600 mt-1">$${p.base}</div>
        <p class="card-preview">${getStoryPreview(p.story)}</p>
      </div>
      <div class="card-actions mt-4">
        <button data-id="${p.id}" class="readBtn px-4 py-2 bg-deepPurple text-cream rounded-full text-sm">View Story</button>
        <button data-id="${p.id}" class="addHome px-4 py-2 bg-gold text-deepPurple rounded-full text-sm">Add to Cart</button>
      </div>
      <div class="story story-hidden text-sm text-gray-800 p-3 story-box rounded mt-4">${p.story}</div>
    `;
    grid.appendChild(card);
  });

  // handlers
  document.querySelectorAll('.readBtn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const storyDiv = e.target.closest('div').parentElement.querySelector('.story');
      if(storyDiv.classList.contains('story-open')){ storyDiv.classList.remove('story-open'); storyDiv.classList.add('story-hidden'); }
      else { storyDiv.classList.remove('story-hidden'); storyDiv.classList.add('story-open'); }
    });
  });

  document.querySelectorAll('.addHome').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = Number(e.target.dataset.id);
      addToCart(id,'S',1);
      alert('Added to cart');
    });
  });
}

// RENDER GALLERY
function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML='';
  PAINTINGS.forEach(p=>{
    const col = document.createElement('div');
    col.className='bg-white rounded-xl p-4 shadow-lg hover:-translate-y-1 transition';
    col.innerHTML = `
      <img src="${p.image}" alt="${p.title}" class="card-img rounded-md mb-3" />
      <div>
        <div class="font-bold text-lg">${p.title}</div>
        <p class="card-preview">${getStoryPreview(p.story)}</p>
      </div>
      <div class="card-actions mt-4">
        <select data-id="${p.id}" class="sizeSel rounded-full border border-gray-200 px-3 py-2 text-sm">
          <option value="S">S $${SIZE_PRICES.S}</option>
          <option value="M">M $${SIZE_PRICES.M}</option>
          <option value="L">L $${SIZE_PRICES.L}</option>
          <option value="XL">XL $${SIZE_PRICES.XL}</option>
        </select>
        <button class="priceBtn text-deepPurple font-semibold rounded-full px-4 py-2 btn-secondary" data-id="${p.id}">$${p.base}</button>
      </div>
      <div class="card-actions mt-3">
        <button class="readBtn px-4 py-2 bg-deepPurple text-cream rounded-full text-sm" data-id="${p.id}">View Story</button>
        <button class="addBtn px-4 py-2 bg-gold text-deepPurple rounded-full text-sm" data-id="${p.id}">Add to Cart</button>
      </div>
      <div class="story story-hidden text-sm text-gray-800 p-3 story-box rounded mt-4">${p.story}</div>
    `;
    grid.appendChild(col);
  });

  // handlers
  document.querySelectorAll('.readBtn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const storyDiv = e.target.closest('.shadow-lg').querySelector('.story');
      storyDiv.classList.toggle('story-open');
      storyDiv.classList.toggle('story-hidden');
    });
  });

  // update price when size changed
  document.querySelectorAll('.sizeSel').forEach(sel=>{
    sel.addEventListener('change',(e)=>{
      const id = Number(e.target.dataset.id);
      const size = e.target.value;
      const btn = e.target.closest('.shadow-lg').querySelector('.priceBtn');
      btn.textContent = `$${SIZE_PRICES[size]}`;
    });
  });

  // price click -> add to cart and go to cart
  document.querySelectorAll('.priceBtn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const id = Number(e.target.dataset.id);
      const sel = e.target.closest('.shadow-lg').querySelector('.sizeSel');
      const size = sel.value;
      addToCart(id,size,1);
      window.location='cart.html';
    });
  });

  document.querySelectorAll('.addBtn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const id = Number(e.target.dataset.id);
      const sel = e.target.closest('.shadow-lg').querySelector('.sizeSel');
      const size = sel.value;
      addToCart(id,size,1);
      window.location='cart.html';
    });
  });
}

// CART
function renderCart(){
  const container = document.getElementById('cartContainer');
  let cart = getCart();
  container.innerHTML='';
  if(cart.length===0){ container.innerHTML='<div class="p-6 bg-white rounded">Your cart is empty.</div>'; updateTotals(); return; }

  cart.forEach((item, idx)=>{
    const el = document.createElement('div');
    el.className='bg-white rounded-lg p-4 flex gap-4 items-center';
    el.innerHTML = `
      <img src="${item.image}" class="w-32 h-24 object-cover rounded" />
      <div class="flex-1">
        <div class="font-bold">${item.title}</div>
        <div class="mt-2 flex items-center gap-3">
          <label>Size</label>
          <select class="cartSize" data-idx="${idx}">
            <option ${item.size==='S'?'selected':''}>S</option>
            <option ${item.size==='M'?'selected':''}>M</option>
            <option ${item.size==='L'?'selected':''}>L</option>
            <option ${item.size==='XL'?'selected':''}>XL</option>
          </select>
          <label>Qty</label>
          <input type="number" min="1" value="${item.qty}" class="cartQty w-20 border rounded p-1" data-idx="${idx}" />
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-lg">$<span class="itemPrice">${item.price}</span></div>
        <div class="mt-2">
          <button class="removeBtn text-red-600" data-idx="${idx}">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });

  // attach handlers
  document.querySelectorAll('.cartSize').forEach(sel=>{
    sel.addEventListener('change',(e)=>{
      const idx = Number(e.target.dataset.idx);
      cart = getCart();
      cart[idx].size = e.target.value;
      cart[idx].price = SIZE_PRICES[e.target.value] * cart[idx].qty;
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.cartQty').forEach(inp=>{
    inp.addEventListener('change',(e)=>{
      const idx = Number(e.target.dataset.idx);
      const val = Math.max(1, Number(e.target.value)||1);
      cart = getCart();
      cart[idx].qty = val;
      cart[idx].price = SIZE_PRICES[cart[idx].size] * val;
      saveCart(cart);
      renderCart();
    });
  });

  document.querySelectorAll('.removeBtn').forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      const idx = Number(e.target.dataset.idx);
      cart = getCart();
      cart.splice(idx,1);
      saveCart(cart);
      renderCart();
    });
  });

  updateTotals();
  const checkout = document.getElementById('checkoutBtn');
  checkout && (checkout.onclick = ()=>{ alert('Order received! We will contact you.'); localStorage.removeItem('sp_cart'); renderCart(); updateCartCount(); });
}

function updateTotals(){
  const cart = getCart();
  const subtotal = cart.reduce((s,i)=>s+i.price,0);
  document.getElementById('subtotal') && (document.getElementById('subtotal').textContent = `$${subtotal}`);
  document.getElementById('total') && (document.getElementById('total').textContent = `$${subtotal}`);
}

// Add to cart
function addToCart(id,size='S',qty=1){
  const p = PAINTINGS.find(x=>x.id===id);
  if(!p) return;
  const cart = getCart();
  // if same painting and size exists, increase qty
  const existing = cart.find(i=>i.id===id && i.size===size);
  if(existing){ existing.qty += qty; existing.price = SIZE_PRICES[size]*existing.qty; saveCart(cart); return; }
  const item = { id:p.id, title:p.title, image:p.image, size, qty, price: SIZE_PRICES[size]*qty };
  cart.push(item);
  saveCart(cart);
}
