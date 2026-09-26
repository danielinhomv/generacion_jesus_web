(function () {
  "use strict";

  var DESKTOP = 1025;

  function qs(sel, root)  { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isDesktop()    { return window.matchMedia("(min-width: " + DESKTOP + "px)").matches; }

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
     CHANNEL CARDS
  ══════════════════════════════════════════ */
  function bindChannelCards() {
    var select = qs("[data-jg-category]");
    var form   = qs("[data-jg-form]");
    if (!select || !form) return;

    qsa("[data-select-category]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var val = btn.getAttribute("data-select-category");

        select.value = val;
        select.dispatchEvent(new Event("change"));

        var header = qs("[data-jg-header]");
        var offset = header ? header.offsetHeight + 16 : 16;
        var top    = form.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });

        setTimeout(function () {
          var firstInput = qs("input, textarea, select", form);
          if (firstInput) firstInput.focus({ preventScroll: true });
        }, 420);
      });
    });
  }

  /* ══════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════ */
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

    var es = document.documentElement.lang === "es";

    if (!firstName.value.trim()) {
      setError(firstName, "err-first-name", es ? "El nombre es obligatorio." : "First name is required.");
      valid = false;
    } else {
      clearError(firstName, "err-first-name");
    }

    if (!lastName.value.trim()) {
      setError(lastName, "err-last-name", es ? "El apellido es obligatorio." : "Last name is required.");
      valid = false;
    } else {
      clearError(lastName, "err-last-name");
    }

    var emailVal = email.value.trim();
    if (!emailVal) {
      setError(email, "err-email", es ? "El correo electrónico es obligatorio." : "Email address is required.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError(email, "err-email", es ? "Escribe un correo electrónico válido." : "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(email, "err-email");
    }

    var phone = qs("#f-phone", form);
    var country = qs("#f-country", form);
    if (phone && !phone.value.trim()) {
      setError(phone, "err-phone", es ? "El teléfono móvil es obligatorio." : "Mobile phone is required.");
      valid = false;
    } else if (phone) {
      clearError(phone, "err-phone");
    }

    if (country && !country.value.trim()) {
      setError(country, "err-country", es ? "El país es obligatorio." : "Country is required.");
      valid = false;
    } else if (country) {
      clearError(country, "err-country");
    }

    if (!category.value) {
      setError(category, "err-category", es ? "Elige una categoría." : "Please select an inquiry category.");
      valid = false;
    } else {
      clearError(category, "err-category");
    }

    if (!message.value.trim()) {
      setError(message, "err-message", es ? "El mensaje es obligatorio." : "A message is required.");
      valid = false;
    } else if (message.value.trim().length < 10) {
      setError(message, "err-message", es ? "Cuéntanos un poco más." : "Please provide a bit more detail.");
      valid = false;
    } else {
      clearError(message, "err-message");
    }

    return valid;
  }

  function bindLiveValidation(form) {
    var pairs = [
      { id: "f-first-name", errId: "err-first-name" },
      { id: "f-last-name",  errId: "err-last-name"  },
      { id: "f-email",      errId: "err-email"      },
      { id: "f-phone",      errId: "err-phone"      },
      { id: "f-country",    errId: "err-country"    },
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
        var firstErr = qs(".is-error", form);
        if (firstErr) firstErr.focus();
        return;
      }

      var btn      = qs("[type='submit']", form);
      var label    = qs("[data-jg-btn-label]", btn);
      var spinner  = qs("[data-jg-spinner]",   btn);
      var success  = qs("[data-jg-success]",   form);

      if (label)   label.hidden   = true;
      if (spinner) spinner.hidden = false;
      btn.disabled = true;

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

  /* ══════════════════════════════════════════
     FOOTER YEAR
  ══════════════════════════════════════════ */
  function stampYear() {
    qsa("[data-jg-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
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

    pending.forEach(function (el) { observer.observe(el);     });
  }

  function applyInquiryHash() {
    var hash = (window.location.hash || "").replace(/^#/, "");
    if (!hash || hash === "es") return;

    var select = qs("[data-jg-category]");
    var form = qs("[data-jg-form]");
    if (!select || !form) return;
    if (!qs('option[value="' + hash + '"]', select)) return;

    select.value = hash;
    select.dispatchEvent(new Event("change"));

    var header = qs("[data-jg-header]");
    var offset = header ? header.offsetHeight + 16 : 16;
    var top = form.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    qsa("[data-jg-header]").forEach(bindHeader);
    bindScroll();
    bindSmoothScroll();
    stampYear();
    bindChannelCards();
    bindContactForm();
    bindStepReveal();
    applyInquiryHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();