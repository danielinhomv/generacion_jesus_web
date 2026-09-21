/**
 * jg-get-involved.js
 * Behaviour for the Get Involved page.
 * Mirrors the pattern used in jg-about.js exactly.
 */
(function () {
  'use strict';

  var DESKTOP = 1025;
  var bound   = false;

  function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isDesktop()   { return window.matchMedia('(min-width: ' + DESKTOP + 'px)').matches; }

  /* ── Close all dropdowns in a header ── */
  function closeDropdowns(header) {
    qsa('[data-dropdown]', header).forEach(function (item) {
      item.classList.remove('is-open');
      var toggle = qs('[data-dropdown-toggle]', item);
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── Detect GHL parent containers that break position:sticky ── */
  function parentBreaksSticky(el) {
    var parent = el.parentElement;
    while (parent && parent !== document.documentElement) {
      var style = window.getComputedStyle(parent);
      if (/(auto|scroll|hidden)/.test(style.overflowY) || style.overflow === 'hidden') {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /* ── Fall back to position:fixed only when sticky is broken ── */
  function hardenHeader(header) {
    var page = header.closest('.jg-page') || document.body;
    if (parentBreaksSticky(header)) {
      header.classList.add('is-fixed');
      page.classList.add('is-header-fixed');
      page.style.setProperty('--jg-header', header.offsetHeight + 'px');
    } else {
      header.classList.remove('is-fixed');
      page.classList.remove('is-header-fixed');
    }
  }

  /* ── Bind a single header element ── */
  function bindHeader(header) {
    if (header.getAttribute('data-jg-ready') === 'true') return;
    header.setAttribute('data-jg-ready', 'true');

    var menuToggle = qs('[data-jg-menu-toggle]', header);
    hardenHeader(header);

    /* Mobile hamburger */
    if (menuToggle) {
      menuToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = header.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) closeDropdowns(header);
      });
    }

    /* Dropdown toggles */
    qsa('[data-dropdown]', header).forEach(function (item) {
      var toggle = qs('[data-dropdown-toggle]', item);
      if (!toggle) return;
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var willOpen = !item.classList.contains('is-open');
        closeDropdowns(header);
        item.classList.toggle('is-open', willOpen);
        toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    /* Close menu when a dropdown link is clicked */
    qsa('.jg-dropdown a', header).forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        closeDropdowns(header);
      });
    });
  }

  /* ── Global listeners (bound once) ── */
  function bindGlobal() {
    if (bound) return;
    bound = true;

    /* Close dropdowns when clicking outside the header */
    document.addEventListener('click', function (e) {
      qsa('[data-jg-header]').forEach(function (header) {
        if (!header.contains(e.target)) closeDropdowns(header);
      });
    });

    /* Escape closes dropdowns and mobile menu */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      qsa('[data-jg-header]').forEach(function (header) {
        closeDropdowns(header);
        header.classList.remove('is-open');
        var toggle = qs('[data-jg-menu-toggle]', header);
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Resize: re-evaluate sticky fallback, collapse mobile menu */
    window.addEventListener('resize', function () {
      qsa('[data-jg-header]').forEach(function (header) {
        hardenHeader(header);
        if (isDesktop()) {
          header.classList.remove('is-open');
          var toggle = qs('[data-jg-menu-toggle]', header);
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    /* Scroll: add .is-scrolled for shadow enhancement */
    window.addEventListener('scroll', function () {
      qsa('[data-jg-header]').forEach(function (header) {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
      });
    }, { passive: true });

    /* Smooth-scroll for in-page anchor links */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#' || id === '#es') return;
      var target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── Footer year ── */
  function stampYear() {
    qsa('[data-jg-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ── Newsletter preview stub ── */
  function bindNewsletter() {
    qsa('[data-jg-newsletter]').forEach(function (form) {
      var status = qs('[data-jg-newsletter-status]', form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (status) {
          status.removeAttribute('hidden');
          status.textContent = 'Thank you! You\'re now subscribed.';
        }
        form.reset();
      });
    });
  }

  /* ── Init ── */
  function init() {
    qsa('[data-jg-header]').forEach(bindHeader);
    bindGlobal();
    stampYear();
    bindNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Run again on load in case GHL injects the header after DOMContentLoaded */
  window.addEventListener('load', init);

})();
