const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

// In-memory reward store (replace with Mongoose model in production)
const REWARDS_DB = new Map();

// GET /api/rewards
router.get('/', protect, (req, res) => {
  const uid = req.user._id.toString();
  res.json({ rewards: REWARDS_DB.get(uid) || [] });
});

// POST /api/rewards/spin
router.post('/spin', protect, (req, res) => {
  const uid = req.user._id.toString();
  const today = new Date().toDateString();
  const rewards = REWARDS_DB.get(uid) || [];
  const lastSpin = rewards[0]?.date;

  if (lastSpin && new Date(lastSpin).toDateString() === today) {
    return res.status(429).json({ error: 'Already spun today. Come back tomorrow!' });
  }

  const SEGMENTS = [
    { label: '10% OFF', code: 'SPIN10', type: 'coupon' },
    { label: 'Free Ship', code: 'FREESHIP', type: 'shipping' },
    { label: '50 Points', code: null, type: 'points', points: 50 },
    { label: '20% OFF', code: 'SPIN20', type: 'coupon' },
    { label: 'Try Again', code: null, type: 'retry' },
    { label: '5% Cash', code: 'CASH5', type: 'cashback' },
    { label: '100 Points', code: null, type: 'points', points: 100 },
    { label: 'Mystery Gift', code: 'MYSTERY', type: 'gift' },
  ];

  const winner = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];
  const reward = { ...winner, date: new Date().toISOString(), id: Date.now() };
  rewards.unshift(reward);
  REWARDS_DB.set(uid, rewards.slice(0, 20));

  res.json({ reward, canSpinAgain: false });
});

module.exports = router;
