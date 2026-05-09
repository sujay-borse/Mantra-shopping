/* ================================================================
   MANTRA — SELLER DASHBOARD LOGIC
   ================================================================ */

// ── Mock Data ──────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD1001', customer: 'Rahul Sharma', product: 'Men Slim Fit Jeans', amount: 1899, status: 'Delivered', date: '05 May 2026' },
  { id: 'ORD1002', customer: 'Priya Patel',  product: 'Women Printed Kurta', amount: 1999, status: 'Shipped', date: '06 May 2026' },
  { id: 'ORD1003', customer: 'Amit Kumar',   product: 'Nike Running Shoes', amount: 3999, status: 'Processing', date: '07 May 2026' },
  { id: 'ORD1004', customer: 'Sneha Joshi',  product: 'MAC Lipstick', amount: 1950, status: 'Delivered', date: '07 May 2026' },
  { id: 'ORD1005', customer: 'Dev Malhotra', product: 'Comforter Blanket', amount: 1499, status: 'Pending', date: '08 May 2026' },
];

const STATUS_COLOR = {
  Delivered: '#00B057', Shipped: '#7c4dff',
  Processing: '#F5A623', Pending: '#FF3E6C', Cancelled: '#999',
};

// ── Seller product store ──────────────────────────────────────
const SellerStore = {
  getProducts: () => JSON.parse(localStorage.getItem('sellerProducts') || '[]'),
  saveProducts: (p) => localStorage.setItem('sellerProducts', JSON.stringify(p)),
  addProduct(p) {
    const list = this.getProducts();
    p.id = 'sp_' + Date.now();
    p.views = Math.floor(Math.random() * 500);
    p.sold = Math.floor(Math.random() * 80);
    p.status = 'Active';
    list.unshift(p);
    this.saveProducts(list);
    return p;
  },
  deleteProduct(id) {
    const list = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(list);
  },
};

// ── Tab switching ─────────────────────────────────────────────
window.switchTab = function (tab) {
  document.querySelectorAll('[id^="tab-"]').forEach(el => el.style.display = 'none');
  document.getElementById('tab-' + tab).style.display = 'block';
  document.querySelectorAll('.seller-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tab);
  });
};

// ── Stats ─────────────────────────────────────────────────────
function computeStats() {
  const products = SellerStore.getProducts();
  const totalRevenue = MOCK_ORDERS
    .filter(o => o.status === 'Delivered')
    .reduce((s, o) => s + o.amount, 0);
  const totalOrders = MOCK_ORDERS.length;
  const totalViews = products.reduce((s, p) => s + (p.views || 0), 0) + 12430;
  const conversion = totalOrders ? ((totalOrders / (totalViews + 1)) * 100).toFixed(1) : '3.4';

  document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('totalViews').textContent = (totalViews).toLocaleString('en-IN');
  document.getElementById('conversionRate').textContent = conversion + '%';
  document.getElementById('walletBalance').textContent = '₹' + Math.floor(totalRevenue * 0.85).toLocaleString('en-IN');
  document.getElementById('totalEarnings').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
}

