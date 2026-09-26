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
     HEADER — Hamburger + Fullscreen Mobile Menu + Dropdowns
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

    /* Abrir menú móvil estilo NSCA */
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

    /* Botón X para cerrar en móvil */
    if (menuClose) {
      menuClose.addEventListener("click", function (e) {
        e.preventDefault();
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    }

    /* Manejo de Dropdowns de navegación y botones de acción */
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

    /* Cerrar el overlay al hacer clic en cualquier enlace interno */
    qsa(".jg-nav a:not([data-dropdown-toggle])", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
        closeDropdowns(header);
      });
    });

    /* Tecla Escape cierra el menú */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeDropdowns(header);
        header.classList.remove("is-open");
        document.body.style.overflow = "";
        if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    /* Clic fuera del header cierra dropdowns */
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) closeDropdowns(header);
    });

    /* Reset en cambio de tamaño a escritorio */
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
     AUTOPLAY, SWIPE Y FLECHAS PARA CARRUSELES MÓVILES CADA 5S
  ══════════════════════════════════════════ */
  function bindMobileCarousels() {
    qsa("[data-carousel]").forEach(function (wrapper) {
      var container = qs(".jg-slider-mobile", wrapper);
      var prevBtn = qs(".jg-carousel-prev", wrapper);
      var nextBtn = qs(".jg-carousel-next", wrapper);

      if (!container) return;

      function getScrollAmount() {
        var card = qs("article", container);
        return card ? card.offsetWidth + 20 : 300;
      }

      function scrollNext() {
        if (isDesktop()) return;
        var maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        }
      }

      function scrollPrev() {
        if (isDesktop()) return;
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
        } else {
          container.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        }
      }

      /* Listeners para las flechas flotantes en móvil */
      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          scrollPrev();
          resetAutoplay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          scrollNext();
          resetAutoplay();
        });
      }

      /* Autoplay cada 5 segundos */
      var autoplayTimer = setInterval(scrollNext, 5000);

      function resetAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(scrollNext, 5000);
      }

      container.addEventListener("touchstart", function () {
        clearInterval(autoplayTimer);
      }, { passive: true });

      container.addEventListener("touchend", function () {
        resetAutoplay();
      }, { passive: true });
    });
  }

  /* ══════════════════════════════════════════
     ANIMACIÓN DE CONTADORES (COUNTER ANIMATION)
  ══════════════════════════════════════════ */
  function bindCounters() {
    var counterSection = qs("#counter-section");
    var counters = qsa(".jg-counter");
    if (!counterSection || !counters.length) return;

    var animated = false;

    function animateCounters() {
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute("data-target"), 10);
        if (isNaN(target)) return;

        var count = 0;
        var duration = 1800;
        var stepTime = 20;
        var steps = duration / stepTime;
        var increment = target / steps;

        var timer = setInterval(function () {
          count += increment;
          if (count >= target) {
            counter.textContent = target.toLocaleString(document.documentElement.lang === "es" ? "es-419" : "en-US") + "+";
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(count).toLocaleString(document.documentElement.lang === "es" ? "es-419" : "en-US");
          }
        }, stepTime);
      });
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated) {
              animated = true;
              animateCounters();
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(counterSection);
    } else {
      animateCounters();
    }
  }

  /* ══════════════════════════════════════════
     NEWSLETTER
  ══════════════════════════════════════════ */
  function bindNewsletter() {
    qsa("[data-jg-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = qs("[data-jg-newsletter-status]", form);
        var email = qs('input[type="email"]', form);
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

  /* ══════════════════════════════════════════
     ANIMACIÓN DE ENTRADA AL SCROLL (SCROLL REVEAL)
  ══════════════════════════════════════════ */
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
    bindMobileCarousels();
    bindCounters();
    bindNewsletter();
    bindStepReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();