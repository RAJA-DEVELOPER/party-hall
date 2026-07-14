/**
 * GRAND PALAIS — Utility Functions
 * Shared helpers used across all pages
 */

'use strict';

/* ── Smooth Scroll ─────────────────────────────────────── */
export function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── Debounce ──────────────────────────────────────────── */
export function debounce(fn, delay = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── Throttle ──────────────────────────────────────────── */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* ── Format Number ─────────────────────────────────────── */
export function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

/* ── Format Currency ───────────────────────────────────── */
export function formatCurrency(amount, currency = '₹') {
  return currency + Number(amount).toLocaleString('en-IN');
}

/* ── Format Date ───────────────────────────────────────── */
export function formatDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const defaultOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return d.toLocaleDateString('en-IN', { ...defaultOptions, ...options });
}

/* ── Get Element ───────────────────────────────────────── */
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Add Event Listener Helper ─────────────────────────── */
export function on(element, event, handler, options) {
  if (!element) return;
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
}

/* ── Toggle Class ──────────────────────────────────────── */
export function toggleClass(el, cls, force) {
  if (!el) return;
  if (force !== undefined) el.classList.toggle(cls, force);
  else el.classList.toggle(cls);
}

/* ── Is In Viewport ────────────────────────────────────── */
export function isInViewport(el, threshold = 0.1) {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= windowHeight * (1 - threshold) && rect.bottom >= 0;
}

/* ── Create Element ────────────────────────────────────── */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'class') el.className = val;
    else if (key === 'html') el.innerHTML = val;
    else if (key === 'text') el.textContent = val;
    else el.setAttribute(key, val);
  });
  children.forEach(child => {
    if (typeof child === 'string') el.insertAdjacentHTML('beforeend', child);
    else el.appendChild(child);
  });
  return el;
}

/* ── Toast Notification ────────────────────────────────── */
export function showToast(message, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = createElement('div', { class: 'toast-container' });
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>',
    warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><path d="M12 9v4"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 17h.01"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
  };
  const toast = createElement('div', {
    class: `toast ${type}`,
    role: 'alert',
    'aria-live': 'polite'
  });

  toast.innerHTML = `
    <span style="font-size: 1.2em; color: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning'})">${icons[type] || icons.info}</span>
    <span style="font-size: 0.875rem; color: rgba(255,255,255,0.85); flex:1">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;padding:0;font-size:1rem;line-height:1">✕</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeInRight 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Back To Top ───────────────────────────────────────── */
export function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggle = throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 100);

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Countdown Timer ───────────────────────────────────── */
export function initCountdown(targetDateStr, elements = {}) {
  const targetDate = new Date(targetDateStr);

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      elements.days && (elements.days.textContent = '00');
      elements.hours && (elements.hours.textContent = '00');
      elements.minutes && (elements.minutes.textContent = '00');
      elements.seconds && (elements.seconds.textContent = '00');
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elements.days    && (elements.days.textContent    = String(days).padStart(2, '0'));
    elements.hours   && (elements.hours.textContent   = String(hours).padStart(2, '0'));
    elements.minutes && (elements.minutes.textContent = String(minutes).padStart(2, '0'));
    elements.seconds && (elements.seconds.textContent = String(seconds).padStart(2, '0'));
  }

  update();
  return setInterval(update, 1000);
}

/* ── Active Nav Link ───────────────────────────────────── */
export function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPath || (currentPath === '' && href === 'index.html'));
  });
}

/* ── Accordion ─────────────────────────────────────────── */
export function initAccordion(containerSel = '.accordion') {
  const containers = document.querySelectorAll(containerSel);
  containers.forEach(container => {
    container.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all
        container.querySelectorAll('.accordion-item.open').forEach(openItem => {
          openItem.classList.remove('open');
        });

        // Open clicked if was closed
        if (!isOpen) item.classList.add('open');
      });
    });
  });
}

/* ── Tab System ────────────────────────────────────────── */
export function initTabs(containerSel = '.tab-container') {
  document.querySelectorAll(containerSel).forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels  = container.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = container.querySelector(`[data-panel="${target}"]`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  });
}
