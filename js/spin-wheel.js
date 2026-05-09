/* ================================================================
   MANTRA — SPIN WHEEL LOGIC
   Canvas-based animated spin wheel with reward system
   ================================================================ */

const SEGMENTS = [
  { label: '10% OFF',      code: 'SPIN10',   emoji: '🎯', color: '#FF3E6C', type: 'coupon' },
  { label: 'Free Ship',   code: 'FREESHIP',  emoji: '🚚', color: '#7c4dff', type: 'shipping' },
  { label: '50 Points',   code: 'PTS50',     emoji: '⭐', color: '#F5A623', type: 'points' },
  { label: '20% OFF',     code: 'SPIN20',    emoji: '🔥', color: '#00B057', type: 'coupon' },
  { label: 'Try Again',   code: null,        emoji: '😅', color: '#999999', type: 'retry' },
  { label: '5% Cash',     code: 'CASH5',     emoji: '💸', color: '#00e5ff', type: 'cashback' },
  { label: '100 Points',  code: 'PTS100',    emoji: '🌟', color: '#e040fb', type: 'points' },
  { label: 'Mystery Gift',code: 'MYSTERY',   emoji: '🎁', color: '#ff6d00', type: 'gift' },
];

const NUM = SEGMENTS.length;
const ARC = (2 * Math.PI) / NUM;
let spinning = false;
let currentAngle = 0;

function getSpinData() {
  return JSON.parse(localStorage.getItem('spinData') || '{}');
}

function saveSpinData(d) {
  localStorage.setItem('spinData', JSON.stringify(d));
}

function canSpin() {
  const d = getSpinData();
  const today = new Date().toDateString();
  return d.lastSpin !== today;
}

function rewards() {
  return JSON.parse(localStorage.getItem('spinRewards') || '[]');
}

function addReward(seg) {
  if (!seg.code) return;
  const list = rewards();
  list.unshift({ ...seg, date: new Date().toLocaleDateString(), id: Date.now() });
  localStorage.setItem('spinRewards', JSON.stringify(list.slice(0, 10)));

  // Also save coupon to store so it can be used at checkout
  if (typeof Store !== 'undefined' && seg.type === 'coupon') {
    const d = getSpinData();
    d.earnedCoupons = [...(d.earnedCoupons || []), seg.code];
    saveSpinData(d);
  }
}

// ── Canvas drawing ──────────────────────────────────────────────
function drawWheel(canvas, angle) {
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 6;

  ctx.clearRect(0, 0, size, size);

  // Outer ring glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, cx - 2, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255,62,108,0.3)';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#FF3E6C';
  ctx.shadowBlur = 16;
  ctx.stroke();
  ctx.restore();

  SEGMENTS.forEach((seg, i) => {
    const startA = angle + i * ARC;
    const endA = startA + ARC;
    const midA = startA + ARC / 2;

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startA, endA);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Emoji
    ctx.save();
    ctx.translate(cx + (r * 0.68) * Math.cos(midA), cy + (r * 0.68) * Math.sin(midA));
    ctx.rotate(midA + Math.PI / 2);
    ctx.font = `${size * 0.065}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(seg.emoji, 0, -size * 0.06);
    ctx.restore();

    // Text
    ctx.save();
    ctx.translate(cx + (r * 0.68) * Math.cos(midA), cy + (r * 0.68) * Math.sin(midA));
    ctx.rotate(midA + Math.PI / 2);
    ctx.font = `bold ${size * 0.05}px Inter, sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 4;
    ctx.fillText(seg.label, 0, size * 0.045);
    ctx.restore();
  });

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 10;
  ctx.fill();
}

