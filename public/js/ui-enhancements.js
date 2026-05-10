/* ================================================================
   MANTRA — UI ENHANCEMENTS + SEARCH FIX
   Scroll reveal, parallax, smooth page transitions, search fix
   ================================================================ */

// ── Fix search page: uses all products flat ──────────────────
function getAllProducts() {
  if (typeof PRODUCTS !== 'undefined') return PRODUCTS;
  return [];
}

// ── Smooth page transition ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

  // Intercept nav clicks for smooth out
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || link.target === '_blank') return;
    e.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 280);
  });
});

// ── Product card tilt (desktop) ───────────────────────────────
function initCardTilt() {
  if (window.innerWidth < 1024) return;
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 12;
      const y = ((e.clientY - top) / height - 0.5) * -12;
      card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ── Parallax hero ─────────────────────────────────────────────
function initParallax() {
  const hero = document.querySelector('.hero, .page-header, .about-hero');
  if (!hero || window.innerWidth < 768) return;
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = `${window.scrollY * 0.4}px`;
  }, { passive: true });
}

// ── Sticky "Add to Cart" bar on product detail (mobile) ───────
function initStickyCart() {
  const addBtn = document.getElementById('mainAddToCartBtn');
  if (!addBtn || window.innerWidth > 768) return;
  const sticky = document.createElement('div');
  sticky.style.cssText = `
    position:fixed;bottom:70px;left:0;right:0;z-index:500;
    background:var(--white);border-top:1px solid var(--border);
    padding:10px 16px;box-shadow:0 -4px 20px rgba(0,0,0,0.1);
    display:none;
  `;
  sticky.innerHTML = `<button class="btn btn-primary btn-full" onclick="document.getElementById('mainAddToCartBtn').click()">
    <i class="fa-solid fa-bag-shopping"></i> Add to Bag
  </button>`;
  document.body.appendChild(sticky);

  const observer = new IntersectionObserver((entries) => {
    sticky.style.display = entries[0].isIntersecting ? 'none' : 'block';
  }, { threshold: 0 });
  observer.observe(addBtn);
}

// ── Search autocomplete suggestions ─────────────────────────
function initSearchSuggestions() {
  const inputs = document.querySelectorAll('.nav-search-input');
  if (!inputs.length || typeof PRODUCTS === 'undefined') return;

  inputs.forEach(input => {
    let box;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (box) box.remove();
      if (!q || q.length < 2) return;

      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 5);

      if (!matches.length) return;

      box = document.createElement('div');
      box.style.cssText = `
        position:absolute;top:calc(100% + 6px);left:0;right:0;
        background:var(--white);border:1px solid var(--border);
        border-radius:var(--radius-sm);box-shadow:var(--shadow-md);
        z-index:2000;overflow:hidden;
      `;
      box.innerHTML = matches.map(p => `
        <a href="product-details.html?id=${p.id}" style="display:flex;align-items:center;gap:12px;padding:10px 14px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--border);" onmouseover="this.style.background='var(--bg)'" onmouseout="this.style.background=''">
          <img src="${p.img}" style="width:36px;height:44px;object-fit:cover;border-radius:4px;" loading="lazy">
          <div>
            <div style="font-size:0.875rem;font-weight:600;">${p.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${p.brand} · ₹${p.price}</div>
          </div>
        </a>
      `).join('') + `<a href="search.html?q=${encodeURIComponent(q)}" style="display:block;padding:10px 14px;font-size:0.8125rem;color:var(--primary);font-weight:600;text-decoration:none;">See all results for "${q}"</a>`;

      const wrap = input.closest('.nav-search');
      if (wrap) { wrap.style.position = 'relative'; wrap.appendChild(box); }
    });

    document.addEventListener('click', (e) => {
      if (box && !input.contains(e.target) && !box.contains(e.target)) box.remove();
    });
  });
}

// ── Init all ─────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCardTilt();
    initParallax();
    initStickyCart();
    initSearchSuggestions();
  });
} else {
  initCardTilt();
  initParallax();
  initStickyCart();
  initSearchSuggestions();
}
