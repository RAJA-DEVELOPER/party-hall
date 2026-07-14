/**
 * GRAND PALAIS — Lightbox
 * Full-screen image lightbox with navigation
 */

'use strict';

const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export function initLightbox(selector = '[data-lightbox]') {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  // Build lightbox DOM
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close lightbox">✕</button>
      <button class="lightbox-prev" aria-label="Previous image">‹</button>
      <button class="lightbox-next" aria-label="Next image">›</button>
      <img class="lightbox-image" src="${BLANK_IMG}" alt="" />
      <div class="lightbox-caption" style="
        text-align:center;
        color:rgba(255,255,255,0.6);
        font-size:0.875rem;
        margin-top:1rem;
        font-family:var(--font-sans)
      "></div>
      <div class="lightbox-counter" style="
        position:absolute;
        top:-40px;
        left:0;
        font-size:0.75rem;
        color:rgba(255,255,255,0.35);
        letter-spacing:0.1em;
      "></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const img     = overlay.querySelector('.lightbox-image');
  const caption = overlay.querySelector('.lightbox-caption');
  const counter = overlay.querySelector('.lightbox-counter');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const prevBtn  = overlay.querySelector('.lightbox-prev');
  const nextBtn  = overlay.querySelector('.lightbox-next');

  // Group items by data-lightbox value
  let currentGroup = [];
  let currentIndex = 0;

  function getGroup(groupName) {
    return [...document.querySelectorAll(`[data-lightbox="${groupName}"]`)].filter(el => {
      const item = el.closest('.gallery-item') || el;
      return !item.classList.contains('hidden') && item.offsetParent !== null;
    });
  }

  function open(item) {
    const groupName = item.dataset.lightbox || 'default';
    currentGroup = getGroup(groupName);
    currentIndex = currentGroup.indexOf(item);
    showImage(currentIndex);
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { img.src = BLANK_IMG; }, 300);
  }

  function showImage(index) {
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    const item = currentGroup[currentIndex];
    const imgEl = item.tagName === 'IMG' ? item : item.querySelector('img');

    const src     = item.dataset.src || (imgEl && (imgEl.currentSrc || imgEl.src)) || item.src || item.href || '';
    const altText = item.dataset.caption || (imgEl && imgEl.alt) || item.alt || '';

    img.style.opacity = '0';
    img.src = src;
    img.alt = altText;

    img.onload = () => {
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '1';
    };

    caption.textContent = altText;
    counter.textContent = currentGroup.length > 1
      ? `${currentIndex + 1} / ${currentGroup.length}`
      : '';

    // Show/hide nav buttons
    const show = currentGroup.length > 1;
    prevBtn.style.display = show ? 'flex' : 'none';
    nextBtn.style.display = show ? 'flex' : 'none';
  }

  // Event Listeners — bind to the whole card when inside a .gallery-item
  items.forEach(item => {
    const trigger = item.closest('.gallery-item') || item;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      open(item);
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')       close();
    if (e.key === 'ArrowLeft')    showImage(currentIndex - 1);
    if (e.key === 'ArrowRight')   showImage(currentIndex + 1);
  });

  // Touch swipe
  let touchX = null;
  overlay.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  overlay.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showImage(currentIndex + 1) : showImage(currentIndex - 1);
    }
    touchX = null;
  });
}
