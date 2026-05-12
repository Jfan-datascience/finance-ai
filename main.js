/* ============================================================
   FANANCE.AI — Main JS v2
   ============================================================ */

// ── Formspree endpoints ──────────────────────────────────────
const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/xlgzgjvj';
const CONSULT_ENDPOINT    = 'https://formspree.io/f/xykokevw';

// ── Language toggle ──────────────────────────────────────────
function setLang(lang) {
  const html = document.documentElement;
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang === 'zh' ? 'zh-TW' : 'en');
  localStorage.setItem('fanance-lang', lang);

  // Swap visible text in data-en / data-zh elements
  document.querySelectorAll('[data-en]').forEach(el => {
    const en = el.getAttribute('data-en');
    const zh = el.getAttribute('data-zh');
    if (!en && !zh) return;
    el.textContent = lang === 'zh' && zh ? zh : (en || el.textContent);
  });

  // Swap input placeholders
  document.querySelectorAll('[data-ph-en]').forEach(el => {
    el.placeholder = lang === 'zh'
      ? (el.getAttribute('data-ph-zh') || el.getAttribute('data-ph-en'))
      : el.getAttribute('data-ph-en');
  });

  // Update all toggle buttons
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.textContent = lang === 'zh' ? '中 / EN' : 'EN / 中';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Init language
  const savedLang = localStorage.getItem('fanance-lang') || 'en';
  setLang(savedLang);

  // Language toggle button(s)
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-lang') || 'en';
      setLang(current === 'en' ? 'zh' : 'en');
    });
  });

  // ── Sticky nav ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile hamburger ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth anchor scroll ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68', 10);
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── Intersection Observer fade-in ────────────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.fade-up, .post-card, .pricing-card, .lib-resource-card').forEach(el => {
    io.observe(el);
  });

  // ── Blog category filter (blog.html) ─────────────────────────
  const filterPills = document.getElementById('filterPills');
  if (filterPills) {
    filterPills.addEventListener('click', e => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      filterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      const grid = document.getElementById('blogPostsGrid');
      if (!grid) return;

      grid.querySelectorAll('.post-card[data-category]').forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !match);
      });

      // Featured post on home page doesn't have data-category on parent article
      const featured = document.querySelector('.featured-post[data-category]');
      if (featured) {
        const match = filter === 'all' || featured.getAttribute('data-category') === filter;
        featured.closest('.blog-featured')?.classList.toggle('hidden', !match);
      }
    });
  }

  // ── Formspree helper ─────────────────────────────────────────
  async function submitToFormspree(endpoint, data, onSuccess, onError) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const json = await res.json().catch(() => ({}));
        onError(json.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      onError('Network error. Please check your connection and try again.');
    }
  }

  // ── Newsletter form ───────────────────────────────────────────
  const newsletterForm    = document.getElementById('newsletterForm');
  const newsletterBtn     = document.getElementById('newsletterBtn');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async e => {
      e.preventDefault();
      newsletterBtn.disabled = true;
      newsletterBtn.querySelector('span').textContent = '…';

      const data = {
        name:  newsletterForm.querySelector('[name="name"]').value,
        email: newsletterForm.querySelector('[name="email"]').value,
      };

      await submitToFormspree(
        NEWSLETTER_ENDPOINT,
        data,
        () => {
          newsletterForm.hidden = true;
          if (newsletterSuccess) newsletterSuccess.hidden = false;
        },
        (msg) => {
          newsletterBtn.disabled = false;
          const lang = document.documentElement.getAttribute('data-lang');
          newsletterBtn.querySelector('span').textContent = lang === 'zh' ? '加入電子報 →' : 'Join the Newsletter →';
          alert(msg);
        }
      );
    });
  }

  // ── Consult form ──────────────────────────────────────────────
  const consultForm    = document.getElementById('consultForm');
  const consultBtn     = document.getElementById('consultBtn');
  const consultSuccess = document.getElementById('consultSuccess');

  if (consultForm) {
    consultForm.addEventListener('submit', async e => {
      e.preventDefault();
      consultBtn.disabled = true;
      consultBtn.querySelector('span').textContent = '…';

      const data = {
        name:    consultForm.querySelector('[name="name"]').value,
        email:   consultForm.querySelector('[name="email"]').value,
        message: consultForm.querySelector('[name="message"]').value,
      };

      await submitToFormspree(
        CONSULT_ENDPOINT,
        data,
        () => {
          consultForm.hidden = true;
          if (consultSuccess) consultSuccess.hidden = false;
        },
        (msg) => {
          consultBtn.disabled = false;
          const lang = document.documentElement.getAttribute('data-lang');
          consultBtn.querySelector('span').textContent = lang === 'zh' ? '申請通話 →' : 'Request a call →';
          alert(msg);
        }
      );
    });
  }

  // ── Staggered card animations ────────────────────────────────
  document.querySelectorAll('.posts-grid, .pricing-grid, .blog-posts-grid, .lib-resources-grid').forEach(grid => {
    const children = grid.querySelectorAll('.post-card, .pricing-card, .lib-resource-card');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 50}ms`;
    });
  });
});
