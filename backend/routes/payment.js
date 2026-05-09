const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

// POST /api/payment/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!razorpay) {
      return res.json({ stub: true, message: 'Add Razorpay keys to .env to activate payments', orderId: 'stub_order_' + Date.now() });
    }
    const order = await razorpay.orders.create({ amount: amount * 100, currency, receipt: receipt || `rcpt_${Date.now()}` });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!process.env.RAZORPAY_KEY_SECRET) return res.json({ verified: true, stub: true });

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expected !== razorpay_signature) return res.status(400).json({ error: 'Payment verification failed' });

    await Order.findByIdAndUpdate(orderId, { status: 'Processing', paymentId: razorpay_payment_id });
    res.json({ verified: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
