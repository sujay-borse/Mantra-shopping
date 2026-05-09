// Main application logic, sliders, countdowns, page specific initializations

// Loading screen
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }, 800);
  }
});

// Back to top button
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.createElement('div');
  backToTop.id = 'back-to-top';
  backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Global Newsletter form
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Successfully subscribed to newsletter!');
      nlForm.reset();
    });
  }
});

// Hero Slider logic (for Home page)
function initHeroSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  if (slides.length === 0) return;

  let current = 0;
  let timer;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  }

  function nextSlide() {
    let next = (current + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (current - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startTimer() {
    timer = setInterval(nextSlide, 5000);
  }

  document.querySelector('.slider-next')?.addEventListener('click', () => {
    clearInterval(timer);
    nextSlide();
    startTimer();
  });

  document.querySelector('.slider-prev')?.addEventListener('click', () => {
    clearInterval(timer);
    prevSlide();
    startTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      showSlide(index);
      startTimer();
    });
  });

  startTimer();
}

// Countdown Timer logic
function initCountdown(elementId, hours = 24) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const endTime = new Date().getTime() + (hours * 60 * 60 * 1000);

  function update() {
    const now = new Date().getTime();
    const diff = endTime - now;

    if (diff <= 0) {
      el.innerHTML = '<div class="countdown-block">Ended</div>';
      return;
    }

    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    el.innerHTML = `
      <div class="countdown-block">
        <span class="num">${h.toString().padStart(2, '0')}</span>
        <span class="lbl">Hrs</span>
      </div>
      <div class="countdown-sep">:</div>
      <div class="countdown-block">
        <span class="num">${m.toString().padStart(2, '0')}</span>
        <span class="lbl">Min</span>
      </div>
      <div class="countdown-sep">:</div>
      <div class="countdown-block">
        <span class="num">${s.toString().padStart(2, '0')}</span>
        <span class="lbl">Sec</span>
      </div>
    `;
  }

  setInterval(update, 1000);
  update();
}

// Mobile Filter Sidebar Toggle
function initMobileFilter() {
  const btn = document.getElementById('mobileFilterBtn');
  const sidebar = document.getElementById('filterSidebar');
  
  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    // Close button for mobile filter
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-outline btn-full d-none-desktop';
    closeBtn.style.marginTop = '20px';
    closeBtn.textContent = 'Apply Filters';
    closeBtn.onclick = () => {
      sidebar.classList.remove('open');
      document.body.style.overflow = '';
    };
    sidebar.appendChild(closeBtn);
  }
}
