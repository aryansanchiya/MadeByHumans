/* =============================================
   MADEBYHUMANS — JavaScript
   ============================================= */

'use strict';

/* =============================================
   STARFIELD CANVAS
   ============================================= */
(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let stars = [];
  let orbits = [];
  let animFrameId;
  let mouseX = 0, mouseY = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.2 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        parallaxFactor: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function initOrbits() {
    orbits = [];
    const cx = W / 2;
    const cy = H / 2;
    const radii = [W * 0.2, W * 0.32, W * 0.44, W * 0.57, W * 0.70];
    radii.forEach((r, i) => {
      const startAngle = Math.random() * Math.PI * 2;
      const arcLength = Math.PI * (0.3 + Math.random() * 0.5);
      orbits.push({ cx, cy, r, startAngle, arcLength, alpha: 0.06 + i * 0.015 });
    });
  }

  function drawOrbits(parallaxShiftX, parallaxShiftY) {
    orbits.forEach(o => {
      ctx.beginPath();
      ctx.arc(
        o.cx + parallaxShiftX * 0.2,
        o.cy + parallaxShiftY * 0.2,
        o.r,
        o.startAngle,
        o.startAngle + o.arcLength
      );
      ctx.strokeStyle = `rgba(150, 210, 210, ${o.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    const parallaxX = (mouseX - W / 2) * 0.003;
    const parallaxY = (mouseY - H / 2) * 0.003;

    // Draw orbits
    drawOrbits(parallaxX * 30, parallaxY * 30);

    // Draw & animate stars
    stars.forEach(s => {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 0.9 || s.alpha <= 0.1) s.twinkleDir *= -1;

      const px = s.x + parallaxX * s.parallaxFactor * 30;
      const py = s.y + parallaxY * s.parallaxFactor * 30;

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(animate);
  }

  function init() {
    resize();
    initStars();
    initOrbits();
    animate();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrameId);
    resize();
    initStars();
    initOrbits();
    animate();
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  init();
})();

/* =============================================
   NAVBAR SCROLL EFFECT
   ============================================= */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

/* =============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================= */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* =============================================
   HAMBURGER / MOBILE MENU
   ============================================= */
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* =============================================
   SCROLL REVEAL
   ============================================= */
(function () {
  const revealEls = document.querySelectorAll(
    '.section-label, .section-title, .col-block, .section-image-card, ' +
    '.section-cta, .portfolio-card, .crew-card, .crew-definition, ' +
    '.contact-subtitle, .contact-form, .contact-email-display, .portfolio-category'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delays for grid children
    const parent = el.closest('.portfolio-grid, .crew-grid, .section-two-col');
    if (parent) {
      const siblings = parent.querySelectorAll('.reveal');
      siblings.forEach((sib, j) => {
        sib.style.transitionDelay = `${j * 0.1}s`;
      });
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* =============================================
   SCROLL INDICATOR FADE
   ============================================= */
(function () {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    indicator.style.opacity = window.pageYOffset > 100 ? '0' : '0.5';
  }, { passive: true });
})();

/* =============================================
   CONTACT FORM
   ============================================= */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      // Basic validation shake
      form.style.animation = 'none';
      setTimeout(() => { form.style.animation = ''; }, 10);
      return;
    }

    // Simulate form submission
    const btn = document.getElementById('formSubmitBtn');
    btn.textContent = 'SENDING...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      success.style.display = 'block';
      btn.innerHTML = '<span>SEND MESSAGE</span><span class="cta-arrow">→</span>';
      btn.disabled = false;
      btn.style.opacity = '1';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1200);
  });
})();

/* =============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================= */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* =============================================
   PORTFOLIO CARD HOVER GLOW
   ============================================= */
(function () {
  const cards = document.querySelectorAll('.portfolio-card, .enterprise-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

/* =============================================
   HERO SPARK PARALLAX
   ============================================= */
(function () {
  const spark = document.getElementById('heroSpark');
  if (!spark) return;

  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dx = (e.clientX - centerX) * 0.015;
    const dy = (e.clientY - centerY) * 0.015;
    spark.style.transform = `translate(${dx}px, ${dy}px)`;
  });
})();

console.log('🚀 MadeByHumans — Powered by human ingenuity');