// ── Spin animation ──────────────────────────────────────────────
function spin(canvas) {
  if (spinning || !canSpin()) {
    if (!canSpin()) showToast('You\'ve already spun today! Come back tomorrow 🌅', 'info');
    return;
  }

  spinning = true;
  document.getElementById('spinBtn').disabled = true;

  // Pick winner before spinning
  const winIdx = Math.floor(Math.random() * NUM);
  const extraRotations = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
  const finalAngle = extraRotations * 2 * Math.PI + (2 * Math.PI - winIdx * ARC - ARC / 2) - currentAngle;

  const duration = 4000;
  const start = performance.now();
  const startAngle = currentAngle;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOut(progress);

    currentAngle = startAngle + finalAngle * eased;
    drawWheel(canvas, currentAngle);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      currentAngle = currentAngle % (2 * Math.PI);
      spinning = false;
      const winner = SEGMENTS[winIdx];

      // Save spin
      const d = getSpinData();
      d.lastSpin = new Date().toDateString();
      d.totalSpins = (d.totalSpins || 0) + 1;
      saveSpinData(d);

      addReward(winner);
      updateUI();
      showWin(winner);
    }
  }

  requestAnimationFrame(frame);
}

// ── Win modal ───────────────────────────────────────────────────
function showWin(seg) {
  document.getElementById('winEmoji').textContent = seg.emoji;
  if (seg.type === 'retry') {
    document.getElementById('winLabel').textContent = 'Better luck next time!';
    document.getElementById('winDesc').textContent = 'No reward this time, but come back tomorrow for another spin!';
    document.getElementById('winCode').textContent = '';
    document.getElementById('winCode').style.display = 'none';
  } else {
    document.getElementById('winLabel').textContent = `You Won: ${seg.label}!`;
    document.getElementById('winDesc').textContent = 'Use the code below at checkout to claim your reward:';
    document.getElementById('winCode').textContent = seg.code;
    document.getElementById('winCode').style.display = 'block';
  }
  document.getElementById('winOverlay').classList.add('show');
  if (seg.type !== 'retry') launchConfetti();
}

window.closeWin = function () {
  document.getElementById('winOverlay').classList.remove('show');
};

// ── Confetti ────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#FF3E6C', '#7c4dff', '#F5A623', '#00B057', '#00e5ff', '#e040fb'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${Math.random() * 1.5}s;
      animation-duration: ${2 + Math.random() * 2}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ── Update UI ───────────────────────────────────────────────────
function updateUI() {
  const spinsLeft = canSpin() ? 1 : 0;
  document.getElementById('spinsLeft').textContent = spinsLeft;
  if (!spinsLeft) document.getElementById('spinBtn').disabled = true;

  const list = rewards();
  document.getElementById('totalRewards').textContent = list.length;

  const histEl = document.getElementById('rewardHistory');
  if (list.length === 0) {
    histEl.innerHTML = '<p style="color:var(--text-muted); font-size:0.9375rem;">No rewards yet. Spin to win! 🎡</p>';
  } else {
    histEl.innerHTML = `
      <h3 style="font-size:1rem; margin-bottom:12px; text-align:left;">Reward History</h3>
      ${list.map(r => `
        <div class="reward-item">
          <span>${r.emoji} ${r.label}</span>
          ${r.code ? `<span class="code">${r.code}</span>` : '<span style="color:var(--text-muted)">No code</span>'}
          <span style="font-size:0.8125rem; color:var(--text-muted);">${r.date}</span>
        </div>
      `).join('')}
    `;
  }
}

// ── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('spinCanvas');
  const size = canvas.parentElement.offsetWidth;
  canvas.width = size;
  canvas.height = size;

  drawWheel(canvas, 0);
  updateUI();

  document.getElementById('spinBtn').addEventListener('click', () => spin(canvas));

  // Handle window resize
  window.addEventListener('resize', () => {
    const newSize = canvas.parentElement.offsetWidth;
    canvas.width = newSize;
    canvas.height = newSize;
    drawWheel(canvas, currentAngle);
  });
});

// Dummy showToast if not loaded (standalone)
if (typeof showToast === 'undefined') {
  window.showToast = (msg) => console.log(msg);
}
