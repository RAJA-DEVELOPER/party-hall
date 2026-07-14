/**
 * GRAND PALAIS — Navbar Controller
 * Sticky navbar, hamburger menu, mobile menu
 */

'use strict';

export function initNavbar() {
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');

  if (!navbar) return;

  // ── Scroll Behavior ─────────────────────────────────────
  let lastScroll = 0;
  let isScrolled = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 60 && !isScrolled) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
      isScrolled = true;
    } else if (scrollY <= 60 && isScrolled) {
      navbar.classList.remove('scrolled');
      if (navbar.dataset.transparent === 'true') {
        navbar.classList.add('transparent');
      }
      isScrolled = false;
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init

  // ── Hamburger Toggle ─────────────────────────────────────
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // ── Active Link Detection ────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive = href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
}
