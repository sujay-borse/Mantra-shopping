class ProductManager {
  constructor(products, containerId) {
    this.allProducts = products;
    this.filteredProducts = [...products];
    this.container = document.getElementById(containerId);
    this.countEl = document.getElementById('productCount');

    this.filters = {
      brands: [],
      priceMax: 10000,
      rating: 0,
      search: '',
    };
    this.sortBy = 'relevance';
  }

  applyFilters() {
    let result = this.allProducts.filter((p) => {
      // Brand filter
      if (
        this.filters.brands.length > 0 &&
        !this.filters.brands.includes(p.brand)
      ) {
        return false;
      }
      // Price filter
      if (p.price > this.filters.priceMax) {
        return false;
      }
      // Rating filter
      if (p.rating < this.filters.rating) {
        return false;
      }
      // Search filter
      if (
        this.filters.search &&
        !p.name.toLowerCase().includes(this.filters.search.toLowerCase()) &&
        !p.brand.toLowerCase().includes(this.filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    // Sort
    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Mock newest sort (just reverse)
        result.reverse();
        break;
    }

    this.filteredProducts = result;
    this.render();
  }

  render() {
    if (this.countEl) {
      this.countEl.textContent = `${this.filteredProducts.length} Products`;
    }

    if (this.filteredProducts.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state col-span-4">
          <i class="fa-solid fa-box-open empty-state-icon"></i>
          <h3>No Products Found</h3>
          <p>Try adjusting your filters or search criteria.</p>
          <button class="btn btn-outline mt-4" onclick="location.reload()">Clear Filters</button>
        </div>
      `;
      return;
    }

    renderProductsGrid(this.container.id, this.filteredProducts);
  }
}

function renderProductsGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const wishlistSet = new Set(Store.wishlist.items().map((x) => x.id));

  container.innerHTML = products
    .map((p) => {
      const discount = Math.round(((p.original - p.price) / p.original) * 100);
      const isW = wishlistSet.has(p.id);

      let badge = '';
      if (p.tag) {
        badge = `<div class="badge badge-overlay badge-${
          p.tag === 'Sale' ? 'sale' : 'new'
        }">${p.tag}</div>`;
      }

      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(p.rating)) {
          stars += '<i class="fa-solid fa-star"></i>';
        } else if (
          i === Math.ceil(p.rating) &&
          !Number.isInteger(p.rating)
        ) {
          stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
          stars += '<i class="fa-solid fa-star empty"></i>';
        }
      }

      return `
      <div class="product-card">
        ${badge}
        <button class="product-card-wishlist ${isW ? 'active' : ''}" 
                onclick="toggleWishlist('${p.id}', this, event)">
          <i class="fa-${isW ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <div class="product-card-img-wrap" onclick="window.location.href='product-details.html?id=${p.id}'">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <div class="product-card-img-hover">
            <img src="${p.img}?t=2" alt="${p.name} Hover" loading="lazy">
          </div>
          <div class="product-card-actions" onclick="event.stopPropagation()">
            <button class="btn btn-primary" onclick="addToCart('${p.id}')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
          </div>
        </div>
        <div class="product-card-body" onclick="window.location.href='product-details.html?id=${p.id}'">
          <div class="product-card-brand">${p.brand}</div>
          <div class="product-card-name" title="${p.name}">${p.name}</div>
          <div class="product-card-rating">
            <div class="rating-stars">${stars}</div>
            <span class="rating-count">(${p.count})</span>
          </div>
          <div class="product-card-price">
            <span class="price-current">₹${p.price}</span>
            ${
              p.original > p.price
                ? `<span class="price-original">₹${p.original}</span>
                   <span class="price-discount">(${discount}% OFF)</span>`
                : ''
            }
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

function addToCart(id, qty = 1, size = 'M') {
  const p = getProduct(id);
  if (p) {
    Store.cart.add(p, qty, size);
    showToast(`Added ${p.name} to bag`);
  }
}

function toggleWishlist(id, btnEl, e) {
  if (e) e.stopPropagation();
  const p = getProduct(id);
  if (p) {
    const isAdded = Store.wishlist.toggle(p);
    if (btnEl) {
      if (isAdded) {
        btnEl.classList.add('active');
        btnEl.innerHTML = '<i class="fa-solid fa-heart"></i>';
        showToast('Added to wishlist');
      } else {
        btnEl.classList.remove('active');
        btnEl.innerHTML = '<i class="fa-regular fa-heart"></i>';
        showToast('Removed from wishlist');
      }
    }
  }
}

// Global mobile filter toggle
function initMobileFilter() {
  const btn = document.getElementById('mobileFilterBtn');
  const sidebar = document.getElementById('filterSidebar');
  
  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    
    // Close when clicking outside
    sidebar.addEventListener('click', (e) => {
      if(e.target === sidebar) sidebar.classList.remove('open');
    });
  }
}
