/* ============================================================
   GRAND PALAIS — Theme Controller
   Dark/Light toggle with localStorage persistence
   ============================================================ */

'use strict';

const THEME_KEY = 'grand-palais-theme';

export function initTheme() {
  const html     = document.documentElement;
  const stored   = localStorage.getItem(THEME_KEY);

  // Resolve initial theme: stored > system preference > dark
  let theme = stored;
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  applyTheme(theme);

  // Attach click handler to ALL theme-toggle buttons (desktop + mobile)
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  });

  // Also toggle when clicking the mobile theme-toggle-row
  document.querySelectorAll('.theme-toggle-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) return;
      const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  });

  // Listen for system changes (only if user hasn't set a preference)
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  // Toggle button icon
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const isLight = theme === 'light';
    btn.innerHTML = isLight ? moonSvg() : sunSvg();
    btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  });

  // Toggle mobile theme toggle label too
  const label = document.querySelector('.theme-toggle-label');
  if (label) {
    label.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }
}

/* ── SVG Icons ──────────────────────────────────────────── */
function sunSvg() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
}

function moonSvg() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}
