/* ========================================
   LUXFRAME Paris — Script Partagé
   ======================================== */

// ── DONNÉES PRODUITS ──
const PRODUCTS = {
  'icon': {
    id: 'icon',
    name: 'Icon',
    subtitle: 'Monture épaisse carrée rétro',
    description: 'Lunettes de soleil au style assumé et audacieux. Monturelarge et carrée qui rappelle les icônes des années 70, revisitée pour un look résolument moderne.',
    colors: [
      { id: 'gris-fume', name: 'Gris Transparent — Verres Fumés', frame: '#9ca3af', glass: '#374151', temple: '#6b7280' },
      { id: 'cristal-bleu', name: 'Cristal — Verres Bleu Dégradé', frame: '#e8e8ee', glass: 'gradient-blue', temple: '#d4d4e0' },
      { id: 'cristal-orange', name: 'Cristal Branches Orange — Verres Champagne', frame: '#e8e8ee', glass: '#c8a96e', temple: '#e05a00', templeAccent: true },
      { id: 'noir', name: 'Noir — Verres Fumés', frame: '#1f1f1f', glass: '#111827', temple: '#111111' },
      { id: 'ecaille', name: 'Écaille Tortoise — Verres Brun', frame: '#8B4513', glass: '#92400e', temple: '#6b3410' },
      { id: 'blanc', name: 'Blanc Glacé — Verres Rose Dégradé', frame: '#f5f5f5', glass: 'gradient-pink', temple: '#dcdcdc' }
    ]
  },
  'prestige': {
    id: 'prestige',
    name: 'Prestige',
    subtitle: 'Style Cartier — Monture rectangulaire fine',
    description: 'Lunettes de soleil au raffinement intemporel inspiré des grandes maisons. Monture métallique ultra-fine et verres dégradés pour une élégance sans compromis.',
    colors: [
      { id: 'green', name: 'Green', image: 'Lunette dégradés photos/GREEN.png' },
      { id: 'tea', name: 'Tea', image: 'Lunette dégradés photos/TEA .png' },
      { id: 'gray-gradient', name: 'Gray Gradient', image: 'Lunette dégradés photos/GRAY GRADIENT.png' },
      { id: 'gray', name: 'Gray', image: 'Lunette dégradés photos/GRAY.png' },
      { id: 'pink', name: 'Pink', image: 'Lunette dégradés photos/PINK.png' }
    ]
  }
};

