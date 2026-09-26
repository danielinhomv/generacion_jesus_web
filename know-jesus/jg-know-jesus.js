(function () {
  "use strict";

  var DESKTOP = 1025;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function isDesktop() {
    return window.matchMedia("(min-width: " + DESKTOP + "px)").matches;
  }

  /* ══════════════════════════════════════════
     HEADER — Hamburger + Dropdowns
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
    var menuClose  = qs("[data-jg-menu-close]", header);

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = header.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open && !isDesktop() ? "hidden" : "";
        if (!open) closeDropdowns(header);
      });
    }

    if (menuClose) {
      menuClose.addEventListener("click", function (e) {
        e.preventDefault();
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    }

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

    qsa(".jg-nav a:not([data-dropdown-toggle])", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdowns(header);
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeDropdowns(header);
    });

    window.addEventListener("resize", function () {
      if (isDesktop()) {
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

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
     SMOOTH SCROLL
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

      var offset = header ? header.offsetHeight + 12 : 12;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: top, behavior: "smooth" });
    });
  }

  /* ══════════════════════════════════════════
     UX: SCROLLSPY DE LA BARRA HORIZONTAL DE PASOS
     La barra ("#stepsHbar") ya no se controla por JS: en jg-know-jesus.css
     usa `position: sticky`, así que el navegador la mantiene siempre
     visible arriba mientras se hace scroll dentro de la sección de pasos,
     sin cálculos manuales ni saltos. Aquí solo queda resaltar el enlace
     del paso activo y mostrar/ocultar el botón flotante en móvil.
  ══════════════════════════════════════════ */
  function bindGospelUX() {
    var steps = qsa(".jg-section--step");
    var sideLinks = qsa(".jg-side-link");
    var floatPrayBtn = qs("#floatPrayBtn");

    if (!steps.length) return;

    // IntersectionObserver para detectar el paso activo y resaltarlo en la barra
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var stepNum = parseInt(entry.target.getAttribute("data-step"), 10);
            if (isNaN(stepNum)) return;

            sideLinks.forEach(function (link) {
              var linkStep = parseInt(link.getAttribute("data-step-nav"), 10);
              link.classList.toggle("is-active", linkStep === stepNum);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    steps.forEach(function (step) {
      observer.observe(step);
    });

    // Control de visibilidad del botón flotante "RECEIVE JESUS" en móvil
    window.addEventListener("scroll", function () {
      var firstStep = steps[0];
      var lastStep = steps[steps.length - 1];

      if (!firstStep || !lastStep || !floatPrayBtn) return;

      var firstTop = firstStep.getBoundingClientRect().top;
      var lastBottom = lastStep.getBoundingClientRect().bottom;
      var inGospelArea = firstTop < window.innerHeight && lastBottom > 0;

      var receiveStep = qs("#receive");
      var receiveTop = receiveStep ? receiveStep.getBoundingClientRect().top : 9999;
      var showFloat = inGospelArea && receiveTop > (window.innerHeight - 100) && !isDesktop();
      floatPrayBtn.classList.toggle("is-visible", showFloat);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════
     UX: BOTÓN INTERACTIVO "I HAVE PRAYED TODAY"
  ══════════════════════════════════════════ */
  function bindPrayerAction() {
    var btn = qs("#btnIHavePrayed");
    var successMsg = qs("#prayerSuccessMsg");

    if (!btn || !successMsg) return;

    btn.addEventListener("click", function () {
      btn.style.display = "none";
      successMsg.hidden = false;

      // Desplazamiento suave al mensaje de celebración
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ══════════════════════════════════════════
     NEWSLETTER & STEP REVEAL
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
            (document.documentElement.lang === "es" ? "Vista previa: en el sitio publicado esto se envía con un formulario de GoHighLevel." : "Preview only: on the live site this submits through a GoHighLevel form.");
        }
        form.reset();
      });
    });
  }

  function bindStepReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var viewH = window.innerHeight || document.documentElement.clientHeight;
    var sections = qsa("#main section").filter(function (el) {
      if (el.classList.contains("jg-hero")) return false;
      if (el.querySelector("section")) return false;
      return true;
    });

    function onFirstScreen(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < viewH - 8 && rect.bottom > 48;
    }

    function stampDelays(section) {
      var bits = qsa(".jg-reveal, .jg-way-card, .jg-gospel-step, .jg-next-grid article, .jg-connect-card", section);
      if (bits.length < 2) return;
      bits.forEach(function (el, i) {
        el.classList.add("jg-reveal");
        el.style.setProperty("--jg-d", Math.min(i, 7) * 0.09 + "s");
      });
    }

    var pending = [];

    sections.forEach(function (el) {
      stampDelays(el);
      el.classList.add("jg-reveal-block");
      if (onFirstScreen(el)) {
        el.classList.add("is-shown");
      } else {
        pending.push(el);
        el.addEventListener("focusin", function () {
          el.classList.add("is-in");
        });
      }
    });

    if (!pending.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    pending.forEach(function (el) { observer.observe(el); });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindScroll();
    bindSmoothScroll();
    bindGospelUX();
    bindPrayerAction();
    bindNewsletter();
    bindStepReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();