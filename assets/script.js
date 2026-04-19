  'use strict';

  // ─── Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // ─── Scroll progress bar
  const pb = document.getElementById('progress-bar');
  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
    pb.style.width = pct + '%';
    pb.setAttribute('aria-valuenow', pct);
  }

  // ─── Navbar scroll + active section
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const y = window.scrollY;
    // scrolled state
    navbar.classList.toggle('scrolled', y > 20);
    // progress
    updateProgress();
    // active section
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 100) current = s.id;
    });
    navItems.forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── Mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobMenu = document.getElementById('mobMenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobMenu.classList.toggle('open', menuOpen);
    hamburger.setAttribute('aria-expanded', String(menuOpen));
    mobMenu.setAttribute('aria-hidden', String(!menuOpen));
    hamburgerIcon.innerHTML = menuOpen
      ? '<path d="M18 6 6 18M6 6l12 12"/>'
      : '<path d="M4 6h16M4 12h16M4 18h16"/>';
  });

  function closeMenu() {
    menuOpen = false;
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobMenu.setAttribute('aria-hidden', 'true');
    hamburgerIcon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16"/>';
  }

  // ─── Scroll reveal
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ─── Proficiency bars
  const profFills = document.querySelectorAll('.prof-fill[data-width]');
  const profObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.width = e.target.dataset.width + '%'; profObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  profFills.forEach(el => profObs.observe(el));

  // ─── Keyboard: Escape closes mobile menu
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  // ─── Contact form (basic validation feedback)
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      // mailto fallback works as-is; if you wire to an API, handle here
    });
  }
