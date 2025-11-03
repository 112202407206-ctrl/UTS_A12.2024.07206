// ===================================
// ROOF TOP CAFE - ENHANCED JAVASCRIPT v3.0
// All Interactive Features + New Enhancements
// ===================================

(function() {
  'use strict';

  // ===================================
  // CONFIGURATION & CONSTANTS
  // ===================================
  const CONFIG = {
    CART_STORAGE_KEY: 'rooftop_cart',
    THEME_STORAGE_KEY: 'theme',
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 100,
    AUTO_SLIDE_INTERVAL: 5000,
    FLOATING_BEAN_INTERVAL: 10000,
    NOTIFICATION_DURATION: 3000
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  const Utils = {
    // Debounce function untuk performance
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Email validation
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    // Format currency
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
      const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    },

    // Random number generator
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Check if element is in viewport
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  };

  // ===================================
  // 1. SIDEBAR MANAGEMENT - ENHANCED
  // ===================================
  const Sidebar = {
    elements: {
      logoBtn: document.getElementById('logo-btn'),
      sidebar: document.getElementById('sidebar'),
      overlay: document.getElementById('sidebar-overlay'),
      closeBtn: document.getElementById('sidebar-close')
    },

    init() {
      this.attachEventListeners();
    },

    attachEventListeners() {
      if (this.elements.logoBtn) {
        this.elements.logoBtn.addEventListener('click', () => this.open());
      }

      if (this.elements.closeBtn) {
        this.elements.closeBtn.addEventListener('click', () => this.close());
      }

      if (this.elements.overlay) {
        this.elements.overlay.addEventListener('click', () => this.close());
      }

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.close();
        }
      });

      // Close on link click
      const sidebarLinks = this.elements.sidebar?.querySelectorAll('a');
      sidebarLinks?.forEach(link => {
        link.addEventListener('click', () => {
          setTimeout(() => this.close(), 200);
        });
      });
    },

    open() {
      this.elements.sidebar?.classList.add('active');
      this.elements.overlay?.classList.add('active');
      this.elements.sidebar?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Add animation class
      this.elements.sidebar?.classList.add('animate-in');
    },

    close() {
      this.elements.sidebar?.classList.remove('active');
      this.elements.overlay?.classList.remove('active');
      this.elements.sidebar?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    },

    isOpen() {
      return this.elements.sidebar?.classList.contains('active');
    }
  };

  // ===================================
  // 2. DROPDOWN MENU - ENHANCED
  // ===================================
  const DropdownMenu = {
    init() {
      const dropdownButtons = document.querySelectorAll('.has-dropdown > button');

      dropdownButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle(btn);
        });

        // Keyboard navigation
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle(btn);
          }
        });
      });

      // Close all dropdowns when clicking outside
      window.addEventListener('click', () => this.closeAll());
    },

    toggle(button) {
      const menu = button.parentElement.querySelector('.dropdown');
      const isHidden = menu.hasAttribute('hidden');

      // Close all other dropdowns
      this.closeAll();

      // Toggle current dropdown
      if (isHidden) {
        menu.removeAttribute('hidden');
        button.setAttribute('aria-expanded', 'true');
        menu.classList.add('fade-in');
      }
    },

    closeAll() {
      document.querySelectorAll('.dropdown').forEach(d => {
        d.setAttribute('hidden', '');
        d.classList.remove('fade-in');
      });
      document.querySelectorAll('.has-dropdown > button').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
      });
    }
  };

  // ===================================
  // 3. SEARCH FUNCTIONALITY - ENHANCED
  // ===================================
  const Search = {
    elements: {
      input: document.getElementById('search-input'),
      btn: document.getElementById('search-btn')
    },

    searchIndex: {
      'arabika': 'arabika.html',
      'gayo': 'arabika.html',
      'aceh': 'arabika.html',
      'toraja': 'arabika.html',
      'java': 'arabika.html',
      'preanger': 'arabika.html',
      'robusta': 'robusta.html',
      'lampung': 'robusta.html',
      'bali': 'robusta.html',
      'kintamani': 'robusta.html',
      'kontak': 'kontak.html',
      'hubungi': 'kontak.html',
      'contact': 'kontak.html',
      'galeri': 'galeri.html',
      'gallery': 'galeri.html',
      'foto': 'galeri.html',
      'berita': 'berita.html',
      'news': 'berita.html',
      'promo': 'berita.html',
      'faq': 'faq.html',
      'bantuan': 'faq.html',
      'help': 'faq.html',
      'home': 'index.html',
      'beranda': 'index.html'
    },

    init() {
      this.attachEventListeners();
    },

    attachEventListeners() {
      if (this.elements.btn) {
        this.elements.btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.performSearch();
        });
      }

      if (this.elements.input) {
        this.elements.input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch();
          }
        });

        // Auto-suggest on input
        this.elements.input.addEventListener('input', Utils.debounce((e) => {
          this.showSuggestions(e.target.value);
        }, 300));
      }
    },

    performSearch() {
      const query = this.elements.input?.value.trim().toLowerCase();
      
      if (!query) {
        Toast.show('Masukkan kata kunci pencarian', 'warning');
        return;
      }

      // Search in index
      for (let [keyword, url] of Object.entries(this.searchIndex)) {
        if (query.includes(keyword)) {
          window.location.href = url;
          return;
        }
      }

      // Default: redirect to berita with search parameter
      window.location.href = `berita.html?search=${encodeURIComponent(query)}`;
    },

    showSuggestions(query) {
      // Implement auto-suggest feature (optional)
      // Could be enhanced with a suggestion dropdown
    }
  };

  // ===================================
  // 4. DARK MODE - ENHANCED
  // ===================================
  const DarkMode = {
    elements: {
      toggle: document.getElementById('theme-toggle')
    },

    init() {
      this.loadSavedTheme();
      this.attachEventListeners();
    },

    loadSavedTheme() {
      const savedTheme = localStorage.getItem(CONFIG.THEME_STORAGE_KEY) || 'light';
      this.setTheme(savedTheme, false);
    },

    attachEventListeners() {
      if (this.elements.toggle) {
        this.elements.toggle.addEventListener('click', () => {
          const current = document.body.getAttribute('data-theme') || 'light';
          const newTheme = current === 'light' ? 'dark' : 'light';
          this.setTheme(newTheme, true);
        });
      }
    },

    setTheme(theme, animate = false) {
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem(CONFIG.THEME_STORAGE_KEY, theme);
      
      if (this.elements.toggle) {
        this.elements.toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.elements.toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        
        if (animate) {
          this.elements.toggle.classList.add('rotate-in');
          setTimeout(() => {
            this.elements.toggle.classList.remove('rotate-in');
          }, 600);
        }
      }

      // Smooth transition
      if (animate) {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      }
    }
  };

  // ===================================
  // 5. SHOPPING CART - ENHANCED
  // ===================================
  const Cart = {
    items: [],
    
    elements: {
      badge: document.getElementById('cart-count'),
      btn: document.getElementById('cart-btn'),
      notification: document.getElementById('cart-notification'),
      notificationText: document.getElementById('cart-notification-text')
    },

    init() {
      this.loadFromStorage();
      this.updateBadge();
      this.attachCartButtons();
      this.attachCartButtonClick();
    },

    loadFromStorage() {
      try {
        const saved = localStorage.getItem(CONFIG.CART_STORAGE_KEY);
        this.items = saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Error loading cart:', e);
        this.items = [];
      }
    },

    save() {
      try {
        localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(this.items));
        this.updateBadge();
      } catch (e) {
        console.error('Error saving cart:', e);
      }
    },

    add(product) {
      const existing = this.items.find(item => item.name === product.name);
      
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({
          name: product.name,
          price: product.price,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
      
      this.save();
      this.showNotification(`${product.name} ditambahkan ke keranjang`);
      
      // Animate button
      const addBtn = event.target;
      addBtn.classList.add('pulse');
      setTimeout(() => addBtn.classList.remove('pulse'), 500);
    },

    remove(productName) {
      this.items = this.items.filter(item => item.name !== productName);
      this.save();
    },

    clear() {
      this.items = [];
      this.save();
    },

    updateBadge() {
      const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
      if (this.elements.badge) {
        this.elements.badge.textContent = total;
        this.elements.badge.style.display = total > 0 ? 'flex' : 'none';
        
        if (total > 0) {
          this.elements.badge.classList.add('bounce-in');
          setTimeout(() => {
            this.elements.badge.classList.remove('bounce-in');
          }, 600);
        }
      }
    },

    showNotification(message) {
      if (this.elements.notification && this.elements.notificationText) {
        this.elements.notificationText.textContent = message;
        this.elements.notification.classList.add('show');
        
        setTimeout(() => {
          this.elements.notification.classList.remove('show');
        }, CONFIG.NOTIFICATION_DURATION);
      }
    },

    attachCartButtons() {
      const buttons = document.querySelectorAll('.btn-add-cart');
      
      buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const product = {
            name: btn.getAttribute('data-name'),
            price: parseInt(btn.getAttribute('data-price'))
          };
          this.add(product);
          
          // Add ripple effect
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });
    },

    attachCartButtonClick() {
      if (this.elements.btn) {
        this.elements.btn.addEventListener('click', () => {
          if (this.items.length === 0) {
            Toast.show('Keranjang masih kosong. Silakan tambahkan produk terlebih dahulu.', 'info');
          } else {
            const total = this.getTotal();
            const itemCount = this.items.length;
            const message = `Anda memiliki ${itemCount} item di keranjang.\n\nTotal: ${Utils.formatCurrency(total)}\n\n` +
                          this.items.map(item => `${item.name} (${item.quantity}x)`).join('\n');
            
            if (confirm(message + '\n\nLanjutkan ke checkout?')) {
              // Redirect to checkout page (to be created)
              window.location.href = 'checkout.html';
            }
          }
        });
      }
    },

    getTotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getItemCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
  };

  // ===================================
  // 6. NAVBAR SCROLL EFFECTS - ENHANCED
  // ===================================
  const NavbarScroll = {
    elements: {
      header: document.getElementById('site-header')
    },
    lastScrollY: 0,
    ticking: false,

    init() {
      window.addEventListener('scroll', () => this.handleScroll());
    },

    handleScroll() {
      this.lastScrollY = window.scrollY;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateNavbar();
          this.ticking = false;
        });
        this.ticking = true;
      }
    },

    updateNavbar() {
      if (!this.elements.header) return;

      // Add scrolled class
      if (this.lastScrollY > CONFIG.SCROLL_THRESHOLD) {
        this.elements.header.classList.add('scrolled');
      } else {
        this.elements.header.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll
      if (this.lastScrollY > this.previousScrollY && this.lastScrollY > 200) {
        this.elements.header.style.transform = 'translateY(-100%)';
      } else {
        this.elements.header.style.transform = 'translateY(0)';
      }

      this.previousScrollY = this.lastScrollY;
    }
  };

  // ===================================
  // 7. BACK TO TOP BUTTON - ENHANCED
  // ===================================
  const BackToTop = {
    elements: {
      btn: document.getElementById('back-to-top')
    },

    init() {
      this.attachEventListeners();
      window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 100));
    },

    handleScroll() {
      if (!this.elements.btn) return;

      if (window.scrollY > 300) {
        this.elements.btn.style.display = 'flex';
        this.elements.btn.classList.add('fade-in');
      } else {
        this.elements.btn.style.display = 'none';
      }
    },

    attachEventListeners() {
      if (this.elements.btn) {
        this.elements.btn.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });

          // Add animation
          this.elements.btn.classList.add('bounce-in');
          setTimeout(() => {
            this.elements.btn.classList.remove('bounce-in');
          }, 600);
        });
      }
    }
  };

  // ===================================
  // 8. NEWSLETTER FORM - ENHANCED
  // ===================================
  const Newsletter = {
    init() {
      const forms = document.querySelectorAll('#newsletter-form, .footer-newsletter');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(form);
        });
      });
    },

    async handleSubmit(form) {
      const input = form.querySelector('input[type="email"]');
      const email = input?.value;

      if (!email || !Utils.validateEmail(email)) {
        Toast.show('Mohon masukkan email yang valid.', 'error');
        input?.classList.add('shake');
        setTimeout(() => input?.classList.remove('shake'), 500);
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.textContent = 'Memproses...';
        submitBtn.disabled = true;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Success
      Toast.show(`Terima kasih! Email ${email} telah terdaftar di newsletter kami.`, 'success');
      input.value = '';

      // Reset button
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  };

  // ===================================
  // 9. TESTIMONIAL SLIDER - ENHANCED
  // ===================================
  const TestimonialSlider = {
    elements: {
      track: document.querySelector('.testimonial-track'),
      prevBtn: document.querySelector('.slider-btn.prev'),
      nextBtn: document.querySelector('.slider-btn.next'),
      items: document.querySelectorAll('.testimonial-item')
    },
    currentSlide: 0,
    autoSlideInterval: null,

    init() {
      if (!this.elements.track || !this.elements.items.length) return;

      this.attachEventListeners();
      this.startAutoSlide();
    },

    attachEventListeners() {
      this.elements.prevBtn?.addEventListener('click', () => this.prev());
      this.elements.nextBtn?.addEventListener('click', () => this.next());

      // Pause auto-slide on hover
      this.elements.track?.addEventListener('mouseenter', () => this.stopAutoSlide());
      this.elements.track?.addEventListener('mouseleave', () => this.startAutoSlide());

      // Touch/swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      this.elements.track?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      this.elements.track?.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      });
    },

    handleSwipe(startX, endX) {
      const diff = startX - endX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    },

    updateSlider() {
      const slideWidth = this.elements.items[0].offsetWidth + 40; // width + gap
      this.elements.track.style.transform = `translateX(-${this.currentSlide * slideWidth}px)`;

      // Add animation to current slide
      this.elements.items.forEach((item, index) => {
        if (index === this.currentSlide) {
          item.classList.add('zoom-in');
          setTimeout(() => item.classList.remove('zoom-in'), 400);
        }
      });
    },

    next() {
      const totalSlides = this.elements.items.length;
      this.currentSlide = (this.currentSlide + 1) % totalSlides;
      this.updateSlider();
    },

    prev() {
      const totalSlides = this.elements.items.length;
      this.currentSlide = (this.currentSlide - 1 + totalSlides) % totalSlides;
      this.updateSlider();
    },

    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideInterval = setInterval(() => this.next(), CONFIG.AUTO_SLIDE_INTERVAL);
    },

    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
    }
  };

  // ===================================
  // 10. SCROLL ANIMATIONS - ENHANCED
  // ===================================
  const ScrollAnimations = {
    observer: null,

    init() {
      const options = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Add stagger effect for children
            const children = entry.target.querySelectorAll('.feature-item, .product-card, .testimonial-item');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('fade-in-up');
              }, index * 100);
            });
          }
        });
      }, options);

      // Observe elements
      const elements = document.querySelectorAll('.feature-item, .product-card, .testimonial-item, .section, .news-item, .gallery-item');
      elements.forEach(el => this.observer.observe(el));
    }
  };

  // ===================================
  // 11. CONTACT FORM VALIDATION - ENHANCED
  // ===================================
  const ContactForm = {
    init() {
      const form = document.querySelector('.contact-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    },

    async handleSubmit(form) {
      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const subject = document.getElementById('contact-subject')?.value;
      const message = document.getElementById('contact-message')?.value;

      // Validate all fields
      let isValid = true;

      if (!name || name.length < 3) {
        this.showError('contact-name', 'Nama minimal 3 karakter');
        isValid = false;
      }

      if (!email || !Utils.validateEmail(email)) {
        this.showError('contact-email', 'Email tidak valid');
        isValid = false;
      }

      if (!subject || subject.length < 5) {
        this.showError('contact-subject', 'Subjek minimal 5 karakter');
        isValid = false;
      }

      if (!message || message.length < 10) {
        this.showError('contact-message', 'Pesan minimal 10 karakter');
        isValid = false;
      }

      if (!isValid) return;

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent;
      if (submitBtn) {
        submitBtn.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      Toast.show('✅ Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
      form.reset();

      // Reset button
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    },

    validateField(input) {
      const value = input.value.trim();
      const id = input.id;

      if (id === 'contact-name' && value.length < 3) {
        this.showError(id, 'Nama minimal 3 karakter');
        return false;
      }

      if (id === 'contact-email' && !Utils.validateEmail(value)) {
        this.showError(id, 'Email tidak valid');
        return false;
      }

      if (id === 'contact-subject' && value.length < 5) {
        this.showError(id, 'Subjek minimal 5 karakter');
        return false;
      }

      if (id === 'contact-message' && value.length < 10) {
        this.showError(id, 'Pesan minimal 10 karakter');
        return false;
      }

      this.clearError(input);
      return true;
    },

    showError(inputId, message) {
      const input = document.getElementById(inputId);
      if (!input) return;

      input.style.borderColor = 'var(--accent-red)';
      input.classList.add('shake');
      
      let errorDiv = input.nextElementSibling;
      if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
      }
      
      errorDiv.textContent = message;
      errorDiv.style.color = 'var(--accent-red)';
      errorDiv.style.fontSize = '0.85rem';
      errorDiv.style.marginTop = '0.5rem';

      setTimeout(() => input.classList.remove('shake'), 500);
    },

    clearError(input) {
      input.style.borderColor = '';
      const errorDiv = input.nextElementSibling;
      if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.remove();
      }
    }
  };

  // ===================================
  // 12. FAQ ACCORDION - ENHANCED
  // ===================================
  const FAQ = {
    init() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        if (!summary) return;

        summary.addEventListener('click', (e) => {
          const wasOpen = item.hasAttribute('open');

          // Close all other FAQs (accordion behavior)
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.hasAttribute('open')) {
              otherItem.removeAttribute('open');
            }
          });

          // Scroll to FAQ item if opening
          if (!wasOpen) {
            setTimeout(() => {
              Utils.smoothScrollTo(item, 100);
            }, 300);
          }
        });

        // Keyboard navigation
        summary.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            summary.click();
          }
        });
      });
    }
  };

  // ===================================
  // 13. FLOATING BEANS ANIMATION - ENHANCED
  // ===================================
  const FloatingBeans = {
    interval: null,

    init() {
      this.startFloating();
    },

    startFloating() {
      this.interval = setInterval(() => {
        this.createBean();
      }, CONFIG.FLOATING_BEAN_INTERVAL);
    },

    createBean() {
      const bean = document.createElement('div');
      bean.className = 'floating-bean';
      bean.textContent = '☕';
      bean.style.left = Utils.random(0, 100) + '%';
      bean.style.fontSize = Utils.random(25, 45) + 'px';
      bean.style.animationDuration = Utils.random(6, 10) + 's';
      
      document.body.appendChild(bean);

      setTimeout(() => {
        bean.remove();
      }, 10000);
    },

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  };

  // ===================================
  // 14. TOAST NOTIFICATION SYSTEM - NEW
  // ===================================
  const Toast = {
    show(message, type = 'info', duration = 3000) {
      const toast = document.createElement('div');
      toast.className = `toast ${type} fade-in`;
      
      const icon = this.getIcon(type);
      toast.innerHTML = `
        <span style="font-size: 1.5rem; margin-right: 1rem;">${icon}</span>
        <span style="flex: 1;">${message}</span>
      `;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    getIcon(type) {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };
      return icons[type] || icons.info;
    }
  };

  // ===================================
  // 15. IMAGE LAZY LOADING - NEW
  // ===================================
  const LazyLoad = {
    init() {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('fade-in');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  };

  // ===================================
  // 16. PARALLAX EFFECT - NEW
  // ===================================
  const Parallax = {
    init() {
      const parallaxElements = document.querySelectorAll('.parallax-layer');
      
      window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = element.dataset.speed || 0.5;
          element.style.transform = `translateY(${scrolled * speed}px)`;
        });
      }, 10));
    }
  };

  // ===================================
  // 17. PRODUCT QUICK VIEW - NEW
  // ===================================
  const QuickView = {
    init() {
      const productCards = document.querySelectorAll('.product-card');
      
      productCards.forEach(card => {
        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('btn-add-cart')) {
            this.showQuickView(card);
          }
        });
      });
    },

    showQuickView(card) {
      const productName = card.querySelector('h4')?.textContent;
      const productDesc = card.querySelector('.product-desc')?.textContent;
      const productPrice = card.querySelector('.product-price')?.textContent;

      // Create modal (simplified version)
      const modal = document.createElement('div');
      modal.className = 'quick-view-modal';
      modal.innerHTML = `
        <div class="quick-view-content fade-in">
          <button class="close-btn" onclick="this.parentElement.parentElement.remove()">✕</button>
          <h2>${productName}</h2>
          <p>${productDesc}</p>
          <p class="price">${productPrice}</p>
          <button class="btn-primary">Tambah ke Keranjang</button>
        </div>
      `;

      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
    }
  };

  // ===================================
  // 18. PERFORMANCE MONITOR - NEW
  // ===================================
  const PerformanceMonitor = {
    init() {
      if ('performance' in window) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('⚡ Performance Metrics:');
            console.log(`   Page Load Time: ${pageLoadTime}ms`);
            console.log(`   Server Response: ${connectTime}ms`);
            console.log(`   DOM Render Time: ${renderTime}ms`);

            // Show warning if page is slow
            if (pageLoadTime > 3000) {
              console.warn('⚠️ Page load time is above 3 seconds');
            }
          }, 0);
        });
      }
    }
  };

  // ===================================
  // 19. LOCAL STORAGE MANAGER - NEW
  // ===================================
  const StorageManager = {
    set(key, value, expiryDays = null) {
      const item = {
        value: value,
        timestamp: Date.now()
      };

      if (expiryDays) {
        item.expiry = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
      }

      try {
        localStorage.setItem(key, JSON.stringify(item));
        return true;
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    },

    get(key) {
      try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);

        // Check expiry
        if (item.expiry && Date.now() > item.expiry) {
          localStorage.removeItem(key);
          return null;
        }

        return item.value;
      } catch (e) {
        console.error('Storage error:', e);
        return null;
      }
    },

    remove(key) {
      localStorage.removeItem(key);
    },

    clear() {
      localStorage.clear();
    },

    getSize() {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return (total / 1024).toFixed(2) + ' KB';
    }
  };

  // ===================================
  // 20. KEYBOARD SHORTCUTS - NEW
  // ===================================
  const KeyboardShortcuts = {
    init() {
      document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          document.getElementById('search-input')?.focus();
        }

        // Ctrl/Cmd + B: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          if (Sidebar.isOpen()) {
            Sidebar.close();
          } else {
            Sidebar.open();
          }
        }

        // Ctrl/Cmd + D: Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
          e.preventDefault();
          document.getElementById('theme-toggle')?.click();
        }

        // ? key: Show keyboard shortcuts
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
          this.showShortcuts();
        }
      });
    },

    showShortcuts() {
      const shortcuts = `
        <strong>Keyboard Shortcuts:</strong><br><br>
        Ctrl/Cmd + K: Focus search<br>
        Ctrl/Cmd + B: Toggle sidebar<br>
        Ctrl/Cmd + D: Toggle dark mode<br>
        ?: Show this help<br>
        ESC: Close modals/sidebar
      `;

      Toast.show(shortcuts, 'info', 5000);
    }
  };

  // ===================================
  // 21. SMOOTH ANCHOR LINKS - ENHANCED
  // ===================================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            Utils.smoothScrollTo(target, 100);
            
            // Update URL without jumping
            if (history.pushState) {
              history.pushState(null, null, href);
            }
          }
        });
      });
    }
  };

  // ===================================
  // 22. VISITOR COUNTER - NEW
  // ===================================
  const VisitorCounter = {
    init() {
      const visits = parseInt(StorageManager.get('visit_count') || '0');
      const newCount = visits + 1;
      
      StorageManager.set('visit_count', newCount);

      if (newCount === 1) {
        console.log('👋 Selamat datang di Roof Top Cafe!');
      } else if (newCount === 10) {
        Toast.show('🎉 Terima kasih sudah 10x mengunjungi kami!', 'success');
      } else if (newCount % 50 === 0) {
        Toast.show(`🌟 Wow! Kunjungan ke-${newCount}! Terima kasih atas kesetiaan Anda!`, 'success');
      }

      console.log(`📊 Visit Count: ${newCount}`);
    }
  };

  // ===================================
  // 23. PROMO BANNER AUTO ROTATE - NEW
  // ===================================
  const PromoBanner = {
    promos: [
      { icon: '🎉', text: 'PROMO SPESIAL! Diskon 20% untuk pembelian Arabika Sumatera. Berlaku hingga akhir bulan!' },
      { icon: '☕', text: 'GRATIS ONGKIR untuk pembelian di atas Rp 100.000! Pesan sekarang!' },
      { icon: '🎁', text: 'Beli 2 Gratis 1! Promo spesial untuk pelanggan setia kami!' },
      { icon: '⭐', text: 'Member Baru? Dapatkan diskon 15% untuk pembelian pertama!' }
    ],
    currentIndex: 0,

    init() {
      const promoContent = document.querySelector('.promo-content p');
      if (!promoContent) return;

      setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.promos.length;
        const promo = this.promos[this.currentIndex];
        
        promoContent.style.animation = 'fadeOut 0.3s ease-out';
        
        setTimeout(() => {
          promoContent.innerHTML = `<strong>${promo.text}</strong>`;
          promoContent.style.animation = 'fadeIn 0.3s ease-in';
        }, 300);
      }, 8000);
    }
  };

  // ===================================
  // 24. YEAR AUTO UPDATE
  // ===================================
  const YearUpdate = {
    init() {
      const yearElements = document.querySelectorAll('#year');
      const currentYear = new Date().getFullYear();
      
      yearElements.forEach(el => {
        el.textContent = currentYear;
      });
    }
  };

  // ===================================
  // 25. CONSOLE BRANDING - NEW
  // ===================================
  const ConsoleBranding = {
    init() {
      const styles = [
        'font-size: 24px',
        'font-weight: bold',
        'color: #D4AF37',
        'text-shadow: 2px 2px 4px rgba(0,0,0,0.3)',
        'padding: 10px'
      ].join(';');

      console.log('%c☕ Roof Top Cafe', styles);
      console.log('%cSelamat datang! Enjoy your premium coffee experience', 'font-size: 14px; color: #2C1810;');
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D4AF37;');
      console.log('%cWebsite Version: 3.0', 'color: #5D4037;');
      console.log('%cDevelopment: Enhanced with love ❤️ & ☕', 'color: #5D4037;');
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D4AF37;');
      console.log('%cKeyboard Shortcuts: Press "?" for help', 'color: #795548; font-style: italic;');
    }
  };

  // ===================================
  // 26. ERROR HANDLER - NEW
  // ===================================
  const ErrorHandler = {
    init() {
      window.addEventListener('error', (e) => {
        console.error('❌ Error caught:', e.message);
        // Optionally report to analytics
      });

      window.addEventListener('unhandledrejection', (e) => {
        console.error('❌ Unhandled promise rejection:', e.reason);
      });
    }
  };

  // ===================================
  // MAIN INITIALIZATION
  // ===================================
  const App = {
    init() {
      console.log('🚀 Initializing Roof Top Cafe...');

      try {
        // Core features
        Sidebar.init();
        DropdownMenu.init();
        Search.init();
        DarkMode.init();
        Cart.init();
        NavbarScroll.init();
        BackToTop.init();
        Newsletter.init();
        TestimonialSlider.init();
        ScrollAnimations.init();
        ContactForm.init();
        FAQ.init();
        
        // Enhanced features
        FloatingBeans.init();
        LazyLoad.init();
        Parallax.init();
        QuickView.init();
        PerformanceMonitor.init();
        KeyboardShortcuts.init();
        SmoothScroll.init();
        VisitorCounter.init();
        PromoBanner.init();
        YearUpdate.init();
        ConsoleBranding.init();
        ErrorHandler.init();

        // Mark body as loaded
        document.body.classList.add('loaded');

        console.log('✅ Roof Top Cafe initialized successfully!');
      } catch (error) {
        console.error('❌ Initialization error:', error);
      }
    }
  };

  // ===================================
  // START APPLICATION
  // ===================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

  // ===================================
  // EXPORT FOR DEBUGGING (Optional)
  // ===================================
  window.RooftopCafe = {
    version: '3.0.0',
    modules: {
      Sidebar,
      Cart,
      DarkMode,
      Toast,
      StorageManager,
      Utils
    },
    features: [
      'Enhanced Sidebar',
      'Smart Search',
      'Dark Mode',
      'Shopping Cart',
      'Scroll Effects',
      'Form Validation',
      'Testimonial Slider',
      'Toast Notifications',
      'Lazy Loading',
      'Parallax Effect',
      'Quick View',
      'Performance Monitor',
      'Keyboard Shortcuts',
      'Visitor Counter',
      'Auto Promo Rotation',
      'Error Handling'
    ],
    config: CONFIG,
    stats: {
      cartItems: () => Cart.getItemCount(),
      cartTotal: () => Cart.getTotal(),
      storageSize: () => StorageManager.getSize(),
      visitCount: () => StorageManager.get('visit_count')
    }
  };

  console.log('%cRooftopCafe API available at window.RooftopCafe', 'color: #D4AF37; font-weight: bold;');

})();