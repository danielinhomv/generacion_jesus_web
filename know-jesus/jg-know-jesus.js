(function () {
  "use strict";

  var DESKTOP = 1025;

  /* ── tiny helpers ── */
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(sel)
    );
  }

  function isDesktop() {
    return window.matchMedia("(min-width: " + DESKTOP + "px)").matches;
  }

  /* ══════════════════════════════════════════
     HEADER — hamburger + scroll shadow
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

    /* hamburger open / close */
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeDropdowns(header);
      });
    }

    /* dropdowns (none on this page, but keeps parity with other pages) */
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

    /* close drawer when a dropdown link is tapped */
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

    /* click outside → close */
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeDropdowns(header);
    });

    /* Escape → close */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdowns(header);
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    /* resize past desktop breakpoint → collapse drawer */
    window.addEventListener("resize", function () {
      if (isDesktop()) {
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    /* focus leaves nav → close dropdowns */
    if (nav) {
      nav.addEventListener("focusout", function (e) {
        if (!header.contains(e.relatedTarget)) closeDropdowns(header);
      });
    }
  }

  /* scroll shadow on header */
  function bindScroll() {
    var header = qs("[data-jg-header]");
    if (!header) return;
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      },
      { passive: true }
    );
  }

  /* ══════════════════════════════════════════
     SMOOTH SCROLL — anchor links
  ══════════════════════════════════════════ */
  function bindSmoothScroll() {
    var header = qs("[data-jg-header]");

    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute("href");
      /* skip non-navigating hashes */
      if (!hash || hash === "#" || hash === "#es") return;

      var target = qs(hash);
      if (!target) return;

      e.preventDefault();

      /* account for sticky header height */
      var offset = header ? header.offsetHeight : 0;
      var top =
        target.getBoundingClientRect().top + window.pageYOffset - offset - 12;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ══════════════════════════════════════════
     NEWSLETTER (footer form — preview stub)
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
          status.textContent =
            "Preview only: on the live site this submits through a GoHighLevel form.";
        }
        form.reset();
      });
    });
  }

  /* ══════════════════════════════════════════
     STEP REVEAL — fade-in on scroll
     Enhances the 7-step gospel presentation
     with a subtle entrance animation.
  ══════════════════════════════════════════ */
  function bindStepReveal() {
    if (!("IntersectionObserver" in window)) return;

    var steps = qsa(".jg-gospel-step, .jg-next-grid article, .jg-connect-card");

    steps.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(22px)";
      el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    steps.forEach(function (el) { observer.observe(el); });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindScroll();
    bindSmoothScroll();
    bindNewsletter();
    bindStepReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
