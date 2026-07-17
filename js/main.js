/**
 * GRAND PALAIS — Main Entry Point
 * Initializes all core features on every page
 */

'use strict';

import { initNavbar }    from './core/navbar.js';
import { initAnimations } from './core/animations.js';
import { initRTL }        from './core/rtl.js';
import { initTheme }      from './core/theme.js';
import { initBackToTop, initAccordion } from './core/utils.js';
import { initHeroSlider, initTestimonialsSlider } from './core/hero-slider.js';

// Page detection
const page = window.location.pathname.split('/').pop() || 'index.html';

/* ── Universal Init ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  // Always init
  initRTL();
  initTheme();
  initNavbar();
  initAnimations();
  initBackToTop();
  initAccordion();

  // Page-specific
  if (page === 'index.html' || page === '') {
    initHeroSlider({ interval: 6000 });
    initTestimonialsSlider();
    initHomePage();
  }

  if (page === 'home2.html') {
    initHome2Page();
  }

  if (page === 'gallery.html') {
    const { initGallery } = await import('./pages/gallery.js');
    initGallery();
  }

  if (page === 'contact.html') {
    const { initContact } = await import('./pages/contact.js');
    initContact();
  }

  if (page === 'dashboard.html') {
    const { initDashboard } = await import('./pages/dashboard.js');
    initDashboard();
  }

  if (page === 'login.html' || page === 'signup.html') {
    const { initAuth } = await import('./pages/auth.js');
    initAuth();
  }

  if (page === 'admin.html') {
    const { initAdmin } = await import('./pages/admin.js');
    initAdmin();
  }

  if (page === 'blog-post.html') {
    const { initBlogPost } = await import('./pages/blog-post.js');
    initBlogPost();
  }

  if (page === 'maintenance.html') {
    initMaintenance();
  }

  // Page enter animation — remove the class once it finishes so the
  // lingering transform doesn't break position:fixed descendants (navbar, mobile menu)
  document.body.classList.add('page-enter');
  function removePageEnter() { document.body.classList.remove('page-enter'); }
  document.body.addEventListener('animationend', function onPageEnter(e) {
    if (e.target === document.body && e.animationName === 'pageEnter') {
      removePageEnter();
      document.body.removeEventListener('animationend', onPageEnter);
    }
  });
  setTimeout(removePageEnter, 1000);
});

/* ── Home Page Extras ──────────────────────────────────── */
function initHomePage() {
  // Partners ticker if needed
  // Gallery teaser lightbox is handled by lightbox core
}

/* ── Home 2 Extras ─────────────────────────────────────── */
function initHome2Page() {
  // Animate particles
  const particleContainer = document.querySelector('.hero-v2-particles');
  if (particleContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 6}s;
        animation-duration: ${4 + Math.random() * 4}s;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        opacity: ${0.1 + Math.random() * 0.4};
      `;
      particleContainer.appendChild(p);
    }
  }
}

/* ── Maintenance Page ──────────────────────────────────── */
function initMaintenance() {
  import('./core/utils.js').then(m => {
    // Launch date: 2 days from now
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 2);
    launchDate.setHours(launchDate.getHours() + 6, 30, 0, 0);

    m.initCountdown(launchDate.toISOString(), {
      days:    document.querySelector('#countdown-days'),
      hours:   document.querySelector('#countdown-hours'),
      minutes: document.querySelector('#countdown-minutes'),
      seconds: document.querySelector('#countdown-seconds')
    });
  });
}
