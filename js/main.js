/* ============================================================
   BLESSED TO BLESS HEALTHCARE - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero animations
      document.querySelectorAll('.hero .animate-up').forEach(el => el.classList.add('go'));
    }, 1800);
  });
  // Fallback
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.querySelectorAll('.hero .animate-up').forEach(el => el.classList.add('go'));
  }, 3000);


  // ---- CUSTOM CURSOR ----
  const dot = document.querySelector('.cursor-dot');
  const waveContainer = document.getElementById('cursorWave');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  const waveQueue = [];
  let lastWave = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Wavy trail
    const now = Date.now();
    if (now - lastWave > 60) {
      createWaveRing(e.clientX, e.clientY);
      lastWave = now;
    }
  });

  function createWaveRing(x, y) {
    const ring = document.createElement('div');
    ring.className = 'wave-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    waveContainer.appendChild(ring);
    setTimeout(() => ring.remove(), 700);
  }

  function animateDot() {
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    requestAnimationFrame(animateDot);
  }
  animateDot();

  document.querySelectorAll('a, button, .tab-btn, .service-card, .value-card').forEach(el => {
    el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%,-50%) scale(2.5)');
    el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
  });


  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ---- HAMBURGER ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });


  // ---- ACTIVE NAV LINK ----
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    allNavLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
  });


  // ---- HERO SLIDER ----
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  let slideTimer;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startSlider() {
    slideTimer = setInterval(nextSlide, 5000);
  }
  function resetSlider() {
    clearInterval(slideTimer);
    startSlider();
  }

  document.getElementById('nextSlide').addEventListener('click', () => { nextSlide(); resetSlider(); });
  document.getElementById('prevSlide').addEventListener('click', () => { prevSlide(); resetSlider(); });

  startSlider();

  // Swipe support
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');
  heroEl.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) { diff > 0 ? nextSlide() : prevSlide(); resetSlider(); }
  }, { passive: true });


  // ---- SCROLL REVEAL ----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));


  // ---- GALLERY TABS ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.tab;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s, transform 0.4s';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ---- LAB SEARCH ----
  const labSearch = document.getElementById('labSearch');
  const tableRows = document.querySelectorAll('#labTableBody tr');

  labSearch.addEventListener('input', () => {
    const query = labSearch.value.toLowerCase().trim();
    let count = 1;
    tableRows.forEach(row => {
      const name = row.cells[1].textContent.toLowerCase();
      if (name.includes(query)) {
        row.classList.remove('row-hidden');
        row.cells[0].textContent = count++;
      } else {
        row.classList.add('row-hidden');
      }
    });
  });


  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#22a855';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3500);
    });
  }


  // ---- BACK TO TOP ----
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backTop.classList.add('visible');
    else backTop.classList.remove('visible');
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ---- FOOTER YEAR ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({
          top: target.offsetTop - navH,
          behavior: 'smooth'
        });
      }
    });
  });


  // ---- COUNTER ANIMATION ----
  function animateCounter(el, target, duration = 1800) {
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const increment = target / (duration / 16);
    const update = () => {
      start = Math.min(start + increment, target);
      el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
      if (start < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9.]/g, '');
        const suffix = el.textContent.replace(/[0-9.]/g, '');
        if (raw && !isNaN(raw)) {
          el.dataset.suffix = suffix;
          animateCounter(el, parseFloat(raw));
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => statObserver.observe(n));

});
