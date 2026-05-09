const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// GET /api/membership
router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('membership membershipExp');
  res.json({ plan: user.membership, expiry: user.membershipExp, isActive: user.membershipExp > new Date() });
});

// POST /api/membership/subscribe
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan, paymentId } = req.body;
    const validPlans = { basic: 0, pro: 99, premium: 299 };
    if (!validPlans[plan]) return res.status(400).json({ error: 'Invalid plan' });

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    await User.findByIdAndUpdate(req.user._id, { membership: plan, membershipExp: expiry });
    res.json({ plan, expiry, message: `Subscribed to ${plan} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
