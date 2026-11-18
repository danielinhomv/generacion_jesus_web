(function () {
  "use strict";

  function qs(sel, root)  { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ── Mobile menu ─────────────────────────────────────────────────── */
  function bindMenu() {
    var header = qs("[data-jg-header]");
    if (!header) return;
    var toggle = qs("[data-jg-menu-toggle]", header);
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa("a", header).forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── Animated stat counters ──────────────────────────────────────── */
  function formatStat(n, suffix) {
    return n.toLocaleString("en-US") + (suffix || "");
  }

  function animateCount(el) {
    var target   = Number(el.getAttribute("data-target"));
    var suffix   = el.getAttribute("data-suffix") || "";
    if (!target) return;
    var duration = 950;
    var t0       = null;
    function frame(now) {
      if (!t0) t0 = now;
      var p     = Math.min(1, (now - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatStat(Math.round(target * eased), suffix);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bindStats() {
    var nodes = qsa("[data-target]");
    if (!nodes.length) return;
    // SEO improvement: Display static numbers instead of animating from zero
    nodes.forEach(function (el) {
      el.textContent = formatStat(Number(el.getAttribute("data-target")), el.getAttribute("data-suffix") || "");
    });
  }

  /* ── Lazy-load images ────────────────────────────────────────────── */
  function loadImg(img) {
    if (!img || img.getAttribute("data-jg-loaded") === "1") return;
    var src = img.getAttribute("data-src");
    if (!src) return;
    img.setAttribute("data-jg-loaded", "1");
    var srcset = img.getAttribute("data-srcset");
    var sizes  = img.getAttribute("data-sizes");
    if (srcset) img.setAttribute("srcset", srcset);
    if (sizes)  img.setAttribute("sizes",  sizes);
    function done() { img.classList.add("is-loaded"); }
    img.addEventListener("load",  done);
    img.addEventListener("error", function () {
      img.removeAttribute("srcset");
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      else done();
    });
    img.setAttribute("src", src);
    if (img.complete && img.naturalWidth) done();
  }

  /* ── Scroll reveal + lazy load trigger ───────────────────────────── */
  function bindReveal() {
    var reduce   = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = qsa("#main section");

    /* selectors for staggered pieces on this page */
    var pieceSel = [
      ".jg-mis-story__intro > *",
      ".jg-mis-tl",
      ".jg-mis-who__copy > *",
      ".jg-mis-card",
      ".jg-mis-practice__copy > *",
      ".jg-mis-practice__item",
      ".jg-mis-testimony",
      ".jg-mis-context__copy > *",
      ".jg-mis-context__item",
      ".jg-mis-protect__card",
      ".jg-mis-protect__note",
      ".jg-mis-teams__copy > *",
      ".jg-mis-teams__photo",
      ".jg-mis-photos__item",
      ".jg-mis-final__content > *",
      ".jg-mis-final__ctas",
      ".jg-mis-stat"
    ].join(",");

    var groupSel = ".jg-mis-tl, .jg-mis-card, .jg-mis-protect__card, .jg-mis-photos__item, .jg-mis-stat, .jg-mis-context__item, .jg-mis-practice__item";

    function show(section) {
      qsa("img[data-src]", section).forEach(loadImg);
      if (!reduce) section.classList.add("is-in");
    }

    if (!reduce) {
      sections.forEach(function (section) {
        var t = 0;
        qsa(pieceSel, section).forEach(function (el) {
          el.classList.add("jg-piece");
          el.style.setProperty("--jg-d", t.toFixed(2) + "s");
          t += el.matches(groupSel) ? 0.08 : 0.14;
        });
        section.classList.add("jg-reveal-block");
      });
    }

    if (!("IntersectionObserver" in window)) {
      sections.forEach(show);
      return;
    }

    var viewH   = window.innerHeight || document.documentElement.clientHeight;
    var pending = [];
    sections.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < viewH - 8 && rect.bottom > 48) {
        if (!reduce) el.classList.add("is-shown");
        show(el);
      } else {
        pending.push(el);
      }
    });
    if (!pending.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { root: null, rootMargin: "0px 0px -3% 0px", threshold: 0 });
    pending.forEach(function (el) { observer.observe(el); });
  }

  /* ── Boot ────────────────────────────────────────────────────────── */
  bindMenu();
  bindStats();
  bindReveal();

})();