// ── Charts ────────────────────────────────────────────────────
function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#a0a0c8' : '#555';

  // Revenue chart
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Revenue (₹)',
        data: [28000, 35000, 42000, 31000, 55000, 48000],
        borderColor: '#FF3E6C',
        backgroundColor: 'rgba(255,62,108,0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#FF3E6C',
        pointRadius: 4,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor, callback: v => '₹' + v.toLocaleString('en-IN') } },
      },
    },
  });

  // Category pie
  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: ['Men', 'Women', 'Kids', 'Beauty', 'Living'],
      datasets: [{
        data: [35, 28, 12, 15, 10],
        backgroundColor: ['#FF3E6C', '#7c4dff', '#F5A623', '#00B057', '#00e5ff'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: textColor } } },
      cutout: '65%',
    },
  });

  // Weekly sales
  new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Orders',
        data: [12, 19, 8, 22, 16, 28, 14],
        backgroundColor: 'rgba(124,77,255,0.7)',
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor } },
      },
    },
  });

  // Traffic doughnut
  new Chart(document.getElementById('trafficChart'), {
    type: 'pie',
    data: {
      labels: ['Organic', 'Social', 'Direct', 'Email', 'Paid Ads'],
      datasets: [{
        data: [40, 25, 18, 10, 7],
        backgroundColor: ['#FF3E6C', '#7c4dff', '#F5A623', '#00B057', '#00e5ff'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: textColor } } },
    },
  });

  // Product bar
  const products = SellerStore.getProducts().slice(0, 5);
  const labels = products.length ? products.map(p => p.name.substring(0, 20)) : ['Jeans', 'T-Shirt', 'Kurta', 'Shoes', 'Lipstick'];
  const data = products.length ? products.map(p => p.sold || 0) : [82, 65, 54, 40, 38];

  new Chart(document.getElementById('productChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Units Sold',
        data,
        backgroundColor: 'rgba(255,62,108,0.75)',
        borderRadius: 6,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { display: false }, ticks: { color: textColor } },
      },
    },
  });
}

// ── Products table ─────────────────────────────────────────────
function renderProductsTable() {
  const list = SellerStore.getProducts();
  const tbody = document.getElementById('productsTableBody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px;">No products yet. Add your first product!</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(p => `
    <tr>
      <td><b>${p.name}</b><br><small style="color:var(--text-muted)">${p.brand}</small></td>
      <td>${p.cat}</td>
      <td>₹${p.price} <s style="color:var(--text-muted);font-size:0.8em">₹${p.original}</s></td>
      <td>${p.stock || '—'}</td>
      <td><span style="background:${p.status==='Active'?'#E8F8EE':'#FFE8EE'};color:${p.status==='Active'?'#00B057':'#FF3E6C'};padding:3px 10px;border-radius:99px;font-size:0.8rem;font-weight:600;">${p.status}</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');
}

// ── Orders table ───────────────────────────────────────────────
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = MOCK_ORDERS.map(o => `
    <tr>
      <td><b>${o.id}</b></td>
      <td>${o.customer}</td>
      <td>${o.product}</td>
      <td>₹${o.amount}</td>
      <td><span style="background:${STATUS_COLOR[o.status]}22;color:${STATUS_COLOR[o.status]};padding:3px 10px;border-radius:99px;font-size:0.8rem;font-weight:600;">${o.status}</span></td>
      <td>${o.date}</td>
    </tr>
  `).join('');
}

// ── Add product ────────────────────────────────────────────────
window.addProduct = function () {
  const name = document.getElementById('newProductName').value.trim();
  const brand = document.getElementById('newProductBrand').value.trim();
  const price = +document.getElementById('newProductPrice').value;
  const original = +document.getElementById('newProductOriginal').value;
  const cat = document.getElementById('newProductCat').value;
  const stock = +document.getElementById('newProductStock').value;
  const desc = document.getElementById('newProductDesc').value.trim();

  if (!name || !price) { alert('Product name and price are required.'); return; }

  SellerStore.addProduct({ name, brand, price, original: original || price, cat, stock, desc });
  document.getElementById('addProductForm').style.display = 'none';
  renderProductsTable();
  showToast('Product added successfully!');
};

window.deleteProduct = function (id) {
  if (!confirm('Delete this product?')) return;
  SellerStore.deleteProduct(id);
  renderProductsTable();
  showToast('Product deleted', 'info');
};

// ── AI Tools ──────────────────────────────────────────────────
const AI_DESCS = {
  default: (name) => `Experience premium quality with our ${name}. Crafted from high-grade materials for maximum comfort and durability. Perfect for everyday wear with a modern fit that flatters all body types. Machine washable and fade-resistant. Order now and enjoy free delivery on orders above ₹999!`,
};

