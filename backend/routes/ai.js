const express = require('express');
const OpenAI = require('openai');
const { protect } = require('../middleware/auth');
const router = express.Router();

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are Mantra AI, a friendly shopping assistant for Mantra — a premium Indian fashion & lifestyle ecommerce platform. 
Help users find products, get size recommendations, track orders, and get gift ideas. Keep responses under 80 words, warm and helpful.`;

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!openai) return res.json({ reply: 'OpenAI key not configured. Add OPENAI_API_KEY to .env to activate AI.', stub: true });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-8),
        { role: 'user', content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/product-desc  (Seller tool)
router.post('/product-desc', async (req, res) => {
  try {
    const { productName, category, price } = req.body;
    if (!openai) {
      return res.json({
        description: `Experience premium quality with our ${productName}. Crafted from high-grade materials for maximum comfort and durability. Perfect for everyday wear. Free delivery available!`,
        stub: true,
      });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Write a compelling 60-word ecommerce product description for: "${productName}" in category "${category}" priced at ₹${price}. Make it engaging and highlight quality, fit, and value.`,
      }],
      max_tokens: 100,
    });
    res.json({ description: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/seo-titles
router.post('/seo-titles', async (req, res) => {
  try {
    const { productName, keywords } = req.body;
    if (!openai) {
      return res.json({ titles: [
        `Buy ${productName} Online at Best Price | Mantra`,
        `Premium ${productName} — Free Delivery | Mantra Fashion`,
      ], stub: true });
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Generate 3 SEO-optimized ecommerce titles for product: "${productName}". Keywords: ${keywords}. Each title under 65 chars.` }],
      max_tokens: 120,
    });
    const titles = completion.choices[0].message.content.split('\n').filter(Boolean);
    res.json({ titles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
