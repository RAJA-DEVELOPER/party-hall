export function initGallery() {
  initGalleryFilter();
  initVideoCards();
  initGalleryLightbox();
}

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      galleryItems.forEach(item => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;
        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'scaleIn 0.4s var(--ease-out)';
          item.addEventListener('animationend', function clear() {
            item.style.animation = '';
          }, { once: true });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

function initVideoCards() {
  const cards = document.querySelectorAll('.video-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.video || 'https://youtube.com';
      window.open(url, '_blank', 'noopener');
    });
  });
}

function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || '';
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:2rem';
      overlay.addEventListener('click', () => overlay.remove());
      const imgClone = document.createElement('img');
      imgClone.src = img.src.replace(/[?&]w=\d+/,'').replace(/[?&]q=\d+/,'') + '&w=1200&q=90';
      imgClone.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain;box-shadow:0 24px 80px rgba(0,0,0,0.5)';
      overlay.appendChild(imgClone);
      if (caption) {
        const capEl = document.createElement('p');
        capEl.textContent = caption;
        capEl.style.cssText = 'position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.6);font-size:0.875rem;font-family:var(--font-sans, sans-serif);letter-spacing:0.05em;text-align:center';
        overlay.appendChild(capEl);
      }
      document.body.appendChild(overlay);
    });
  });
}
