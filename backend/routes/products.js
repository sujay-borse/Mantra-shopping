const express = require('express');
const Product = require('../models/Product');
const { protect, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET /api/products?category=&sort=&page=&limit=
router.get('/', async (req, res) => {
  try {
    const { category, sort, page = 1, limit = 20, search, brand, minPrice, maxPrice } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = +minPrice;
    if (maxPrice) filter.price.$lte = +maxPrice;
    if (search) filter.$text = { $search: search };

    const sortMap = { 'price-asc': { price: 1 }, 'price-desc': { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 } };
    const sortObj = sortMap[sort] || { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip((page - 1) * limit).limit(+limit),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products  (Seller only)
router.post('/', protect, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, requireRole('seller', 'admin'), async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