// ── LOCALSTORAGE PANIER ──
function getCart() {
  try { return JSON.parse(localStorage.getItem('luxframe_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('luxframe_cart', JSON.stringify(cart));
}
function addToCart(productId, colorId, qty) {
  const cart = getCart();
  const existing = cart.findIndex(i => i.productId === productId && i.colorId === colorId);
  if (existing >= 0) {
    cart[existing].qty += qty;
  } else {
    cart.push({ productId, colorId, qty: parseInt(qty) || 1 });
  }
  saveCart(cart);
}
function removeFromCart(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
}
function clearCart() { saveCart([]); }
function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}
function getCartTotal() {
  const cart = getCart();
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const freebies = Math.floor(totalQty / 3);
  return totalQty * 20 - freebies * 20;
}
function getFreebiesCount() { return Math.floor(getCart().reduce((s, i) => s + i.qty, 0) / 3); }

// ── COMPTEUR PANIER DANS HEADER ──
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}
document.addEventListener('DOMContentLoaded', updateCartBadge);

// ── GÉNÉRATION SVG ICON ──
// colorId: gris-fume | cristal-bleu | cristal-orange | noir | ecaille | blanc
function generateIconSVG(colorId, size) {
  const sizeW = size || 320;
  const sizeH = Math.round(sizeW * 0.56);
  const c = PRODUCTS.icon.colors.find(x => x.id === colorId) || PRODUCTS.icon.colors[0];

  let glassFill = c.glass;
  let glassFillAttr = 'fill';
  let glassTag = 'rect';

  if (glassFill === 'gradient-blue') {
    glassFill = 'url(#icon-grad-blue)';
    glassFillAttr = 'fill';
  } else if (glassFill === 'gradient-pink') {
    glassFill = 'url(#icon-grad-pink)';
  }

  // Monture épaisse carrée : cadre + branches
  // Cadre : x=30 y=60 w=110 h=55 rx=8
  // Pont : x=140 y=75 w=40 h=8 rx=4
  // Branche sup : x=148 y=65 w=100 h=6 rx=3
  // Branche inf : x=148 y=112 w=100 h=5 rx=3

  const templeColor = c.templeAccent ? c.temple : c.temple;

  return `<svg width="${sizeW}" height="${sizeH}" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="icon-grad-blue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="icon-grad-pink" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fce7f3"/>
      <stop offset="100%" stop-color="#db2777"/>
    </linearGradient>
  </defs>

  <!-- Verres -->
  <rect x="30" y="55" width="110" height="62" rx="10" ry="10" fill="${glassFill}" ${glassFillAttr}="${glassFill}" opacity="0.88"/>
  <rect x="180" y="55" width="110" height="62" rx="10" ry="10" fill="${glassFill}" ${glassFillAttr}="${glassFill}" opacity="0.88"/>

  <!-- Monture principale (cadre épais) -->
  <rect x="28" y="52" width="114" height="68" rx="12" ry="12" fill="none" stroke="${c.frame}" stroke-width="7"/>
  <rect x="178" y="52" width="114" height="68" rx="12" ry="12" fill="none" stroke="${c.frame}" stroke-width="7"/>

  <!-- Pont large -->
  <rect x="134" y="70" width="52" height="10" rx="5" ry="5" fill="${c.frame}"/>

  <!-- Branches supérieures -->
  <rect x="140" y="58" width="150" height="8" rx="4" ry="4" fill="${c.frame}"/>
  <rect x="140" y="110" width="150" height="7" rx="3" ry="3" fill="${c.frame}"/>

  ${c.templeAccent ? `
  <!-- Branches oranges (accent) -->
  <rect x="140" y="58" width="150" height="4" rx="2" ry="2" fill="${c.temple}"/>
  <rect x="140" y="110" width="150" height="3" rx="2" ry="2" fill="${c.temple}"/>
  ` : ''}

  <!-- Reflets verre -->
  <rect x="42" y="62" width="30" height="6" rx="3" ry="3" fill="white" opacity="0.3"/>
  <rect x="192" y="62" width="30" height="6" rx="3" ry="3" fill="white" opacity="0.3"/>
</svg>`;
}

// ── GÉNÉRATION SVG PRESTIGE (STYLE CARTIER) ──
// Style : monture métallique fine + ponts + branches fines + verres dégradés
function generatePrestigeSVG(colorId, size) {
  const sizeW = size || 320;
  const sizeH = Math.round(sizeW * 0.56);
  const c = PRODUCTS.prestige.colors.find(x => x.id === colorId) || PRODUCTS.prestige.colors[0];

  const getGlassGrad = () => {
    const g = c.glass;
    if (g === 'gradient-brown')    return { id: 'pg-brown',    s: '#a16207', e: '#78350f' };
    if (g === 'gradient-gray')     return { id: 'pg-gray',     s: '#6b7280', e: '#1f2937' };
    if (g === 'gradient-blue-metal')return { id: 'pg-blue-m',   s: '#2563eb', e: '#1e3a8a' };
    if (g === 'gradient-rose-metal')return { id: 'pg-rose',    s: '#f472b6', e: '#9d174d' };
    if (g === 'gradient-green-metal')return { id: 'pg-green',   s: '#16a34a', e: '#14532d' };
    return { id: 'pg-brown', s: '#a16207', e: '#78350f' };
  };
  const g = getGlassGrad();

  // Style Cartier : monture fine, verre rectangulaire aux coins arrondis,
  // pont double, branches fines avec ressort
  // Verres : x=35 y=60 w=110 h=55 rx=6
  // Monture (bord fin) : stroke only
  // Pont : double ligne fine
  // Branches : fines lignes

  return `<svg width="${sizeW}" height="${sizeH}" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${g.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${g.s}"/>
      <stop offset="100%" stop-color="${g.e}"/>
    </linearGradient>
    <!-- Reflet diagonal -->
    <linearGradient id="pg-shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="white" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.02"/>
    </linearGradient>
  </defs>

  <!-- Branche gauche (depuis le bord gauche du verre gauche) -->
  <line x1="35" y1="87" x2="0" y2="82" stroke="${c.temple}" stroke-width="5" stroke-linecap="round"/>
  <line x1="35" y1="95" x2="0" y2="93" stroke="${c.temple}" stroke-width="5" stroke-linecap="round"/>

  <!-- Branche droite (depuis le bord droit du verre droit) -->
  <line x1="285" y1="87" x2="320" y2="82" stroke="${c.temple}" stroke-width="5" stroke-linecap="round"/>
  <line x1="285" y1="95" x2="320" y2="93" stroke="${c.temple}" stroke-width="5" stroke-linecap="round"/>

  <!-- Verres rectangulaires (dégradés) -->
  <rect x="38" y="58" width="108" height="54" rx="6" ry="6" fill="url(#${g.id})" opacity="0.9"/>
  <rect x="174" y="58" width="108" height="54" rx="6" ry="6" fill="url(#${g.id})" opacity="0.9"/>

  <!-- Reflets sur verres -->
  <rect x="44" y="62" width="25" height="4" rx="2" ry="2" fill="white" opacity="0.22"/>
  <rect x="180" y="62" width="25" height="4" rx="2" ry="2" fill="white" opacity="0.22"/>

  <!-- Reflet diagonal sur verres -->
  <rect x="44" y="66" width="80" height="30" rx="4" fill="url(#pg-shine)" transform="skewX(-10)"/>

  <!-- Monture fine (bord du verre) - style métallique -->
  <rect x="38" y="58" width="108" height="54" rx="6" ry="6" fill="none" stroke="${c.frame}" stroke-width="2.5"/>
  <rect x="174" y="58" width="108" height="54" rx="6" ry="6" fill="none" stroke="${c.frame}" stroke-width="2.5"/>

  <!-- Pont double (style Cartier) -->
  <line x1="142" y1="70" x2="178" y2="70" stroke="${c.bridge || c.frame}" stroke-width="3" stroke-linecap="round"/>
  <line x1="142" y1="78" x2="178" y2="78" stroke="${c.bridge || c.frame}" stroke-width="3" stroke-linecap="round"/>

  <!-- Charnières décoratives -->
  <circle cx="146" cy="74" r="3.5" fill="${c.frame}"/>
  <circle cx="174" cy="74" r="3.5" fill="${c.frame}"/>
  <circle cx="146" cy="78" r="3.5" fill="${c.frame}"/>
  <circle cx="174" cy="78" r="3.5" fill="${c.frame}"/>

  <!-- Embouts de branches (extrémités) -->
  <rect x="1" y="79" width="14" height="8" rx="4" ry="4" fill="${c.temple}"/>
  <rect x="1" y="90" width="14" height="8" rx="4" ry="4" fill="${c.temple}"/>
  <rect x="305" y="79" width="14" height="8" rx="4" ry="4" fill="${c.temple}"/>
  <rect x="305" y="90" width="14" height="8" rx="4" ry="4" fill="${c.temple}"/>
</svg>`;
}

// ── AFFICHER LE SVG PRODUIT ──
function renderProductSVG(productId, colorId, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (productId === 'prestige') {
    // Render a product photo/image for Prestige models when available
    const product = PRODUCTS.prestige;
    const color = product.colors.find(c => c.id === colorId) || product.colors[0];
    if (color && color.image) {
      el.innerHTML = `<img src="${color.image}" alt="${product.name} — ${color.name}" class="product-photo" tabindex="0">`;
    } else {
      el.innerHTML = generatePrestigeSVG(colorId || 'dore-brun');
    }
  } else {
    el.innerHTML = generateIconSVG(colorId || 'gris-fume');
  }
}

// --- Image zoom modal (click to open, wheel to zoom, drag to pan) ---
function ensureZoomModal() {
  if (document.getElementById('image-zoom-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'image-zoom-modal';
  modal.className = 'image-zoom-modal';
  modal.style.display = 'none';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'image-zoom-close';
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Fermer');
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

  const inner = document.createElement('div');
  inner.className = 'image-zoom-inner';
  const img = document.createElement('img');
  img.alt = '';
  inner.appendChild(img);

  modal.appendChild(inner);
  document.body.appendChild(modal);
  document.body.appendChild(closeBtn);

  // state
  let scale = 1;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let dragging = false;

  function updateTransform() {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  // wheel to zoom
  inner.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.12 : 0.88;
    const prevScale = scale;
    scale = Math.min(5, Math.max(1, scale * factor));

    // adjust translate so zoom focuses on mouse position
    const rect = img.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = (mx - rect.width/2);
    const dy = (my - rect.height/2);
    translateX -= dx * (scale/prevScale - 1);
    translateY -= dy * (scale/prevScale - 1);

    updateTransform();
  }, { passive: false });

  // touch / pinch zoom
  let pinchDist = 0;
  inner.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      dragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
      dragging = false;
      const [a, b] = e.touches;
      pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }
  }, { passive: false });

  inner.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && dragging) {
      e.preventDefault();
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (pinchDist > 0) {
        const factor = dist / pinchDist;
        scale = Math.min(5, Math.max(1, scale * factor));
        pinchDist = dist;
        updateTransform();
      }
    }
  }, { passive: false });

  inner.addEventListener('touchend', () => {
    dragging = false;
    pinchDist = 0;
  });

  // drag to pan
  inner.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragging = true;
    inner.style.cursor = 'grabbing';
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });
  window.addEventListener('mouseup', () => {
    dragging = false;
    inner.style.cursor = 'grab';
  });

  // click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // expose helper
  modal.showImage = function(src, alt) {
    img.src = src;
    img.alt = alt || '';
    scale = 1; translateX = 0; translateY = 0;
    updateTransform();
    modal.style.display = 'flex';
  };
}

