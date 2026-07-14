/**
 * GRAND PALAIS — Hero Slider
 * Auto-advancing image slider with Ken Burns effect
 */

'use strict';

export function initHeroSlider(options = {}) {
  const slider = document.querySelector('.hero-slides');
  if (!slider) return;

  const config = {
    autoplay: true,
    interval: 6000,
    ...options
  };

  const slides   = slider.querySelectorAll('.hero-slide');
  const dots     = document.querySelectorAll('.hero-dot');
  const prevBtn  = document.querySelector('.hero-arrow-prev');
  const nextBtn  = document.querySelector('.hero-arrow-next');
  const progress = document.querySelector('.hero-progress-bar');
  const countEl  = document.querySelector('.hero-slide-count .current');
  const totalEl  = document.querySelector('.hero-slide-count .total');

  if (!slides.length) return;

  let current   = 0;
  let timer     = null;
  let startTime = null;
  let animFrame = null;
  const total   = slides.length;

  if (totalEl) totalEl.textContent = String(total).padStart(2, '0');

  // ── Go To Slide ──────────────────────────────────────────
  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    current = (index + total) % total;

    slides[current].classList.add('active');
    dots[current]?.classList.add('active');

    if (countEl) countEl.textContent = String(current + 1).padStart(2, '0');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ── Progress Bar ─────────────────────────────────────────
  function startProgress() {
    startTime = performance.now();
    animFrame && cancelAnimationFrame(animFrame);

    function tick(now) {
      const elapsed = now - startTime;
      const pct = Math.min((elapsed / config.interval) * 100, 100);
      if (progress) progress.style.width = pct + '%';

      if (elapsed < config.interval) {
        animFrame = requestAnimationFrame(tick);
      }
    }

    animFrame = requestAnimationFrame(tick);
  }

  // ── Autoplay ─────────────────────────────────────────────
  function startAutoplay() {
    if (!config.autoplay) return;
    clearInterval(timer);
    startProgress();
    timer = setInterval(() => {
      next();
      startProgress();
    }, config.interval);
  }

  function stopAutoplay() {
    clearInterval(timer);
    animFrame && cancelAnimationFrame(animFrame);
  }

  // ── Controls ─────────────────────────────────────────────
  prevBtn?.addEventListener('click', () => {
    prev();
    stopAutoplay();
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    next();
    stopAutoplay();
    startAutoplay();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      stopAutoplay();
      startAutoplay();
    });
  });

  // ── Touch / Swipe ────────────────────────────────────────
  let touchStart = null;
  const heroEl = document.querySelector('.hero');

  heroEl?.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientX;
  }, { passive: true });

  heroEl?.addEventListener('touchend', (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
      stopAutoplay();
      startAutoplay();
    }

    touchStart = null;
  });

  // ── Pause on Hover ───────────────────────────────────────
  heroEl?.addEventListener('mouseenter', stopAutoplay);
  heroEl?.addEventListener('mouseleave', startAutoplay);

  // ── Keyboard ─────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); stopAutoplay(); startAutoplay(); }
    if (e.key === 'ArrowRight') { next(); stopAutoplay(); startAutoplay(); }
  });

  // ── Visibility API ───────────────────────────────────────
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  // ── Init ─────────────────────────────────────────────────
  goTo(0);
  startAutoplay();
}

/* ── Testimonials Slider ───────────────────────────────── */
export function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.testimonials-prev');
  const nextBtn = document.querySelector('.testimonials-next');

  if (!track) return;

  const items = track.querySelectorAll('.testimonial-item');
  let current = 0;
  let itemsPerView = getItemsPerView();

  function getItemsPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, items.length - itemsPerView);
  }

  function update() {
    const pct = (100 / itemsPerView) * current;
    track.style.transform = `translateX(-${pct}%)`;
  }

  prevBtn?.addEventListener('click', () => {
    current = Math.max(0, current - 1);
    update();
  });

  nextBtn?.addEventListener('click', () => {
    current = Math.min(getMaxIndex(), current + 1);
    update();
  });

  window.addEventListener('resize', () => {
    itemsPerView = getItemsPerView();
    current = Math.min(current, getMaxIndex());
    update();
  });
}
