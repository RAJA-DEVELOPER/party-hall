/**
 * GRAND PALAIS — Auth Pages JS
 * Login / Signup form validation
 */

'use strict';

import { showToast } from '../core/utils.js';

export function initAuth() {
  initLoginForm();
  initSignupForm();
  initPasswordToggle();
}

function initLoginForm() {
  const form = document.querySelector('#loginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = form.querySelector('#login-email');
    const password = form.querySelector('#login-password');
    let valid = true;

    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Enter a valid email address.');
      valid = false;
    } else clearError(email);

    if (!password.value || password.value.length < 6) {
      setError(password, 'Password must be at least 6 characters.');
      valid = false;
    } else clearError(password);

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.innerHTML = '<span style="opacity:0.7">Signing In...</span>';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 1500));

    showToast('Welcome back! Redirecting to your dashboard...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
  });
}

function initSignupForm() {
  const form = document.querySelector('#signupForm');
  if (!form) return;

  const password = form.querySelector('#signup-password');
  const confirm  = form.querySelector('#signup-confirm');
  const strength = form.querySelector('#password-strength');

  // Password strength indicator
  password?.addEventListener('input', () => {
    if (!strength) return;
    const val = password.value;
    const score = getPasswordStrength(val);
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'var(--error)', 'var(--warning)', 'var(--gold)', 'var(--success)'];

    strength.textContent = val ? levels[score] : '';
    strength.style.color = colors[score];
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name     = form.querySelector('#signup-name');
    const email    = form.querySelector('#signup-email');
    const phone    = form.querySelector('#signup-phone');
    const terms    = form.querySelector('#signup-terms');
    let valid = true;

    if (!name?.value || name.value.trim().length < 2) {
      setError(name, 'Enter your full name.'); valid = false;
    } else clearError(name);

    if (!email?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, 'Enter a valid email.'); valid = false;
    } else clearError(email);

    if (phone?.value && !/^[\d\s+\-()]{7,15}$/.test(phone.value)) {
      setError(phone, 'Enter a valid phone number.'); valid = false;
    } else if (phone) clearError(phone);

    if (!password?.value || password.value.length < 8) {
      setError(password, 'Password must be at least 8 characters.'); valid = false;
    } else clearError(password);

    if (confirm?.value !== password?.value) {
      setError(confirm, 'Passwords do not match.'); valid = false;
    } else if (confirm) clearError(confirm);

    if (terms && !terms.checked) {
      showToast('Please accept the Terms & Conditions.', 'warning');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.innerHTML = '<span style="opacity:0.7">Creating Account...</span>';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 2000));

    showToast('Account created! Welcome to Grand Palais.', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
  });
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function setError(el, message) {
  if (!el) return;
  el.classList.add('error');
  let errorEl = el.parentElement.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    el.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(el) {
  if (!el) return;
  el.classList.remove('error');
  const errorEl = el.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.textContent = '';
}

function initPasswordToggle() {
  document.querySelectorAll('[data-password-toggle]').forEach(btn => {
    const target = document.querySelector(btn.dataset.passwordToggle);
    if (!target) return;

    const eyeSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;pointer-events:none"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    const eyeOffSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;pointer-events:none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>';

    btn.addEventListener('click', () => {
      const isText = target.type === 'text';
      target.type = isText ? 'password' : 'text';
      btn.innerHTML = isText ? eyeSvg : eyeOffSvg;
    });
  });
}