function enableImageZoom(containerId) {
  ensureZoomModal();
  const modal = document.getElementById('image-zoom-modal');
  const container = document.getElementById(containerId);
  if (!container) return;

  let lens = container.querySelector('.image-magnifier-lens');
  if (!lens) {
    lens = document.createElement('div');
    lens.className = 'image-magnifier-lens';
    container.appendChild(lens);
  }
  let activeImg = null;
  const zoomFactor = 2.2;

  function updateLens(e, img) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      lens.style.display = 'none';
      return;
    }
    lens.style.display = 'block';
    const lensSize = lens.offsetWidth;
    const left = Math.min(Math.max(x - lensSize / 2, 0), rect.width - lensSize);
    const top = Math.min(Math.max(y - lensSize / 2, 0), rect.height - lensSize);
    lens.style.left = `${left}px`;
    lens.style.top = `${top}px`;
    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;
    lens.style.backgroundImage = `url(${img.src})`;
    lens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
    lens.style.backgroundPosition = `${-(x * zoomFactor - lensSize / 2)}px ${-(y * zoomFactor - lensSize / 2)}px`;
  }

  container.addEventListener('mousemove', (e) => {
    const img = e.target.closest && e.target.closest('img.product-photo');
    if (!img) return;
    activeImg = img;
    updateLens(e, img);
  });

  container.addEventListener('mouseleave', () => {
    lens.style.display = 'none';
    activeImg = null;
  });

  container.addEventListener('click', (e) => {
    const img = e.target.closest && e.target.closest('img.product-photo');
    if (!img) return;
    lens.style.display = 'none';
    modal.showImage(img.src, img.alt);
  });
}

