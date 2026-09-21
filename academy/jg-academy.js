(function () {
  "use strict";

  var DESKTOP = 1025;
  var bound = false;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function isDesktop() {
    return window.matchMedia("(min-width: " + DESKTOP + "px)").matches;
  }

  function closeDropdowns(header) {
    qsa("[data-dropdown]", header).forEach(function (item) {
      item.classList.remove("is-open");
      var toggle = qs("[data-dropdown-toggle]", item);
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }

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

    if (menuToggle) {
      menuToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeDropdowns(header);
      });
    }

    qsa("[data-dropdown]", header).forEach(function (item) {
      var toggle = qs("[data-dropdown-toggle]", item);
      if (!toggle) return;
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
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
  }

  function bindGlobal() {
    if (bound) return;
    bound = true;

    document.addEventListener("click", function (event) {
      qsa("[data-jg-header]").forEach(function (header) {
        if (!header.contains(event.target)) closeDropdowns(header);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      qsa("[data-jg-header]").forEach(function (header) {
        closeDropdowns(header);
        header.classList.remove("is-open");
        var toggle = qs("[data-jg-menu-toggle]", header);
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

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

    window.addEventListener(
      "scroll",
      function () {
        qsa("[data-jg-header]").forEach(function (header) {
          header.classList.toggle("is-scrolled", window.scrollY > 8);
        });
      },
      { passive: true }
    );

    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (!id || id === "#" || id === "#es") return;
      var target = qs(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    qsa("[data-jg-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var status = qs("[data-jg-newsletter-status]", form);
        if (status) {
          status.hidden = false;
          status.textContent = "Preview only: on the live site this submits through a GoHighLevel form.";
        }
        form.reset();
      });
    });
  }

  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindGlobal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("load", init);
})();
