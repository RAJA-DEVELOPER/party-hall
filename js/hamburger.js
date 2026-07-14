(function() {
  var ham = document.querySelector('.hamburger');
  var menu = document.querySelector('.mobile-menu');
  if (!ham || !menu) return;

  function toggleMenu(open) {
    ham.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  ham.addEventListener('click', function toggle() {
    var open = !ham.classList.contains('open');
    toggleMenu(open);
  });

  document.querySelectorAll('.mobile-menu .nav-link').forEach(function(link) {
    link.addEventListener('click', function close() {
      toggleMenu(false);
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && ham.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  window.__fallbackMenu = true;
})();
