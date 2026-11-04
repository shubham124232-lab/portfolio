(function () {
  'use strict';

  // ─── Year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── Scroll progress bar + navbar state + active section
  var pb = document.getElementById('progress-bar');
  var navbar = document.getElementById('navbar');
  var navItems = document.querySelectorAll('.nav-item[data-section]');
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    var y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    var total = document.documentElement.scrollHeight - window.innerHeight;
    pb.style.width = (total > 0 ? Math.round((y / total) * 100) : 0) + '%';
    var current = '';
    sections.forEach(function (s) { if (y >= s.offsetTop - 100) current = s.id; });
    navItems.forEach(function (a) {
      var on = a.dataset.section === current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile menu
  var hamburger = document.getElementById('hamburgerBtn');
  var mobMenu = document.getElementById('mobMenu');
  var hamburgerIcon = document.getElementById('hamburgerIcon');
  var ICON_OPEN = '<path d="M18 6 6 18M6 6l12 12"/>';
  var ICON_CLOSED = '<path d="M4 6h16M4 12h16M4 18h16"/>';

  function setMenu(open) {
    mobMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburgerIcon.innerHTML = open ? ICON_OPEN : ICON_CLOSED;
  }
  hamburger.addEventListener('click', function () {
    setMenu(!mobMenu.classList.contains('open'));
  });
  mobMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobMenu.classList.contains('open')) {
      setMenu(false);
      hamburger.focus();
    }
  });

  // ─── Scroll reveal
  var revealEls = document.querySelectorAll('.reveal:not(.visible)');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ─── Contact form: send with fetch so the visitor stays on the page.
  // Without JavaScript the form still does a normal POST to Formspree.
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var btn = document.getElementById('formBtn');
  var EMAIL = 'shubham124232@gmail.com';

  function showStatus(kind, build) {
    statusEl.className = 'form-status ' + kind;
    statusEl.textContent = '';
    build(statusEl);
    statusEl.hidden = false;
  }
  function showError() {
    showStatus('err', function (el) {
      el.appendChild(document.createTextNode('Sorry, the message could not be sent. Please email me directly at '));
      var a = document.createElement('a');
      a.href = 'mailto:' + EMAIL;
      a.textContent = EMAIL;
      el.appendChild(a);
      el.appendChild(document.createTextNode('.'));
    });
  }

  if (form && statusEl && btn && window.fetch && window.FormData) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn.disabled) return;
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      statusEl.hidden = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            showStatus('ok', function (el) {
              el.textContent = 'Thanks, your message has been sent. I will reply by email.';
            });
          } else {
            showError();
          }
        })
        .catch(showError)
        .then(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }
})();
