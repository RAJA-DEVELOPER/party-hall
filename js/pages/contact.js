/**
 * GRAND PALAIS — Contact Page JS
 * Form validation with elegant error states
 */

'use strict';

import { showToast } from '../core/utils.js';

export function initContact() {
  initContactForm();
}

function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const fields = {
    name: {
      el: form.querySelector('#contact-name'),
      validate: v => v.trim().length >= 2,
      error: 'Please enter your full name (at least 2 characters).'
    },
    email: {
      el: form.querySelector('#contact-email'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      error: 'Please enter a valid email address.'
    },
    phone: {
      el: form.querySelector('#contact-phone'),
      validate: v => !v || /^[\d\s+\-()]{7,15}$/.test(v),
      error: 'Please enter a valid phone number.'
    },
    eventType: {
      el: form.querySelector('#contact-event'),
      validate: v => v !== '',
      error: 'Please select an event type.'
    },
    message: {
      el: form.querySelector('#contact-message'),
      validate: v => v.trim().length >= 10,
      error: 'Please enter a message (at least 10 characters).'
    }
  };

  // Real-time validation
  Object.values(fields).forEach(field => {
    if (!field.el) return;
    field.el.addEventListener('blur', () => validateField(field));
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) validateField(field);
    });
  });

  function validateField(field) {
    if (!field.el) return true;
    const value = field.el.value;
    const isValid = field.validate(value);
    const errorEl = field.el.parentElement.querySelector('.form-error');

    field.el.classList.toggle('error', !isValid);

    if (errorEl) {
      errorEl.textContent = isValid ? '' : field.error;
      errorEl.style.display = isValid ? 'none' : 'block';
    }

    return isValid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.values(fields).forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      showToast('Please fix the errors above before submitting.', 'error');
      return;
    }

    // Simulate form submission
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span style="opacity:0.7">Sending...</span>';
    submitBtn.disabled = true;

    await new Promise(r => setTimeout(r, 1800));

    submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:6px"><polyline points="20 6 9 17 4 12"/></svg> Message Sent';
    submitBtn.style.background = 'var(--success)';
    submitBtn.style.borderColor = 'var(--success)';
    showToast('Your message has been sent! We\'ll respond within 24 hours.', 'success');

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.borderColor = '';
      submitBtn.disabled = false;
    }, 3000);
  });
}
