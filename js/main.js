/**
 * Trần Đức Long - Modern Portfolio Interactions & Antigravity Physics
 * High Performance Vanilla JavaScript (60-120fps, Zero Jitter)
 * Inspired by: davidpelayo/antigravity-animation & Linear / Vercel motion
 */

document.addEventListener('DOMContentLoaded', () => {
  const htmlRoot = document.documentElement;

  // ==========================================================================
  // 1. ANTIGRAVITY PARTICLE PHYSICS ENGINE (CANVAS)
  // ==========================================================================
  class AntigravityEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.width = 0;
      this.height = 0;
      this.dpr = window.devicePixelRatio || 1;
      this.mouseX = -1000;
      this.mouseY = -1000;
      this.isPaused = false;
      this.animId = null;

      // Configuration
      this.isMobile = window.innerWidth < 768;
      this.particleCount = this.isMobile ? 24 : 45;
      this.interactionRadius = this.isMobile ? 100 : 140;
      this.friction = 0.96;
      this.gravity = -0.025; // Gentle upward buoyancy

      this.initThemeColors();
      this.resize();
      this.initParticles();
      this.bindEvents();
      this.start();
    }

    initThemeColors() {
      const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
      if (isDark) {
        this.colors = [
          'rgba(99, 102, 241, 0.45)',  // Neon Indigo
          'rgba(6, 182, 212, 0.45)',   // Cyber Cyan
          'rgba(16, 185, 129, 0.40)',  // Emerald
          'rgba(168, 85, 247, 0.38)',  // Violet
          'rgba(248, 250, 252, 0.25)'  // Slate Dot
        ];
      } else {
        this.colors = [
          'rgba(67, 56, 202, 0.22)',   // Royal Indigo
          'rgba(2, 132, 199, 0.22)',   // Deep Cyan
          'rgba(5, 150, 105, 0.18)',   // Forest Emerald
          'rgba(124, 58, 237, 0.18)',  // Purple
          'rgba(100, 116, 139, 0.15)'  // Slate
        ];
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = window.devicePixelRatio || 1;

      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.scale(this.dpr, this.dpr);
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle(true));
      }
    }

    createParticle(scatter = false) {
      const depth = Math.random() * 0.9 + 0.5; // Pseudo-3D depth: 0.5 to 1.4
      return {
        x: Math.random() * this.width,
        y: scatter ? Math.random() * this.height : this.height + 40,
        size: (Math.random() * 10 + 4) * depth,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        depth: depth,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        shape: Math.floor(Math.random() * 4), // 0: Circle, 1: Square, 2: Diamond, 3: Cross
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.01
      };
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.isMobile = window.innerWidth < 768;
      }, { passive: true });

      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouseX = -1000;
        this.mouseY = -1000;
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouseX = e.touches[0].clientX;
          this.mouseY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.mouseX = -1000;
        this.mouseY = -1000;
      }, { passive: true });

      // Auto-pause when page is hidden to save GPU/battery
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        } else {
          this.start();
        }
      });
    }

    update() {
      const time = Date.now() * 0.001;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Apply upward antigravity buoyancy
        p.vy += this.gravity * p.depth;

        // Subtle horizontal harmonic sway
        p.vx += Math.sin(time * 1.5 + p.swayPhase) * 0.012;

        // Position update
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Mouse Repulsion & Kinetic Elasticity
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.interactionRadius && dist > 0) {
          const force = (this.interactionRadius - dist) / this.interactionRadius;
          const angle = Math.atan2(dy, dx);
          const push = force * 3.8 * p.depth;

          p.vx += Math.cos(angle) * push;
          p.vy += Math.sin(angle) * push;
        }

        // Air friction damping
        p.vx *= this.friction;
        p.vy *= this.friction;

        // Wrap horizontal edges
        if (p.x < -40) p.x = this.width + 40;
        if (p.x > this.width + 40) p.x = -40;

        // Reset particle when it floats past top
        if (p.y < -50) {
          this.particles[i] = this.createParticle(false);
        }
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        const s = p.size;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1.2;

        this.ctx.beginPath();
        if (p.shape === 0) {
          // Circle
          this.ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else if (p.shape === 1) {
          // Soft rounded square
          const half = s / 2;
          this.ctx.roundRect ? this.ctx.roundRect(-half, -half, s, s, 3) : this.ctx.rect(-half, -half, s, s);
          this.ctx.fill();
        } else if (p.shape === 2) {
          // Diamond
          this.ctx.moveTo(0, -s / 2);
          this.ctx.lineTo(s / 2, 0);
          this.ctx.lineTo(0, s / 2);
          this.ctx.lineTo(-s / 2, 0);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          // Delicate crosshair '+'
          const len = s / 2;
          this.ctx.moveTo(-len, 0);
          this.ctx.lineTo(len, 0);
          this.ctx.moveTo(0, -len);
          this.ctx.lineTo(0, len);
          this.ctx.stroke();
        }

        this.ctx.restore();
      }
    }

    loop = () => {
      if (this.isPaused) return;
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(this.loop);
    };

    start() {
      if (!this.isPaused && this.animId) return;
      this.isPaused = false;
      this.loop();
    }

    stop() {
      this.isPaused = true;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    refreshTheme() {
      this.initThemeColors();
      this.particles.forEach((p) => {
        p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      });
    }
  }

  // Instantiate Antigravity Canvas
  const antigravity = new AntigravityEngine('antigravityCanvas');

  // ==========================================================================
  // 2. DYNAMIC SPOTLIGHT TRACKER (LINEAR / RAYCAST CARD EFFECT)
  // ==========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  // ==========================================================================
  // 3. 3D MAGNETIC TILT (AVATAR SHOWCASE & FEATURED CARDS)
  // ==========================================================================
  const magneticCards = document.querySelectorAll('.magnetic-tilt');
  magneticCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ==========================================================================
  // 4. STAGGERED SCROLL REVEAL (APPLE / VERCEL INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver unsupported
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // ==========================================================================
  // 5. THEME TOGGLE SYSTEM (LIGHT DEFAULT <-> DARK MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  const savedTheme = localStorage.getItem('theme') || 'light';

  const applyTheme = (theme, notify = false) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      if (themeIcon) themeIcon.className = 'bi bi-sun-fill text-warning';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      if (notify) showToast('Switched to Dark Mode', 'bi-moon-stars-fill');
    } else {
      if (themeIcon) themeIcon.className = 'bi bi-moon-stars text-primary';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      if (notify) showToast('Switched to Light Mode', 'bi-sun-fill');
    }

    // Refresh canvas particle palette to match theme
    antigravity?.refreshTheme();
  };

  applyTheme(savedTheme, false);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
  });

  // ==========================================================================
  // 6. NAVBAR SCROLL EFFECT & SCROLLSPY
  // ==========================================================================
  const navbar = document.querySelector('.navbar-custom');
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id], div[id].hero-section');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    if (scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }

    let currentId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const navCollapse = document.getElementById('navbarCollapse');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // ==========================================================================
  // 7. TYPING EFFECT IN HERO SECTION
  // ==========================================================================
  const typedTarget = document.getElementById('typedRole');
  if (typedTarget) {
    const roles = [
      'Senior Full Stack Software Engineer',
      '.NET & Microservices Specialist',
      'High-Performance Backend Architect',
      'Modern Web Developer (Angular / Vue)'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typedTarget.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 38;
      } else {
        typedTarget.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeRole, typingSpeed);
    };

    setTimeout(typeRole, 600);
  }

  // ==========================================================================
  // 8. PROJECT FILTER SYSTEM
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectItems.forEach((item) => {
        const itemCategories = item.getAttribute('data-category') || '';

        if (filterVal === 'all' || itemCategories.includes(filterVal)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(18px) scale(0.96)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 260);
        }
      });
    });
  });

  // ==========================================================================
  // 9. TIMELINE TAB SWITCHER
  // ==========================================================================
  const timelineTabs = document.querySelectorAll('.timeline-tab-btn');
  const timelineStreams = document.querySelectorAll('.timeline-stream-container');

  timelineTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      timelineTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      timelineStreams.forEach((stream) => {
        if (stream.id === targetId) {
          stream.style.display = 'block';
          stream.style.opacity = '1';
        } else {
          stream.style.display = 'none';
          stream.style.opacity = '0';
        }
      });
    });
  });

  // ==========================================================================
  // 10. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  const toastEl = document.getElementById('customToast');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimeout;

  function showToast(message, iconClass = 'bi-check-circle-fill') {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    const iconEl = toastEl.querySelector('i');
    if (iconEl) iconEl.className = `bi ${iconClass}`;
    toastEl.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // 11. ONE-CLICK CLIPBOARD COPY
  // ==========================================================================
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const copyText = btn.getAttribute('data-copy');
      if (!copyText) return;

      try {
        await navigator.clipboard.writeText(copyText);
        showToast(`Copied to clipboard: "${copyText}"`);

        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-clipboard-check text-success"></i>';
        setTimeout(() => {
          btn.innerHTML = originalIcon;
        }, 1800);
      } catch (err) {
        showToast('Unable to copy to clipboard', 'bi-exclamation-triangle');
      }
    });
  });

  // ==========================================================================
  // 12. CONTACT FORM HANDLING
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const subjectInput = document.getElementById('senderSubject');
      const messageInput = document.getElementById('senderMessage');

      const name = nameInput?.value.trim() || 'Visitor';
      const email = emailInput?.value.trim() || '';
      const subject = subjectInput?.value.trim() || 'Portfolio Contact Inquiry';
      const body = messageInput?.value.trim() || '';

      if (!email || !body) {
        showToast('Please fill in your email and message', 'bi-exclamation-circle');
        return;
      }

      const mailtoLink = `mailto:long.tranducbn@gmail.com?subject=${encodeURIComponent(
        `[Portfolio] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${body}`)}`;

      showToast('Opening your email client to send message...', 'bi-send-check');
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);

      contactForm.reset();
    });
  }
});