// ── PRIX & OFFRE ──
const PRICE = 20;
const OFFER_MSG = '🎁 Offre Spéciale : 2 achetées = la 3ème offerte !';

// ── REDIRECTION APRÈS AJOUT ──
function addAndRedirect(productId, colorId, qty) {
  addToCart(productId, colorId, qty);
  window.location.href = 'panier.html';
}

// ── INIT SÉLECTEUR PRODUIT ──
// Appelée sur les pages produit avec les données du select
function initProductSelector(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  // Param URL ?coloris=
  const params = new URLSearchParams(window.location.search);
  const defaultColor = params.get('coloris') || product.colors[0].id;

  // Remplir le select couleur
  const colorSelect = document.getElementById('color-select');
  if (colorSelect) {
    colorSelect.innerHTML = product.colors.map(c =>
      `<option value="${c.id}" ${c.id === defaultColor ? 'selected' : ''}>${c.name}</option>`
    ).join('');

    colorSelect.addEventListener('change', () => {
      renderProductSVG(productId, colorSelect.value, 'product-svg-container');
    });

    // Initial render
    renderProductSVG(productId, defaultColor, 'product-svg-container');
    enableImageZoom('product-svg-container');
  }

  // Bouton ajouter
  const btn = document.getElementById('btn-add-to-cart');
  if (btn) {
    btn.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qty-select')?.value || 1);
      const color = document.getElementById('color-select')?.value || defaultColor;
      addAndRedirect(productId, color, qty);
    });
  }
}

