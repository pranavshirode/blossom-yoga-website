// ==========================================================================
// BLOSSOM — shared interactions
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- dark mode toggle ---------- */
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  var themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  });

  /* ---------- header scroll shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile menu ---------- */
  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('.main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-question');
    var a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      q.setAttribute('aria-expanded', (!isOpen).toString());
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- gallery filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var masonryItems = document.querySelectorAll('.masonry-item[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        masonryItems.forEach(function (item) {
          var match = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.hidden = !match;
        });
      });
    });
  }

  /* ---------- contact form (Telegram + API submit) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) { valid = false; field.style.borderColor = '#C7625B'; }
        else { field.style.borderColor = ''; }
      });
      if (!valid) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Extract form data into a plain object
      var formDataObj = {};
      new FormData(form).forEach(function(value, key) {
        formDataObj[key] = value;
      });

      fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
      })
      .then(function(response) {
        if (!response.ok) throw new Error('Network response was not ok');
        form.style.display = 'none';
        var success = document.getElementById('form-success');
        if (success) success.classList.add('show');
      })
      .catch(function(error) {
        console.error('Error!', error.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('There was an error submitting your form. Please try again.');
      });
    });
  }

  /* ---------- newsletter (UI-only submit) ---------- */
  var newsletter = document.querySelector('.newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = newsletter.querySelector('button');
      var original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      newsletter.querySelector('input').value = '';
      setTimeout(function () { btn.textContent = original; }, 2600);
    });
  }

  /* ---------- current year ---------- */
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- scroll popup ---------- */
  var popup = document.getElementById('scroll-popup');
  if (popup) {
    var hasPopped = false;
    var onScrollPopup = function () {
      if (!hasPopped && window.scrollY > 800) {
        popup.showModal();
        hasPopped = true;
        window.removeEventListener('scroll', onScrollPopup);
      }
    };
    window.addEventListener('scroll', onScrollPopup, { passive: true });
    
    // light dismiss
    popup.addEventListener('click', function (e) {
      if (e.target === popup) popup.close();
    });
    
    var closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        popup.close();
      });
    }
  }

});
