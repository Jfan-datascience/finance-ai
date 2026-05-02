/* ============================================================
   FANANCE.AI — Main JS
   ============================================================ */

// ── Language toggle ──────────────────────────────────────────
const html = document.documentElement;
const langToggles = document.querySelectorAll('.lang-toggle');

function setLang(lang) {
  const isZH = lang === 'zh';
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', isZH ? 'zh-TW' : 'en');

  // Show/hide EN and ZH content blocks
  document.querySelectorAll('[data-en]').forEach(el => {
    el.hidden = isZH;
  });
  document.querySelectorAll('[data-zh]').forEach(el => {
    el.hidden = !isZH;
  });

  // Update toggle button labels
  langToggles.forEach(toggle => {
    toggle.querySelector('.lang-en').hidden = isZH;
    toggle.querySelector('.lang-zh').hidden = !isZH;
  });

  // Swap data-en / data-zh attribute text nodes (single-value elements)
  document.querySelectorAll('[data-en][data-zh]').forEach(el => {
    const text = isZH ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });

  localStorage.setItem('fanance-lang', lang);
}

langToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-lang');
    setLang(current === 'en' ? 'zh' : 'en');
  });
});

// Restore saved preference
const saved = localStorage.getItem('fanance-lang');
if (saved && saved !== 'en') setLang(saved);

// ── Sticky nav shadow ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Fade-in on scroll ────────────────────────────────────────
const fadeEls = document.querySelectorAll('.card, .pricing-card, .about-right p, .subscribe-proof li');
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Subscribe form ───────────────────────────────────────────
const form = document.getElementById('subscribe-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email-input').value;
  if (!email) return;

  // TODO: Replace with your email service endpoint (ConvertKit, Mailchimp, etc.)
  form.querySelector('.form-row').style.display = 'none';
  form.querySelector('.form-label').style.display = 'none';
  successMsg.hidden = false;

  console.log('Subscribe:', email);
});

// ── Smooth anchor offset (accounts for fixed nav) ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
