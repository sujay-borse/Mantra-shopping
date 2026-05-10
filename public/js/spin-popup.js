/* ================================================================
   MANTRA — SPIN WHEEL POPUP (Global Feature)
   Injects an interactive canvas spin wheel popup after 4 seconds
   ================================================================ */

window.openSpinPopup = function() {
  initSpinPopup();
};

function initSpinPopup() {
  // Prevent duplicate injections
  if (document.getElementById('spinPopupModal')) return;

  // 1. Inject CSS for the popup
  const style = document.createElement('style');
  style.textContent = `
    .spin-popup-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; opacity: 0; visibility: hidden;
      transition: all 0.4s ease;
    }
    .spin-popup-overlay.show { opacity: 1; visibility: visible; }
    
    .spin-popup-content {
      background: var(--surface, #ffffff);
      padding: 32px; border-radius: var(--radius-lg, 20px);
      width: 90%; max-width: 420px; position: relative;
      text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      transform: scale(0.9) translateY(20px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid var(--border, #ebebeb);
    }
    [data-theme="dark"] .spin-popup-content {
      background: var(--surface, #151522); border-color: var(--border, rgba(255,255,255,0.1));
      box-shadow: 0 0 30px rgba(245, 0, 87, 0.2);
    }
    .spin-popup-overlay.show .spin-popup-content { transform: scale(1) translateY(0); }
    
    .spin-popup-close {
      position: absolute; top: 16px; right: 16px; background: none; border: none;
      font-size: 1.5rem; color: var(--text-muted, #999); cursor: pointer; transition: 0.3s;
    }
    .spin-popup-close:hover { color: var(--error, #ff1744); transform: rotate(90deg); }
    
    .spin-popup-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; color: var(--text, #222); }
    .spin-popup-desc { font-size: 0.9375rem; color: var(--text-secondary, #555); margin-bottom: 24px; }
    
    .spin-popup-canvas-wrap { position: relative; width: 280px; height: 280px; margin: 0 auto 24px; }
    .spin-popup-pointer {
      position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
      width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent;
      border-top: 25px solid var(--primary, #f50057); z-index: 10; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .spin-popup-btn {
      background: var(--primary, #f50057); color: #fff; border: none; padding: 14px 32px;
      font-size: 1.0625rem; font-weight: 700; border-radius: 99px; cursor: pointer;
      width: 100%; transition: 0.3s; box-shadow: 0 8px 20px rgba(245, 0, 87, 0.3);
    }
    .spin-popup-btn:hover { background: var(--primary-dark, #c51162); transform: translateY(-2px); }
    .spin-popup-btn:disabled { background: #999; cursor: not-allowed; transform: none; box-shadow: none; }
    
    .spin-popup-result { display: none; margin-top: 16px; animation: scaleIn 0.5s ease forwards; }
    .spin-popup-code {
      background: var(--bg, #f8f8f8); padding: 12px; border-radius: 8px; font-weight: 800;
      font-size: 1.25rem; letter-spacing: 2px; color: var(--primary, #f50057);
      border: 2px dashed var(--primary, #f50057); margin-top: 12px; user-select: all;
    [data-theme="dark"] .spin-popup-code { background: rgba(0,0,0,0.3); }
    
    @keyframes scaleIn {
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // 2. Inject HTML
  const html = `
    <div id="spinPopupModal" class="spin-popup-overlay">
      <div class="spin-popup-content">
        <button class="spin-popup-close" id="spinPopupClose"><i class="fa-solid fa-xmark"></i></button>
        <h2 class="spin-popup-title">Feeling Lucky? 🎁</h2>
        <p class="spin-popup-desc">Spin the wheel to unlock an exclusive reward for your purchase today!</p>
        
        <div class="spin-popup-canvas-wrap">
          <div class="spin-popup-pointer"></div>
          <canvas id="spinPopupCanvas" width="280" height="280"></canvas>
        </div>
        
        <button id="spinPopupBtn" class="spin-popup-btn">SPIN THE WHEEL</button>
        
        <div id="spinPopupResult" class="spin-popup-result">
          <h3 id="spinPopupWinLabel" style="font-size:1.125rem; margin-bottom:8px;"></h3>
          <p id="spinPopupWinDesc" style="font-size:0.875rem; color:var(--text-secondary);"></p>
          <div id="spinPopupCode" class="spin-popup-code"></div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // 3. Setup Canvas & Logic
  const canvas = document.getElementById('spinPopupCanvas');
  const btn = document.getElementById('spinPopupBtn');
  const closeBtn = document.getElementById('spinPopupClose');
  const modal = document.getElementById('spinPopupModal');
  
  const SEGMENTS = [
    { label: '10% OFF', code: 'MANTRA10', color: '#f50057' },
    { label: 'Free Ship', code: 'FREESHIP', color: '#7c4dff' },
    { label: 'Buy 1 Get 1', code: 'BOGO', color: '#F5A623' },
    { label: '20% OFF', code: 'MANTRA20', color: '#00B057' },
    { label: 'Next Time', code: null, color: '#999999' },
    { label: '₹100 OFF', code: 'FLAT100', color: '#00e5ff' },
  ];
  
  // Check daily limit
  function hasSpunToday() {
    const d = JSON.parse(localStorage.getItem('spinData') || '{}');
    return d.lastSpin === new Date().toDateString();
  }
  
  if (hasSpunToday()) {
    btn.disabled = true;
    btn.textContent = 'ALREADY SPUN TODAY';
    btn.style.background = '#999';
  }
  
  const NUM = SEGMENTS.length;
  const ARC = (2 * Math.PI) / NUM;
  let currentAngle = 0;
  let spinning = false;

  function drawWheel(angle) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const cx = size / 2, cy = size / 2, r = cx - 4;
    ctx.clearRect(0, 0, size, size);

    SEGMENTS.forEach((seg, i) => {
      const startA = angle + i * ARC;
      const endA = startA + ARC;
      const midA = startA + ARC / 2;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx + (r * 0.65) * Math.cos(midA), cy + (r * 0.65) * Math.sin(midA));
      ctx.rotate(midA + Math.PI / 2);
      ctx.font = `bold ${size * 0.055}px sans-serif`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(seg.label, 0, 0);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  function spinWheel() {
    if (spinning) return;
    spinning = true;
    btn.disabled = true;

    const winIdx = Math.floor(Math.random() * NUM);
    const extraRotations = 5 + Math.floor(Math.random() * 3);
    const finalAngle = extraRotations * 2 * Math.PI + (2 * Math.PI - winIdx * ARC - ARC / 2) - currentAngle;
    
    const duration = 3500;
    const start = performance.now();
    const startAngle = currentAngle;

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      currentAngle = startAngle + finalAngle * eased;
      drawWheel(currentAngle);

      if (progress < 1) requestAnimationFrame(frame);
      else {
        currentAngle = currentAngle % (2 * Math.PI);
        showWin(SEGMENTS[winIdx]);
        
        // Save state so it doesn't pop up again
        localStorage.setItem('hasSpunPopup', 'true');
        
        // Sync with global spin logic
        const d = JSON.parse(localStorage.getItem('spinData') || '{}');
        d.lastSpin = new Date().toDateString();
        d.totalSpins = (d.totalSpins || 0) + 1;
        localStorage.setItem('spinData', JSON.stringify(d));
      }
    }
    requestAnimationFrame(frame);
  }

  function showWin(winner) {
    const resDiv = document.getElementById('spinPopupResult');
    const lbl = document.getElementById('spinPopupWinLabel');
    const desc = document.getElementById('spinPopupWinDesc');
    const code = document.getElementById('spinPopupCode');

    resDiv.style.display = 'block';
    if (!winner.code) {
      lbl.textContent = 'Oops! Better Luck Next Time';
      desc.textContent = 'You didn\'t win this time, but stick around for other amazing deals!';
      code.style.display = 'none';
      btn.textContent = 'CONTINUE SHOPPING';
      btn.onclick = closePopup;
    } else {
      lbl.textContent = `🎉 You Won: ${winner.label}!`;
      desc.textContent = 'Use this coupon code at checkout:';
      code.textContent = winner.code;
      code.style.display = 'block';
      btn.textContent = 'COPY & CLOSE';
      
      // Auto copy to clipboard functionality on the button
      btn.onclick = () => {
        navigator.clipboard.writeText(winner.code);
        if(typeof showToast !== 'undefined') showToast('Coupon copied to clipboard!');
        closePopup();
      };
    }
    btn.disabled = false;
    
    if (winner.code && typeof launchConfetti !== 'undefined') launchConfetti();
  }

  function closePopup() {
    modal.classList.remove('show');
    localStorage.setItem('hasSpunPopup', 'true');
    setTimeout(() => modal.remove(), 400);
  }

  // Draw initial state
  drawWheel(0);
  
  // Event listeners
  btn.addEventListener('click', spinWheel);
  closeBtn.addEventListener('click', closePopup);
  
  // Small delay to allow CSS transitions to catch the addition to DOM
  requestAnimationFrame(() => modal.classList.add('show'));
}
