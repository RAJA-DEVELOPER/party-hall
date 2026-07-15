/**
 * GRAND PALAIS — Admin Dashboard JS
 * Sidebar nav, approve handler, mobile toggle
 */

'use strict';

import { showToast } from '../core/utils.js';

export function initAdmin() {
  initSidebarNav();
  initSidebarToggle();
  initApproveButtons();
}

/* ── Sidebar Navigation ────────────────────────────────── */
function initSidebarNav() {
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  const panels   = document.querySelectorAll('.dashboard-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.panel;

      navItems.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const panel = document.querySelector(`[data-panel-id="${target}"]`);
      if (panel) panel.classList.add('active');

      if (window.innerWidth <= 900) {
        document.querySelector('.dashboard-sidebar')?.classList.remove('open');
      }
    });
  });
}

/* ── Mobile Sidebar Toggle ─────────────────────────────── */
function initSidebarToggle() {
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar   = document.querySelector('.dashboard-sidebar');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    if (!sidebar?.contains(e.target) && !toggleBtn?.contains(e.target)) {
      sidebar?.classList.remove('open');
    }
  });
}

/* ── Approve Button Handler ────────────────────────────── */
function initApproveButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.admin-approve-btn');
    if (!btn) return;

    btn.innerHTML = '<i class="fa-solid fa-check"></i> Approved';
    btn.classList.remove('btn-primary');
    btn.style.background = 'var(--success)';
    btn.style.borderColor = 'transparent';
    btn.disabled = true;

    const row = btn.closest('tr') || btn.closest('.event-card');
    const badge = row?.querySelector('.badge-warning, .badge[class*="Pending"], .badge[class*="pending"]');
    if (badge) {
      badge.className = 'badge badge-success';
      badge.textContent = 'Confirmed';
    }

    showToast('Booking has been approved successfully.', 'success');
  });
}
