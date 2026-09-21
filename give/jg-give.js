/**
 * jg-give.js — Give page behaviour
 * Same pattern as jg-about.js / jg-contact.js
 */
(function () {
  'use strict';

  var DESKTOP = 1025;
  var bound   = false;

  function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isDesktop()   { return window.matchMedia('(min-width:' + DESKTOP + 'px)').matches; }

  /* ── Close all dropdowns in a header ── */
  function closeDropdowns(header) {
    qsa('[data-dropdown]', header).forEach(function (item) {
      item.classList.remove('is-open');
      var t = qs('[data-dropdown-toggle]', item);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }

  /* ── Detect GHL overflow:hidden parents that break sticky ── */
  function parentBreaksSticky(el) {
    var p = el.parentElement;
    while (p && p !== document.documentElement) {
      var s = window.getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(s.overflowY) || s.overflow === 'hidden') return true;
      p = p.parentElement;
    }
    return false;
  }

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

  /* ── Bind one header ── */
  function bindHeader(header) {
    if (header.getAttribute('data-jg-ready') === 'true') return;
    header.setAttribute('data-jg-ready', 'true');

    var toggle = qs('[data-jg-menu-toggle]', header);
    hardenHeader(header);

    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var open = header.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (!open) closeDropdowns(header);
      });
    }

    qsa('[data-dropdown]', header).forEach(function (item) {
      var btn = qs('[data-dropdown-toggle]', item);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var willOpen = !item.classList.contains('is-open');
        closeDropdowns(header);
        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });

    qsa('.jg-dropdown a', header).forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        closeDropdowns(header);
      });
    });

    /* close action-dropdowns when their links are clicked */
    qsa('.jg-dropdown--action a', header).forEach(function (link) {
      link.addEventListener('click', function () {
        closeDropdowns(header);
      });
    });
  }

  /* ── Global listeners (bound once) ── */
  function bindGlobal() {
    if (bound) return;
    bound = true;

    document.addEventListener('click', function (e) {
      qsa('[data-jg-header]').forEach(function (h) {
        if (!h.contains(e.target)) closeDropdowns(h);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      qsa('[data-jg-header]').forEach(function (h) {
        closeDropdowns(h);
        h.classList.remove('is-open');
        var t = qs('[data-jg-menu-toggle]', h);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });

    window.addEventListener('resize', function () {
      qsa('[data-jg-header]').forEach(function (h) {
        hardenHeader(h);
        if (isDesktop()) {
          h.classList.remove('is-open');
          var t = qs('[data-jg-menu-toggle]', h);
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });

    window.addEventListener('scroll', function () {
      qsa('[data-jg-header]').forEach(function (h) {
        h.classList.toggle('is-scrolled', window.scrollY > 8);
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

  /* ── Init ── */
  function init() {
    qsa('[data-jg-header]').forEach(bindHeader);
    bindGlobal();
    stampYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);

})();
