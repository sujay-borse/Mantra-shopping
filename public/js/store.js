const Store = {
  get: (k, d = []) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  },

  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),

  cart: {
    items: () => Store.get('cart', []),

    add(p, qty = 1, size = 'M') {
      const c = Store.cart.items();
      const i = c.findIndex((x) => x.id === p.id && x.size === size);

      if (i > -1) {
        c[i].qty += qty;
      } else {
        c.push({ ...p, qty, size });
      }

      Store.set('cart', c);
      Store.cart.updateUI();
    },

    remove(id, size) {
      const newCart = Store.cart
        .items()
        .filter((x) => !(x.id === id && x.size === size));
      Store.set('cart', newCart);
      Store.cart.updateUI();
    },

    updateQty(id, size, qty) {
      const c = Store.cart.items();
      const i = c.findIndex((x) => x.id === id && x.size === size);

      if (i > -1) {
        if (qty < 1) {
          Store.cart.remove(id, size);
        } else {
          c[i].qty = qty;
          Store.set('cart', c);
          Store.cart.updateUI();
        }
      }
    },

    clear() {
      Store.set('cart', []);
      Store.cart.updateUI();
    },

    count() {
      return Store.cart.items().reduce((s, x) => s + x.qty, 0);
    },

    total() {
      return Store.cart.items().reduce((s, x) => s + x.price * x.qty, 0);
    },

    updateUI() {
      document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = Store.cart.count();
      });
    },
  },

  wishlist: {
    items: () => Store.get('wishlist', []),

    toggle(p) {
      const w = Store.wishlist.items();
      const i = w.findIndex((x) => x.id === p.id);

      if (i > -1) {
        w.splice(i, 1);
      } else {
        w.push(p);
      }

      Store.set('wishlist', w);
      Store.wishlist.updateUI();
      return i === -1;
    },

    has(id) {
      return Store.wishlist.items().some((x) => x.id === id);
    },

    updateUI() {
      document.querySelectorAll('.wishlist-count').forEach((el) => {
        el.textContent = Store.wishlist.items().length;
      });
    },
  },

  auth: {
    login(name, email, role = 'user', token = null) {
      Store.set('auth_user', {
        name,
        email,
        role,
        token: token || 'tok_' + Date.now(),
      });
      return true;
    },

    logout() {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('sellerProducts'); // clean seller data on logout
    },

    user: () => Store.get('auth_user', null),
    isLoggedIn: () => !!Store.get('auth_user', null),
  },

  orders: {
    list: () => Store.get('orders', []),

    add(o) {
      const orders = Store.orders.list();
      orders.unshift({
        ...o,
        id: 'ORD' + Date.now(),
        date: new Date().toISOString(),
      });
      Store.set('orders', orders);
    },
  },

  recentlyViewed: {
    add(p) {
      const rv = Store.get('rv', []);
      const f = rv.filter((x) => x.id !== p.id);
      f.unshift(p);
      Store.set('rv', f.slice(0, 8));
    },

    get: () => Store.get('rv', []),
  },
};

const COUPONS = {
  MANTRA10: { pct: 10, min: 999 },
  SAVE20: { pct: 20, min: 1999 },
  FLAT50: { flat: 50 },
};

function applyCoupon(code, total) {
  const c = COUPONS[code.toUpperCase()];

  if (!c) {
    return { ok: false, msg: 'Invalid coupon' };
  }

  if (c.min && total < c.min) {
    return { ok: false, msg: `Min order ₹${c.min}` };
  }

  const disc = c.flat ? c.flat : Math.round((total * c.pct) / 100);

  return {
    ok: true,
    discount: disc,
    msg: `Saved ₹${disc}!`,
  };
}