window.aiGenerateDesc = function () {
  const name = document.getElementById('aiDescProduct').value.trim() || 'this product';
  const result = document.getElementById('aiDescResult');
  result.style.display = 'block';
  result.textContent = 'Generating…';
  setTimeout(() => {
    result.textContent = AI_DESCS.default(name);
  }, 1000);
};

// Same from product form
window.generateAIDesc = function () {
  const name = document.getElementById('newProductName').value.trim() || 'this product';
  setTimeout(() => {
    document.getElementById('newProductDesc').value = AI_DESCS.default(name);
  }, 800);
  showToast('AI description generated!');
};

window.aiSuggestPrice = function () {
  const name = document.getElementById('aiPriceProduct').value.trim();
  const cost = +document.getElementById('aiPriceCost').value || 500;
  const result = document.getElementById('aiPriceResult');
  result.style.display = 'block';
  result.innerHTML = 'Analysing market…';
  setTimeout(() => {
    const suggested = Math.round(cost * (1.8 + Math.random() * 0.6));
    const mrp = Math.round(suggested * 1.5);
    result.innerHTML = `
      <b>Suggested Price:</b> ₹${suggested}<br>
      <b>MRP (strike price):</b> ₹${mrp}<br>
      <b>Margin:</b> ${Math.round(((suggested - cost) / suggested) * 100)}%<br>
      <small style="color:var(--text-muted)">Based on similar products in the market.</small>
    `;
  }, 1200);
};

window.aiGenerateSEO = function () {
  const kw = document.getElementById('aiSeoProduct').value.trim() || 'product';
  const result = document.getElementById('aiSeoResult');
  result.style.display = 'block';
  result.innerHTML = 'Generating…';
  setTimeout(() => {
    result.innerHTML = [
      `Buy ${kw} Online at Best Price in India | Mantra`,
      `Premium ${kw} — Free Delivery | Mantra Fashion`,
      `${kw} — Top Brands, Lowest Prices | Shop Now`,
    ].map(t => `<div style="padding:6px 0;border-bottom:1px solid var(--border);">📌 ${t}</div>`).join('');
  }, 900);
};

// Inventory alerts
function renderInventoryAlerts() {
  const products = SellerStore.getProducts();
  const el = document.getElementById('inventoryAlerts');
  const lowStock = products.filter(p => (p.stock || 0) < 10);
  if (!lowStock.length) {
    el.innerHTML = '<p style="color:var(--success)"><i class="fa-solid fa-circle-check"></i> All products have healthy stock levels.</p>';
  } else {
    el.innerHTML = lowStock.map(p => `
      <div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
        <span>⚠️ <b>${p.name}</b></span>
        <span style="color:var(--error);font-weight:600;">${p.stock} left</span>
      </div>
    `).join('');
  }
}

// ── Wallet ────────────────────────────────────────────────────
window.requestWithdraw = function () {
  const amt = +document.getElementById('withdrawAmount').value;
  const acc = document.getElementById('withdrawAccount').value.trim();
  if (amt < 500) { showToast('Minimum withdrawal is ₹500', 'error'); return; }
  if (!acc) { showToast('Please enter account/UPI details', 'error'); return; }
  showToast(`₹${amt} withdrawal requested successfully!`);
};

// ── Logout ─────────────────────────────────────────────────────
window.logoutSeller = function () {
  if (typeof Store !== 'undefined') Store.auth.logout();
  window.location.href = 'login.html';
};

// ── Toast (standalone) ─────────────────────────────────────────
function showToast(msg, type = 'success') {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
  t.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-circle-check'} toast-icon"></i><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Auth check
  const user = JSON.parse(localStorage.getItem('auth_user') || 'null');
  if (user) document.getElementById('sellerName').textContent = `Welcome, ${user.name}! 👋`;

  // Dark mode
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const tog = document.getElementById('themeToggle');
  if (tog) {
    tog.innerHTML = saved === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    tog.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      tog.innerHTML = next === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }

  computeStats();
  initCharts();
  renderProductsTable();
  renderOrdersTable();
  renderInventoryAlerts();
});
