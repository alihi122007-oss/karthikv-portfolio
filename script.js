// Mobile navigation with accessible open/close behavior
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

const setMenuOpen = (isOpen) => {
  if (!navToggle || !navLinks) return;
  navToggle.classList.toggle('open', isOpen);
  navLinks.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};

navToggle?.addEventListener('click', () => {
  setMenuOpen(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuOpen(false);
    navToggle?.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!header?.contains(event.target)) setMenuOpen(false);
});

// Header state and active navigation links
const sections = [...document.querySelectorAll('main section[id]')];
const menuLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

const updateNavigation = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);

  let currentSection = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 150) currentSection = section.id;
  });

  menuLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
  });
};

window.addEventListener('scroll', updateNavigation, { passive: true });
updateNavigation();

// Subtle reveal-on-scroll animation
const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Disable placeholder links marked as not-yet-available
document.querySelectorAll('a[aria-disabled="true"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

// Dynamic footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Back-to-top button visibility
const backToTop = document.querySelector('.back-top');

const updateBackToTop = () => {
  backToTop?.classList.toggle('visible', window.scrollY > 600);
};

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
