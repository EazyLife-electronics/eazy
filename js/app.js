const money=n=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n);
let cart=JSON.parse(localStorage.getItem('eazy-cart')||'[]');
let wishlist=JSON.parse(localStorage.getItem('eazy-wishlist')||'[]');

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function save(){localStorage.setItem('eazy-cart',JSON.stringify(cart));localStorage.setItem('eazy-wishlist',JSON.stringify(wishlist));updateCounts();renderCart()}
function updateCounts(){const n=cart.reduce((a,p)=>a+p.qty,0);$('#cartCount').textContent=n;$('#bottomCartCount').textContent=n}
function productCard(p){const wished=wishlist.includes(p.id);return `<article class="product-card"><div class="product-image">${p.discount?`<span class="discount">-${p.discount}%</span>`:''}<button class="heart ${wished?'active':''}" data-wish="${p.id}">${wished?'♥':'♡'}</button><span>${p.emoji}</span></div><div class="product-info"><div class="product-name">${p.name}</div><div class="rating">★ ${p.rating} · ${p.reviews} reviews</div><div class="price-row"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div><button class="add-btn" data-add="${p.id}">Add to cart</button></div></article>`}
function renderProducts(list=products){$('#productGrid').innerHTML=list.map(productCard).join('')}
function renderDeals(){$('#dealGrid').innerHTML=products.filter(p=>p.deal).map(productCard).join('')}
function renderCategories(){$('#categoryGrid').innerHTML=categories.map(c=>`<a class="category-card" href="#products" data-category="${c.name}"><span class="category-icon">${c.icon}</span><strong>${c.name}</strong></a>`).join('')}
function renderCart(){const box=$('#cartItems');if(!cart.length){box.innerHTML='<div class="empty-cart"><div style="font-size:50px">🛒</div><p>Your cart is empty.</p><small>Add something you love and it will appear here.</small></div>';$('#cartTotal').textContent=money(0);return}box.innerHTML=cart.map(i=>`<div class="cart-row"><div class="thumb">${i.emoji}</div><div><strong>${i.name}</strong><small>${money(i.price)} × ${i.qty}</small></div></div>`).join('');$('#cartTotal').textContent=money(cart.reduce((a,p)=>a+p.price*p.qty,0))}
function addToCart(id){const p=products.find(x=>x.id===id);const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...p,qty:1});save();toast(`${p.name} added to cart`)}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts();renderDeals();toast(wishlist.includes(id)?'Added to wishlist':'Removed from wishlist')}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}
function openCart(){$('#cartDrawer').classList.add('open');$('#drawerBackdrop').classList.add('show');renderCart()}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#drawerBackdrop').classList.remove('show')}
function search(){const q=$('#searchInput').value.trim().toLowerCase();if(!q){renderProducts();location.hash='products';return}const result=products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q));renderProducts(result);location.hash='products';toast(`${result.length} product${result.length===1?'':'s'} found`)}

document.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add)addToCart(Number(add.dataset.add));const wish=e.target.closest('[data-wish]');if(wish)toggleWish(Number(wish.dataset.wish));const cat=e.target.closest('[data-category]');if(cat){e.preventDefault();renderProducts(products.filter(p=>p.category===cat.dataset.category));location.hash='products'}if(e.target.closest('#cartBtn')||e.target.closest('#bottomCart'))openCart();if(e.target.closest('#closeCart')||e.target.id==='drawerBackdrop')closeCart();if(e.target.closest('#accountBtn')||e.target.closest('#bottomAccount'))toast('Account area is coming next');if(e.target.closest('#wishlistBtn')){const list=products.filter(p=>wishlist.includes(p.id));renderProducts(list);location.hash='products';toast(`${list.length} item${list.length===1?'':'s'} in wishlist`)}});
$('#searchButton').addEventListener('click',search);$('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')search()});
renderCategories();renderDeals();renderProducts();updateCounts();

let end=Date.now()+1000*60*60*9+1000*60*37;setInterval(()=>{let left=Math.max(0,end-Date.now()),h=Math.floor(left/36e5),m=Math.floor(left%36e5/6e4),s=Math.floor(left%6e4/1e3);$('#countdown').textContent=`Ends in ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`},1000);
