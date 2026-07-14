/**
 * GRAND PALAIS — Scroll Animations & Counter
 * IntersectionObserver-based reveal + counter animations
 */

'use strict';

/* ── Scroll Reveal ─────────────────────────────────────── */
export function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    if (el.closest('[data-stagger]')) return;
    observer.observe(el);
  });
}

/* ── Counter Animation ─────────────────────────────────── */
export function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.counter);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration) || 2000;
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;

    let start = null;
    const startVal = parseFloat(el.dataset.start) || 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;

      el.textContent = prefix + current.toFixed(decimals) + suffix;

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Parallax ──────────────────────────────────────────── */
export function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  if (!elements.length) return;

  // Skip on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function updateParallax() {
    const scrollY = window.scrollY;

    elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect  = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter  = window.innerHeight / 2;
      const offset = (elementCenter - windowCenter) * speed;

      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
}

/* ── Stagger Children ──────────────────────────────────── */
export function initStaggerChildren() {
  const parents = document.querySelectorAll('[data-stagger]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        const delay = parseInt(entry.target.dataset.staggerDelay) || 100;

        Array.from(children).forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('revealed');
          }, i * delay);
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  parents.forEach(el => {
    // Pre-set children for animation
    Array.from(el.children).forEach(child => {
      child.setAttribute('data-reveal', child.dataset.reveal || 'up');
    });
    observer.observe(el);
  });
}

/* ── Init All ──────────────────────────────────────────── */
export function initAnimations() {
  initScrollReveal();
  initCounters();
  initParallax();
  initStaggerChildren();
}
