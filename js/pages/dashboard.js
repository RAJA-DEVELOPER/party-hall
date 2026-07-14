/**
 * GRAND PALAIS — Dashboard JS
 * Calendar, bookings, sidebar navigation
 */

'use strict';

import { formatDate, formatCurrency, showToast } from '../core/utils.js';

export function initDashboard() {
  initSidebarNav();
  initCalendar();
  initBookingForm();
  initSidebarToggle();
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

      // Close mobile sidebar
      if (window.innerWidth <= 900) {
        document.querySelector('.dashboard-sidebar')?.classList.remove('open');
      }
    });
  });
}

/* ── Calendar ──────────────────────────────────────────── */
function initCalendar() {
  const wrapper = document.querySelector('.calendar-wrapper');
  if (!wrapper) return;

  const monthYear = wrapper.querySelector('.calendar-month-year');
  const grid      = wrapper.querySelector('.calendar-grid');
  const prevBtn   = wrapper.querySelector('.calendar-nav-btn.prev');
  const nextBtn   = wrapper.querySelector('.calendar-nav-btn.next');

  let date = new Date();

  // Mock availability data
  const bookedDates  = [3, 8, 14, 18, 22, 27];
  const pendingDates = [5, 11, 16, 25];

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function renderCalendar() {
    const year  = date.getFullYear();
    const month = date.getMonth();

    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today    = new Date();

    grid.innerHTML = '';

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= lastDate; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;

      const isToday = d === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();
      if (isToday) dayEl.classList.add('today');

      if (bookedDates.includes(d)) {
        dayEl.classList.add('booked');
        const dot = document.createElement('div');
        dot.className = 'calendar-day-dot';
        dayEl.appendChild(dot);
      } else if (pendingDates.includes(d)) {
        dayEl.classList.add('pending');
        const dot = document.createElement('div');
        dot.className = 'calendar-day-dot';
        dayEl.appendChild(dot);
      } else if (d >= today.getDate() || month !== today.getMonth() || year !== today.getFullYear()) {
        dayEl.classList.add('available');
      }

      dayEl.addEventListener('click', () => {
        wrapper.querySelectorAll('.calendar-day.selected').forEach(sel => sel.classList.remove('selected'));
        if (!dayEl.classList.contains('booked')) {
          dayEl.classList.add('selected');
          const selectedDate = new Date(year, month, d);
          const dateInput = document.querySelector('#booking-date');
          if (dateInput) {
            dateInput.value = selectedDate.toISOString().split('T')[0];
          }
        }
      });

      grid.appendChild(dayEl);
    }
  }

  prevBtn?.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
  });

  nextBtn?.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
}

/* ── Booking Form ──────────────────────────────────────── */
function initBookingForm() {
  const form = document.querySelector('#bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    btn.innerHTML = '<span style="opacity:0.7">Submitting...</span>';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1500));

    showToast('Booking request submitted! We\'ll confirm within 24 hours.', 'success');

    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:6px"><polyline points="20 6 9 17 4 12"/></svg> Request Submitted';
    btn.style.background = 'var(--success)';

    setTimeout(() => {
      form.reset();
      btn.innerHTML = 'Submit Booking Request';
      btn.style.background = '';
      btn.disabled = false;

      // Switch to My Bookings panel
      document.querySelector('[data-panel="my-bookings"]')?.click();
    }, 2500);
  });
}

/* ── Mobile Sidebar Toggle ─────────────────────────────── */
function initSidebarToggle() {
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar   = document.querySelector('.dashboard-sidebar');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 900) return;
    if (!sidebar?.contains(e.target) && !toggleBtn?.contains(e.target)) {
      sidebar?.classList.remove('open');
    }
  });
}
