function renderNavbar() {
  const isLogged = Store.auth.isLoggedIn();
  const navHTML = `
    <nav class="navbar">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo">
          <span class="nav-logo-text">Mantra<span class="nav-logo-dot">.</span></span>
        </a>
        
        <div class="nav-links">
          <a href="index.html" class="nav-link">Home</a>
          <a href="men.html" class="nav-link">Men</a>
          <a href="women.html" class="nav-link">Women</a>
          <a href="kids.html" class="nav-link">Kids</a>
          <a href="beauty.html" class="nav-link">Beauty</a>
          <a href="living.html" class="nav-link">Home & Living</a>
        </div>
        
        <div class="nav-search">
          <input type="text" class="nav-search-input" placeholder="Search for products, brands and more">
          <button class="nav-search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        
        <div class="nav-actions">
          <button class="nav-action-btn" onclick="openSpinPopup()" title="Spin & Win">
            <i class="fa-solid fa-gift" style="color: var(--primary);"></i>
            <span style="color: var(--primary); font-weight: 700;">Spin & Win</span>
          </button>
          <a href="${isLogged ? 'profile.html' : 'login.html'}" class="nav-action-btn">
            <i class="fa-regular fa-user"></i>
            <span>Profile</span>
          </a>
          <a href="wishlist.html" class="nav-action-btn">
            <i class="fa-regular fa-heart"></i>
            <span>Wishlist</span>
            <div class="nav-badge wishlist-count">0</div>
          </a>
          <a href="cart.html" class="nav-action-btn">
            <i class="fa-solid fa-bag-shopping"></i>
            <span>Bag</span>
            <div class="nav-badge cart-count">0</div>
          </a>
          
          <button class="theme-toggle" id="themeToggle" title="Toggle dark mode">
            <i class="fa-solid fa-moon"></i>
          </button>
          <div class="nav-hamburger" id="navHamburger">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="mobile-menu" id="mobileMenu">
      <div class="nav-search" style="display:block; max-width:100%; margin-bottom:20px;">
        <input type="text" class="nav-search-input" placeholder="Search...">
      </div>
      <div class="mobile-menu-links">
        <a href="index.html" class="mobile-menu-link"><i class="fa-solid fa-house"></i> Home</a>
        <a href="men.html" class="mobile-menu-link"><i class="fa-solid fa-mars"></i> Men</a>
        <a href="women.html" class="mobile-menu-link"><i class="fa-solid fa-venus"></i> Women</a>
        <a href="kids.html" class="mobile-menu-link"><i class="fa-solid fa-child"></i> Kids</a>
        <a href="beauty.html" class="mobile-menu-link"><i class="fa-solid fa-pump-soap"></i> Beauty</a>
        <a href="living.html" class="mobile-menu-link"><i class="fa-solid fa-couch"></i> Home & Living</a>
      </div>
      <div class="mobile-menu-actions">
        <a href="${isLogged ? 'profile.html' : 'login.html'}" class="btn btn-outline btn-full">Profile</a>
        ${isLogged ? '<button onclick="Store.auth.logout();location.reload()" class="btn btn-primary btn-full">Logout</button>' : ''}
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // Active link
  const currentUrl = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentUrl) link.classList.add('active');
  });

  // Hamburger
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Global search handler
  const handleSearch = (val) => {
    if (val.trim()) {
      window.location.href = 'search.html?q=' + encodeURIComponent(val.trim());
    }
  };

  document.querySelectorAll('.nav-search-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch(e.target.value);
    });
  });

  document.querySelectorAll('.nav-search-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.currentTarget.previousElementSibling;
      if (input && input.value) handleSearch(input.value);
    });
  });

  // Dark mode
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (toggle) {
    toggle.innerHTML = savedTheme === 'dark'
      ? '<i class="fa-solid fa-sun" style="transform: scale(1.1);"></i>'
      : '<i class="fa-solid fa-moon" style="transform: rotate(-15deg);"></i>';
    toggle.addEventListener('click', () => {
      // Add a quick pulse animation class
      toggle.style.transform = 'scale(0.8)';
      setTimeout(() => { toggle.style.transform = ''; }, 150);

      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      
      setTimeout(() => {
        toggle.innerHTML = next === 'dark'
          ? '<i class="fa-solid fa-sun" style="transform: scale(1.1);"></i>'
          : '<i class="fa-solid fa-moon" style="transform: rotate(-15deg);"></i>';
      }, 150);
    });
  }

  Store.cart.updateUI();
  Store.wishlist.updateUI();
}

// Mobile bottom nav
function renderBottomNav() {
  if (document.getElementById('mobileBottomNav')) return;
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.id = 'mobileBottomNav';
  nav.className = 'mobile-bottom-nav';
  const links = [
    { href: 'index.html', icon: 'fa-house', label: 'Home' },
    { href: 'search.html', icon: 'fa-magnifying-glass', label: 'Search' },
    { href: 'spin-wheel.html', icon: 'fa-gift', label: 'Spin' },
    { href: 'cart.html', icon: 'fa-bag-shopping', label: 'Bag', badge: 'cart-count' },
    { href: 'wishlist.html', icon: 'fa-heart', label: 'Wish', badge: 'wishlist-count' },
  ];
  nav.innerHTML = links.map(l => `
    <a href="${l.href}" class="mobile-bottom-nav-item ${cur === l.href ? 'active' : ''}">
      <i class="fa-solid ${l.icon}"></i>
      ${l.badge ? `<span class="nav-badge ${l.badge}">0</span>` : ''}
      <span>${l.label}</span>
    </a>
  `).join('');
  document.body.appendChild(nav);
  Store.cart.updateUI();
  Store.wishlist.updateUI();
}

// Scroll reveal
function initScrollReveal() {
  const els = document.querySelectorAll('.section, .product-card, .reveal, .stat-card, .faq-item, .membership-card, .role-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible', 'reveal');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

function renderFooter() {
  const footerHTML = `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="nav-logo mb-3">
            <span class="nav-logo-text">Mantra<span style="color:var(--primary);">.</span></span>
          </a>
          <p class="footer-brand-desc">Your ultimate destination for premium fashion and lifestyle. Discover the latest trends, curated styles, and unparalleled quality.</p>
          <div class="footer-social">
            <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i class="fa-brands fa-instagram"></i></a>
            <a href="#"><i class="fa-brands fa-twitter"></i></a>
            <a href="#"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>
        
        <div>
          <h4 class="footer-col-title">Quick Links</h4>
          <div class="footer-links">
            <a href="men.html">Men's Fashion</a>
            <a href="women.html">Women's Fashion</a>
            <a href="kids.html">Kids Wear</a>
            <a href="beauty.html">Beauty & Grooming</a>
            <a href="living.html">Home & Living</a>
          </div>
        </div>
        
        <div>
          <h4 class="footer-col-title">Company</h4>
          <div class="footer-links">
            <a href="about.html">About Us</a>
            <a href="contact.html">Contact Us</a>
            <a href="faq.html">FAQ</a>
            <a href="terms.html">Terms & Conditions</a>
            <a href="privacy.html">Privacy Policy</a>
          </div>
        </div>
        
        <div>
          <h4 class="footer-col-title">Customer Support</h4>
          <div class="footer-links">
            <a href="track-order.html">Track Order</a>
            <a href="returns.html">Returns & Exchanges</a>
            <a href="shipping.html">Shipping Info</a>
            <a href="gift-cards.html">Gift Cards</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div>&copy; ${new Date().getFullYear()} Mantra. All rights reserved. Built with passion.</div>
        <div class="footer-payment-icons">
          <span>VISA</span>
          <span>MASTERCARD</span>
          <span>UPI</span>
          <span>PAYPAL</span>
        </div>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const iconMap = {
    'success': 'fa-circle-check',
    'error': 'fa-circle-xmark',
    'info': 'fa-circle-info',
    'warning': 'fa-triangle-exclamation'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type]} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

// Ensure init
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('nav') === null) renderNavbar();
  if (document.querySelector('footer') === null) renderFooter();
  renderBottomNav();
  initScrollReveal();

  // Auto-load AI assistant on all pages (except seller/admin dashboards)
  const page = window.location.pathname.split('/').pop();
  const excluded = ['seller-dashboard.html', 'admin.html'];
  if (!excluded.includes(page)) {
    loadScript('js/ai-assistant.js');
  }

  // Auto-load UI enhancements & Spin Popup
  loadScript('js/ui-enhancements.js');
  loadScript('js/spin-popup.js');
});

// Dynamic script loader (avoids duplicate loading)
function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.defer = true;
  document.body.appendChild(s);
}

