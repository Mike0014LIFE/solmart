/* ============================================================
   SOLMART — Main JavaScript
   A Raha Food & Hospitality Group platform
   ============================================================ */

/* ── Cart State ── */
const cart = {
  items: [],

  add(product) {
    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
    this.updateBadge();
    showToast(`${product.name} added to cart`);
  },

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
    this.updateBadge();
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  save() {
    try {
      localStorage.setItem('solmart_cart', JSON.stringify(this.items));
    } catch (e) {
      // storage unavailable
    }
  },

  load() {
    try {
      const saved = localStorage.getItem('solmart_cart');
      if (saved) this.items = JSON.parse(saved);
    } catch (e) {
      this.items = [];
    }
    this.updateBadge();
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => {
      b.textContent = this.count();
      b.style.display = this.count() > 0 ? 'flex' : 'flex';
    });
  },

  buildWhatsAppMessage(whatsappNumber) {
    if (this.items.length === 0) return null;

    let msg = '🛒 *New Order from SolMart*\n\n';
    this.items.forEach(item => {
      msg += `• ${item.name} x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}\n`;
    });
    msg += `\n*Total: ₦${this.total().toLocaleString()}*\n\nPlease confirm availability and delivery details.`;

    const number = whatsappNumber || '2340000000000';
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  }
};

/* ── Toast Notification ── */
function showToast(message) {
  let toast = document.getElementById('sm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sm-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: #111827;
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 500;
      z-index: 9999;
      transition: transform 0.3s ease;
      white-space: nowrap;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = `✓  ${message}`;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 2500);
}

/* ── Add to Cart Button Handler ── */
function addToCart(id, name, price) {
  cart.add({ id, name, price });
}

/* ── Checkout via WhatsApp ── */
function checkoutWhatsApp(number) {
  if (cart.items.length === 0) {
    showToast('Your cart is empty');
    return;
  }
  const url = cart.buildWhatsAppMessage(number);
  if (url) window.open(url, '_blank');
}

/* ── Search (placeholder until database) ── */
function initSearch() {
  const inputs = document.querySelectorAll('.nav-search input');
  const buttons = document.querySelectorAll('.nav-search button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Search will be available once products are live');
    });
  });

  inputs.forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        showToast('Search will be available once products are live');
      }
    });
  });
}

/* ── Active category nav link ── */
function setActiveCatNav() {
  const currentPage = window.location.pathname.split('/').pop();
  const links = document.querySelectorAll('.cat-nav a');
  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  cart.load();
  initSearch();
  setActiveCatNav();
});
