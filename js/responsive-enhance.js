// Responsive Enhancement JavaScript
(function() {
  'use strict';

  // Mobile Navigation Enhancement
  function enhanceMobileNav() {
    const navbar = document.querySelector('.navbar');
    const nav = document.querySelector('header nav');
    const body = document.body;
    
    if (navbar && nav) {
      // Create overlay for mobile menu
      const overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease;
        z-index: 1000;
      `;
      body.appendChild(overlay);
      
      // Toggle menu function
      function toggleMenu() {
        nav.classList.toggle('shownav');
        if (nav.classList.contains('shownav')) {
          overlay.style.opacity = '1';
          overlay.style.visibility = 'visible';
          body.style.overflow = 'hidden';
          navbar.innerHTML = '<a class="navbutton" href="#">✕</a>';
        } else {
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
          body.style.overflow = '';
          navbar.innerHTML = '<a class="navbutton" href="#">☰</a>';
        }
      }
      
      // Event listeners
      navbar.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
      });
      
      overlay.addEventListener('click', toggleMenu);
      
      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('shownav')) {
          toggleMenu();
        }
      });
      
      // Close menu when clicking on a link
      const navLinks = nav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', function() {
          if (window.innerWidth < 768) {
            toggleMenu();
          }
        });
      });
    }
  }

  // Responsive Tables
  function makeTablesResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.cssText = 'overflow-x: auto; -webkit-overflow-scrolling: touch;';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  }

  // Lazy Loading Images
  function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  // Smooth Scroll Enhancement
  function enhanceSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Touch-friendly hover states
  function setupTouchFriendly() {
    let touch = false;
    
    document.addEventListener('touchstart', function() {
      touch = true;
      document.body.classList.add('touch-device');
    }, { passive: true });
    
    document.addEventListener('mousemove', function() {
      if (!touch) {
        document.body.classList.remove('touch-device');
      }
    });
  }

  // Responsive sidebar for tablets
  function setupTabletSidebar() {
    const openAside = document.querySelector('.openaside');
    const closeAside = document.querySelector('.closeaside');
    const asidePart = document.querySelector('#asidepart');
    const main = document.querySelector('#main');
    
    if (openAside && closeAside && asidePart) {
      openAside.addEventListener('click', function(e) {
        e.preventDefault();
        asidePart.classList.add('fadeIn');
        openAside.style.display = 'none';
        if (window.innerWidth >= 768 && window.innerWidth < 1024) {
          main.style.marginRight = '320px';
        }
      });
      
      closeAside.addEventListener('click', function(e) {
        e.preventDefault();
        asidePart.classList.remove('fadeIn');
        openAside.style.display = 'block';
        main.style.marginRight = '';
      });
    }
  }

  // Viewport height fix for mobile browsers
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Performance: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Handle window resize
  const handleResize = debounce(function() {
    setViewportHeight();
    
    // Reset mobile menu on desktop resize
    if (window.innerWidth >= 768) {
      const nav = document.querySelector('header nav');
      const overlay = document.querySelector('.nav-overlay');
      if (nav && nav.classList.contains('shownav')) {
        nav.classList.remove('shownav');
        document.body.style.overflow = '';
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
        }
      }
    }
  }, 250);

  // Initialize all enhancements
  function init() {
    enhanceMobileNav();
    makeTablesResponsive();
    setupLazyLoading();
    enhanceSmoothScroll();
    setupTouchFriendly();
    setupTabletSidebar();
    setViewportHeight();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Add loaded class for animations
    document.body.classList.add('js-loaded');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Service Worker for offline support (optional)
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

})();