// ── INIT PAGE PANIER ──
function initCartPage() {
  const cart = getCart();
  const container = document.getElementById('cart-items-container');
  const emptyMsg = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');

  if (!container) return;

  if (cart.length === 0) {
    container.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = '';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  container.style.display = 'flex';

  let html = '';
  cart.forEach((item, idx) => {
    const product = PRODUCTS[item.productId];
    if (!product) return;
    const color = product.colors.find(c => c.id === item.colorId) || product.colors[0];
    const svgFn = item.productId === 'prestige' ? generatePrestigeSVG : generateIconSVG;
    html += `
      <div class="cart-item">
        <div class="cart-item-visual">${svgFn(item.colorId, 140)}</div>
        <div class="cart-item-info">
          <h3>${product.name} <span class="demo-tag">Test</span></h3>
          <div class="color-label">${color.name}</div>
        </div>
        <div class="cart-item-qty">×${item.qty}</div>
        <div class="cart-item-price">${(item.qty * PRICE).toFixed(2)} €</div>
        <button class="btn-remove" onclick="removeItem(${idx})" title="Retirer">×</button>
      </div>`;
  });
  container.innerHTML = html;

  // Totaux
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const freebies = Math.floor(totalQty / 3);
  const subtotal = totalQty * PRICE;
  const discount = freebies * PRICE;
  const total = subtotal - discount;

  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount');
  const discountAmtEl = document.getElementById('cart-discount-val');
  const totalEl = document.getElementById('cart-total');
  const freebiesEl = document.getElementById('cart-freebies');
  const qtyLabelEl = document.getElementById('cart-qty-label');

  if (qtyLabelEl) qtyLabelEl.textContent = totalQty;
  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2) + ' €';
  if (freebiesEl) freebiesEl.textContent = freebies;
  if (discountRow && discountAmtEl) {
    if (discount > 0) {
      discountRow.style.display = '';
      discountAmtEl.innerHTML = `− ${discount.toFixed(2)} € <small style="font-weight:400;color:#888">(2+1)</small>`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';

  // Stocker le total pour la confirmation
  localStorage.setItem('luxframe_last_total', total.toFixed(2));
}

function removeItem(idx) {
  removeFromCart(idx);
  initCartPage();
  updateCartBadge();
}

// ── INIT PAGE COMMANDE ──
function initOrderPage() {
  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'panier.html';
    return;
  }

  // Récap dans le récapitulatif latéral
  const recap = document.getElementById('order-recap-items');
  if (recap) {
    let html = '';
    cart.forEach(item => {
      const product = PRODUCTS[item.productId];
      const color = product?.colors.find(c => c.id === item.colorId) || product?.colors[0];
      if (!product || !color) return;
      html += `<div class="order-item"><span>${product.name} — ${color.name} ×${item.qty}</span><span>${(item.qty * PRICE).toFixed(2)} €</span></div>`;
    });
    recap.innerHTML = html;
  }

  const total = getCartTotal();
  const totalEl = document.getElementById('order-total-display');
  if (totalEl) totalEl.textContent = total.toFixed(2) + ' €';

  const form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearCart();
      window.location.href = 'confirmation.html';
    });
  }
}

// ── INIT PAGE CONFIRMATION ──
function initConfirmPage() {
  const total = localStorage.getItem('luxframe_last_total') || '0.00';
  const amountEl = document.getElementById('confirm-amount');
  if (amountEl) amountEl.textContent = total + ' €';
  localStorage.removeItem('luxframe_last_total');
}

// ── EXPORTS (accessibles depuis HTML inline si besoin) ──
window.PRODUCTS = PRODUCTS;
window.addToCart = addToCart;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
window.initProductSelector = initProductSelector;
window.initCartPage = initCartPage;
window.initOrderPage = initOrderPage;
window.initConfirmPage = initConfirmPage;