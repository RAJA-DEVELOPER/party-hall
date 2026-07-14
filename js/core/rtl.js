export function initRTL() {
  const saved = localStorage.getItem('dir');
  if (saved === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
    updateRTLButtons(true);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-rtl');
    if (!btn) return;
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    if (isRTL) {
      document.documentElement.removeAttribute('dir');
      localStorage.setItem('dir', 'ltr');
      updateRTLButtons(false);
    } else {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem('dir', 'rtl');
      updateRTLButtons(true);
    }
  });

  function updateRTLButtons(isRTL) {
    document.querySelectorAll('.btn-rtl').forEach(btn => {
      btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
      btn.title = isRTL ? 'LTR' : 'RTL';
    });
  }
}
