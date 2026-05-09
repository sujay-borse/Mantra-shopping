const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/seller/dashboard  — Seller stats
router.get('/dashboard', protect, requireRole('seller'), async (req, res) => {
  try {
    const [products, orders] = await Promise.all([
      Product.find({ seller: req.user._id, isActive: true }),
      Order.find({ 'items.product': { $in: await Product.find({ seller: req.user._id }).select('_id') } }),
    ]);

    const revenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
    const totalViews = products.reduce((s, p) => s + (p.views || 0), 0);
    const conversionRate = orders.length ? ((orders.length / (totalViews || 1)) * 100).toFixed(1) : 0;

    res.json({ revenue, orders: orders.length, products: products.length, views: totalViews, conversionRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/seller/products
router.get('/products', protect, requireRole('seller'), async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json({ products });
});

// GET /api/seller/orders
router.get('/orders', protect, requireRole('seller'), async (req, res) => {
  const myProductIds = await Product.find({ seller: req.user._id }).distinct('_id');
  const orders = await Order.find({ 'items.product': { $in: myProductIds } }).sort('-createdAt');
  res.json({ orders });
});

module.exports = router;
