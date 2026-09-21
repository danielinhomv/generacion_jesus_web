(function () {
  "use strict";

  var DESKTOP = 1025;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isDesktop() { return window.matchMedia("(min-width: " + DESKTOP + "px)").matches; }

  /* ══════════════════════════════════════════
     HEADER — hamburger + dropdowns + scroll
  ══════════════════════════════════════════ */
  function closeDropdowns(header) {
    qsa("[data-dropdown]", header).forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = qs("[data-dropdown-toggle]", item);
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  function bindHeader(header) {
    var menuToggle = qs("[data-jg-menu-toggle]", header);
    var nav        = qs("#jg-primary-nav", header);

    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeDropdowns(header);
      });
    }

    qsa("[data-dropdown]", header).forEach(function (item) {
      var toggle = qs("[data-dropdown-toggle]", item);
      if (!toggle) return;
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = !item.classList.contains("is-open");
        closeDropdowns(header);
        item.classList.toggle("is-open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    qsa(".jg-dropdown a", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    });

    /* close action-dropdowns when their links are clicked */
    qsa(".jg-dropdown--action a", header).forEach(function (link) {
      link.addEventListener("click", function () {
        closeDropdowns(header);
      });
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeDropdowns(header);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdowns(header);
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      if (isDesktop()) {
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    if (nav) {
      nav.addEventListener("focusout", function (e) {
        if (!header.contains(e.relatedTarget)) closeDropdowns(header);
      });
    }
  }

  function bindScroll() {
    var header = qs("[data-jg-header]");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     SMOOTH SCROLL — offset for sticky header
  ══════════════════════════════════════════ */
  function bindSmoothScroll() {
    var header = qs("[data-jg-header]");
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute("href");
      if (!hash || hash === "#" || hash === "#es") return;
      var target = qs(hash);
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 12;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ══════════════════════════════════════════
     CATEGORY BAR — highlight active on scroll
  ══════════════════════════════════════════ */
  function bindCategoryHighlight() {
    if (!("IntersectionObserver" in window)) return;
    var catBtns = qsa(".jg-cat-btn");
    if (!catBtns.length) return;

    var sections = [];
    catBtns.forEach(function (btn) {
      var hash = btn.getAttribute("href");
      if (!hash || hash[0] !== "#") return;
      var el = qs(hash);
      if (el) sections.push({ btn: btn, el: el });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        catBtns.forEach(function (b) { b.classList.remove("is-active"); });
        var activeBtn = catBtns.find(function (b) { return b.getAttribute("href") === id; });
        if (activeBtn) activeBtn.classList.add("is-active");
      });
    }, { threshold: 0.25 });

    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ══════════════════════════════════════════
     NEWSLETTER
  ══════════════════════════════════════════ */
  function bindNewsletter() {
    qsa("[data-jg-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = qs("[data-jg-newsletter-status]", form);
        var email  = qs('input[type="email"]', form);
        if (!email || !email.value) return;
        if (status) {
          status.hidden = false;
          status.textContent = "Preview only: on the live site this submits through a GoHighLevel form.";
        }
        form.reset();
      });
    });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindScroll();
    bindSmoothScroll();
    bindCategoryHighlight();
    bindNewsletter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
