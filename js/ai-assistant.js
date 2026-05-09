/* ================================================================
   MANTRA AI SHOPPING ASSISTANT
   Uses OpenAI API when key is set; falls back to smart rule-based replies.
   To activate: set window.OPENAI_KEY = 'sk-...' before loading this script.
   ================================================================ */

(function () {
  'use strict';

  // ── Suggested prompts ──────────────────────────────────────────
  const PROMPTS = [
    'Help me choose',
    'Gift ideas',
    'Best deals today',
    'Size guide',
    'Track my order',
  ];

  // ── Rule-based fallback responses ──────────────────────────────
  const RULES = [
    { match: /(gift|present|birthday)/i, reply: '🎁 Great choice! For gifts, check out our <a href="gift-cards.html" style="color:#7c4dff">Gift Cards</a> or explore <a href="women.html" style="color:#7c4dff">Women\'s</a> and <a href="living.html" style="color:#7c4dff">Home & Living</a> collections — always a hit!' },
    { match: /(size|fit|measurement)/i, reply: '📏 Our standard sizing: S (36), M (38), L (40), XL (42), XXL (44). For footwear, we follow Indian sizing. When in doubt, go one size up for a relaxed fit!' },
    { match: /(deal|offer|discount|sale|coupon)/i, reply: '🔥 Hot deals live now! Use coupon <b>MANTRA10</b> for 10% off or <b>SAVE20</b> for 20% off on orders above ₹1999. Check the <a href="home.html#flash" style="color:#7c4dff">Flash Sale</a> section too!' },
    { match: /(track|order|status|delivery)/i, reply: '📦 You can track your order on the <a href="track-order.html" style="color:#7c4dff">Track Order</a> page. Enter your Order ID and email. Standard delivery: 3-5 days. Express: 1-2 days.' },
    { match: /(return|refund|exchange)/i, reply: '↩️ We offer a hassle-free 14-day return policy. Visit <a href="returns.html" style="color:#7c4dff">Returns & Exchanges</a> to start a return. Refunds are processed in 5-7 business days.' },
    { match: /(men|shirt|jeans|jacket)/i, reply: '👔 Explore our <a href="men.html" style="color:#7c4dff">Men\'s Collection</a> — T-shirts from ₹699, jeans from ₹1899, and jackets from ₹4599. All top brands!' },
    { match: /(women|dress|kurta|saree)/i, reply: '👗 Our <a href="women.html" style="color:#7c4dff">Women\'s Collection</a> has everything — kurtas, dresses, western wear, and ethnic. Prices from ₹899!' },
    { match: /(kids|child|baby)/i, reply: '🧒 Check out our adorable <a href="kids.html" style="color:#7c4dff">Kids Collection</a>! Comfortable, durable, and stylish for ages 0-16. Prices from ₹499.' },
    { match: /(beauty|makeup|skincare|lipstick)/i, reply: '💄 Explore <a href="beauty.html" style="color:#7c4dff">Beauty & Grooming</a>! MAC, Loreal, Maybelline, Nykaa — all authentic. Skincare, makeup, and grooming essentials.' },
    { match: /(home|decor|curtain|bedsheet|living)/i, reply: '🛋️ Upgrade your space with our <a href="living.html" style="color:#7c4dff">Home & Living</a> collection. Bedsheets, towels, curtains, mugs and more!' },
    { match: /(payment|pay|razorpay|upi|cod)/i, reply: '💳 We accept UPI, Credit/Debit Cards (Visa, Mastercard), and Cash on Delivery. All payments are 100% secure. COD available on most pin codes.' },
    { match: /(spin|wheel|reward|points)/i, reply: '🎡 Try your luck on the <a href="spin-wheel.html" style="color:#7c4dff">Spin & Win</a> wheel! Spin daily to win discounts, cashback, and mystery gifts!' },
    { match: /(membership|premium|pro|subscribe)/i, reply: '⭐ Our <a href="membership.html" style="color:#7c4dff">Premium Membership</a> gives you early sale access, express delivery priority, exclusive discounts, and AI features. Plans start at ₹99/month!' },
    { match: /(sell|seller|sell on|become a seller)/i, reply: '🏪 Want to sell on Mantra? <a href="signup.html" style="color:#7c4dff">Sign up as a Seller</a> and get access to your full dashboard with analytics, AI tools, and more!' },
    { match: /(hi|hello|hey|namaste)/i, reply: '👋 Hello! I\'m Mantra AI, your personal shopping assistant. I can help you find products, deals, track orders, or recommend gifts. What can I help you with today?' },
  ];

  // ── Chat history ───────────────────────────────────────────────
  let chatHistory = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
  let isOpen = false;

  // ── Inject HTML ────────────────────────────────────────────────
  function inject() {
    const wrap = document.createElement('div');
    wrap.style.display = 'none'; // Prevent Flash of Unstyled Content (FOUC)

    // Add CSS
    const existingLink = document.getElementById('ai-css');
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = 'ai-css';
      link.rel = 'stylesheet';
      link.href = 'css/ai-assistant.css';
      link.onload = () => { wrap.style.display = ''; };
      document.head.appendChild(link);
    } else {
      wrap.style.display = '';
    }

    const html = `
      <button id="ai-chat-btn" title="AI Shopping Assistant">
        <div class="ai-pulse"></div>
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </button>

      <div id="ai-chat-window">
        <div class="ai-chat-header">
          <div class="ai-avatar"><i class="fa-solid fa-robot"></i></div>
          <div>
            <div class="ai-chat-title">Mantra AI</div>
            <div class="ai-chat-status">● Online — here to help</div>
          </div>
          <button class="ai-chat-close" id="aiClose"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="ai-chat-messages" id="aiMessages"></div>

        <div class="ai-prompts" id="aiPrompts">
          ${PROMPTS.map(p => `<span class="ai-prompt-chip" data-prompt="${p}">${p}</span>`).join('')}
        </div>

        <div class="ai-chat-input">
          <input type="text" id="aiInput" placeholder="Ask me anything…">
          <button class="ai-send-btn" id="aiSend"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>
    `;

    wrap.innerHTML = html;
    document.body.appendChild(wrap);

    // Render saved history
    if (chatHistory.length === 0) {
      addBotMsg('👋 Hi! I\'m Mantra AI. I can help you find products, deals, track orders, and much more. What are you looking for today?');
    } else {
      chatHistory.forEach(m => renderMsg(m.text, m.role, false));
    }

    bindEvents();
  }

  // ── Bind events ────────────────────────────────────────────────
  function bindEvents() {
    document.getElementById('ai-chat-btn').addEventListener('click', toggle);
    document.getElementById('aiClose').addEventListener('click', close);
    document.getElementById('aiSend').addEventListener('click', sendMsg);
    document.getElementById('aiInput').addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMsg();
    });
    document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.getElementById('aiInput').value = chip.dataset.prompt;
        sendMsg();
      });
    });
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    isOpen = true;
    document.getElementById('ai-chat-window').classList.add('open');
    document.getElementById('aiInput').focus();
    scrollToBottom();
  }

  function close() {
    isOpen = false;
    document.getElementById('ai-chat-window').classList.remove('open');
  }

  function scrollToBottom() {
    const msgs = document.getElementById('aiMessages');
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ── Render a message bubble ─────────────────────────────────────
  function renderMsg(text, role, save = true) {
    const el = document.createElement('div');
    el.className = `ai-msg ${role}`;
    el.innerHTML = text;
    document.getElementById('aiMessages').appendChild(el);
    scrollToBottom();
    if (save) {
      chatHistory.push({ text, role });
      localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory.slice(-30)));
    }
  }

  function addBotMsg(text, save = true) {
    renderMsg(text, 'bot', save);
  }

  function showTyping() {
    const el = document.createElement('div');
    el.id = 'aiTyping';
    el.className = 'ai-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('aiMessages').appendChild(el);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('aiTyping');
    if (el) el.remove();
  }

  // ── Send message ───────────────────────────────────────────────
  async function sendMsg() {
    const input = document.getElementById('aiInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    renderMsg(text, 'user');
    showTyping();

    // Hide prompts after first user message
    document.getElementById('aiPrompts').style.display = 'none';

    try {
      const reply = await getReply(text);
      hideTyping();
      addBotMsg(reply);
    } catch {
      hideTyping();
      addBotMsg('⚠️ Sorry, I ran into a problem. Please try again!');
    }
  }

  // ── Get reply (OpenAI or rule-based) ───────────────────────────
  async function getReply(userMsg) {
    const key = window.OPENAI_KEY || '';

    if (key) {
      // Real OpenAI call
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are Mantra AI, a friendly shopping assistant for Mantra — a premium Indian fashion & lifestyle ecommerce website. Help users find products, deals, track orders, and get size recommendations. Keep replies under 80 words. Be warm, helpful and concise.',
            },
            ...chatHistory.slice(-8).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text.replace(/<[^>]+>/g, '') })),
            { role: 'user', content: userMsg },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || fallback(userMsg);
    }

    // Simulate a brief delay for rule-based
    await new Promise(r => setTimeout(r, 700));
    return fallback(userMsg);
  }

  function fallback(msg) {
    for (const rule of RULES) {
      if (rule.match.test(msg)) return rule.reply;
    }
    return `🔍 Great question! Try browsing our collections: <a href="men.html" style="color:#7c4dff">Men</a>, <a href="women.html" style="color:#7c4dff">Women</a>, <a href="kids.html" style="color:#7c4dff">Kids</a>, <a href="beauty.html" style="color:#7c4dff">Beauty</a>, or <a href="living.html" style="color:#7c4dff">Home & Living</a>. Or use the <a href="search.html" style="color:#7c4dff">search bar</a> to find exactly what you need!`;
  }

  // ── Init ───────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
