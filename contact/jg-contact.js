/* Jesus Generation — Contact page JS
   Matches the pattern from jg-about.js:
   - IIFE, "use strict", no dependencies
   - Header: sticky detection, mobile toggle, dropdown, keyboard/outside-click close
   - Smooth-scroll for anchor links
   - Footer: dynamic copyright year
   - Contact form: client-side validation + preview submission handler
     (In GHL, replace the <form> block with a native Form/Survey widget;
      this script's form logic is for local browser preview only.)
*/
(function () {
  "use strict";

  /* ─── constants ─────────────────────────────────────────────────────────── */
  var DESKTOP = 1025;
  var bound   = false;

  /* ─── tiny DOM helpers ───────────────────────────────────────────────────── */
  function qs(sel, root)  { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isDesktop()    { return window.matchMedia("(min-width: " + DESKTOP + "px)").matches; }

  /* ─────────────────────────────────────────────────────────────────────────
     HEADER
  ───────────────────────────────────────────────────────────────────────── */
  function closeDropdowns(header) {
    qsa("[data-dropdown]", header).forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = qs("[data-dropdown-toggle]", item);
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

  /** Detect whether a GHL parent container breaks position:sticky and
   *  fall back to position:fixed when necessary. */
  function parentBreaksSticky(el) {
    var parent = el.parentElement;
    while (parent && parent !== document.documentElement) {
      var style = window.getComputedStyle(parent);
      if (/(auto|scroll|hidden)/.test(style.overflowY) || style.overflow === "hidden") {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function hardenHeader(header) {
    var page = header.closest(".jg-page") || document.body;
    if (parentBreaksSticky(header)) {
      header.classList.add("is-fixed");
      page.classList.add("is-header-fixed");
      page.style.setProperty("--jg-header", header.offsetHeight + "px");
    } else {
      header.classList.remove("is-fixed");
      page.classList.remove("is-header-fixed");
    }
  }

  function bindHeader(header) {
    if (header.getAttribute("data-jg-ready") === "true") return;
    header.setAttribute("data-jg-ready", "true");

    var menuToggle = qs("[data-jg-menu-toggle]", header);
    hardenHeader(header);

    /* ── mobile hamburger ── */
    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeDropdowns(header);
      });
    }

    /* ── dropdown toggles ── */
    qsa("[data-dropdown]", header).forEach(function (item) {
      var toggle = qs("[data-dropdown-toggle]", item);
      if (!toggle) return;
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var willOpen = !item.classList.contains("is-open");
        closeDropdowns(header);
        item.classList.toggle("is-open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    /* ── close menu when a dropdown link is clicked ── */
    qsa(".jg-dropdown a", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     GLOBAL EVENT LISTENERS  (bound once)
  ───────────────────────────────────────────────────────────────────────── */
  function bindGlobal() {
    if (bound) return;
    bound = true;

    /* close dropdowns when clicking outside header */
    document.addEventListener("click", function (e) {
      qsa("[data-jg-header]").forEach(function (header) {
        if (!header.contains(e.target)) closeDropdowns(header);
      });
    });

    /* Escape key closes dropdowns / mobile menu */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      qsa("[data-jg-header]").forEach(function (header) {
        closeDropdowns(header);
        header.classList.remove("is-open");
        var toggle = qs("[data-jg-menu-toggle]", header);
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

    /* resize: re-evaluate sticky fallback + collapse mobile menu */
    window.addEventListener("resize", function () {
      qsa("[data-jg-header]").forEach(function (header) {
        hardenHeader(header);
        if (isDesktop()) {
          header.classList.remove("is-open");
          var toggle = qs("[data-jg-menu-toggle]", header);
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    /* scroll: add .is-scrolled class for drop-shadow enhancement */
    window.addEventListener(
      "scroll",
      function () {
        qsa("[data-jg-header]").forEach(function (header) {
          header.classList.toggle("is-scrolled", window.scrollY > 8);
        });
      },
      { passive: true }
    );

    /* smooth-scroll for in-page anchor links */
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (!id || id === "#" || id === "#es") return;
      var target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     FOOTER YEAR
  ───────────────────────────────────────────────────────────────────────── */
  function stampYear() {
    qsa("[data-jg-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     CONTACT FORM  (preview / local browser only)
     In GHL: remove this entire block and replace the <form> with a
     native GHL Form/Survey widget.  Routing tags per Build Sheet:
       - Academy Question   → tag JG-Academy
       - Mission Trip       → tag JG-Mission-Trip
       - Giving/Donor       → tag JG-Donor
       - Prayer Request     → redirect /contact/prayer
       - Media/Speaking     → redirect /contact/media-speaking
  ───────────────────────────────────────────────────────────────────────── */

  /* Inline error helpers */
  function setError(input, errId, message) {
    var err = qs("#" + errId);
    input.classList.add("is-error");
    input.setAttribute("aria-describedby", errId);
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
  }

  function clearError(input, errId) {
    var err = qs("#" + errId);
    input.classList.remove("is-error");
    input.removeAttribute("aria-describedby");
    if (err) {
      err.textContent = "";
      err.hidden = true;
    }
  }

  function validateForm(form) {
    var valid = true;

    var firstName = qs("#f-first-name", form);
    var lastName  = qs("#f-last-name",  form);
    var email     = qs("#f-email",      form);
    var category  = qs("#f-category",   form);
    var message   = qs("#f-message",    form);

    /* First name */
    if (!firstName.value.trim()) {
      setError(firstName, "err-first-name", "First name is required.");
      valid = false;
    } else {
      clearError(firstName, "err-first-name");
    }

    /* Last name */
    if (!lastName.value.trim()) {
      setError(lastName, "err-last-name", "Last name is required.");
      valid = false;
    } else {
      clearError(lastName, "err-last-name");
    }

    /* Email — basic format check */
    var emailVal = email.value.trim();
    if (!emailVal) {
      setError(email, "err-email", "Email address is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError(email, "err-email", "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(email, "err-email");
    }

    /* Category */
    if (!category.value) {
      setError(category, "err-category", "Please select an inquiry category.");
      valid = false;
    } else {
      clearError(category, "err-category");
    }

    /* Message */
    if (!message.value.trim()) {
      setError(message, "err-message", "A message is required.");
      valid = false;
    } else if (message.value.trim().length < 10) {
      setError(message, "err-message", "Please provide a bit more detail.");
      valid = false;
    } else {
      clearError(message, "err-message");
    }

    return valid;
  }

  /** Inline clear-error on input so the user gets immediate positive feedback */
  function bindLiveValidation(form) {
    var pairs = [
      { id: "f-first-name", errId: "err-first-name" },
      { id: "f-last-name",  errId: "err-last-name"  },
      { id: "f-email",      errId: "err-email"      },
      { id: "f-category",   errId: "err-category"   },
      { id: "f-message",    errId: "err-message"    },
    ];
    pairs.forEach(function (pair) {
      var el = qs("#" + pair.id, form);
      if (!el) return;
      el.addEventListener("input",  function () { if (el.classList.contains("is-error")) clearError(el, pair.errId); });
      el.addEventListener("change", function () { if (el.classList.contains("is-error")) clearError(el, pair.errId); });
    });
  }

  function bindContactForm() {
    var form = qs("[data-jg-form]");
    if (!form) return;

    bindLiveValidation(form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateForm(form)) {
        /* focus first error field for accessibility */
        var firstErr = qs(".is-error", form);
        if (firstErr) firstErr.focus();
        return;
      }

      /* ── Preview-mode submission ── */
      var btn      = qs("[type='submit']", form);
      var label    = qs("[data-jg-btn-label]", btn);
      var spinner  = qs("[data-jg-spinner]",   btn);
      var success  = qs("[data-jg-success]",   form);

      /* Show spinner */
      if (label)   label.hidden   = true;
      if (spinner) spinner.hidden = false;
      btn.disabled = true;

      /* Simulate async submission (replace with GHL widget in production) */
      setTimeout(function () {
        if (label)   label.hidden   = false;
        if (spinner) spinner.hidden = true;
        btn.disabled = false;

        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        form.reset();
      }, 1200);
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────────────────────── */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindGlobal();
    stampYear();
    bindContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Also run on load in case GHL injects the header after DOMContentLoaded */
  window.addEventListener("load", init);

})();
