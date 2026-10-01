(function () {
  "use strict";

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

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

  function formatStat(n, suffix) {
    var text = n.toLocaleString("en-US");
    return suffix ? text + suffix : text;
  }

  function animateCount(el) {
    var target = Number(el.getAttribute("data-target"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (!target) return;
    var start = 0;
    var duration = 1200;
    var t0 = null;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatStat(Math.round(target * eased), suffix);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bindStats() {
    var nodes = qsa("[data-target]");
    if (!nodes.length || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.textContent = formatStat(Number(el.getAttribute("data-target")), el.getAttribute("data-suffix") || "");
      });
      return;
    }
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (el) { observer.observe(el); });
  }

  function bindNewsletter() {
    qsa("[data-jg-newsletter]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = qs("[data-jg-newsletter-status]", form);
        var email = qs('input[type="email"]', form);
        var consent = qs('input[type="checkbox"]', form);
        if (!email || !email.value || (consent && !consent.checked)) return;
        if (status) {
          status.hidden = false;
          status.textContent = "Preview only. This box will connect to a GoHighLevel form. The email was not saved.";
        }
      });
    });
  }

  function loadImg(img) {
    if (!img || img.getAttribute("data-jg-loaded") === "1") return;
    var src = img.getAttribute("data-src");
    if (!src) return;
    img.setAttribute("data-jg-loaded", "1");
    var srcset = img.getAttribute("data-srcset");
    var sizes = img.getAttribute("data-sizes");
    if (srcset) img.setAttribute("srcset", srcset);
    if (sizes) img.setAttribute("sizes", sizes);
    function done() { img.classList.add("is-loaded"); }
    img.addEventListener("load", done);
    img.setAttribute("src", src);
    if (img.complete && img.naturalWidth) done();
  }

  function bindReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = qsa("#main section").filter(function (el) {
      return !el.classList.contains("jg-hero");
    });
    var cardSel = ".jg-gift";

    function show(section) {
      qsa("img[data-src]", section).forEach(loadImg);
      if (!reduce) section.classList.add("is-in");
    }

    if (!reduce) {
      sections.forEach(function (section) {
        qsa(cardSel, section).forEach(function (el, i) {
          el.classList.add("jg-reveal");
          el.style.setProperty("--jg-d", Math.min(i, 7) * 0.09 + "s");
        });
        qsa(".jg-pillar", section).forEach(function (el, i) {
          el.classList.add("jg-drop");
          el.style.setProperty("--jg-drop", i + "s");
        });
        section.classList.add("jg-reveal-block");
      });
    }

    if (!("IntersectionObserver" in window)) {
      sections.forEach(show);
      return;
    }

    var viewH = window.innerHeight || document.documentElement.clientHeight;
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
    }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 });
    pending.forEach(function (el) { observer.observe(el); });
  }

  bindMenu();
  bindStats();
  bindNewsletter();
  bindReveal();
})();
