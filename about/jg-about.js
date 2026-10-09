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
    var duration = 950;
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
    }, { threshold: 0.25 });
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
    img.addEventListener("error", function () {
      img.removeAttribute("srcset");
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      else done();
    });
    img.setAttribute("src", src);
    if (img.complete && img.naturalWidth) done();
  }

  function bindReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = qsa("#main section").filter(function (el) {
      return !el.classList.contains("jg-hero") && !el.classList.contains("jg-soon");
    });
    var pieceSel = [
      ".jg-continue__copy > *",
      ".jg-story__intro > *",
      ".jg-timeline__item",
      ".jg-believe h2",
      ".jg-believe__item",
      ".jg-lasting__copy > *",
      ".jg-impact__copy > *",
      ".jg-impact__photos img",
      ".jg-lead h2",
      ".jg-lead__intro",
      ".jg-lead-card",
      ".jg-lead .jg-btn",
      ".jg-account h2",
      ".jg-account__intro",
      ".jg-account__item",
      ".jg-account .jg-btn",
      ".jg-final__content > h2",
      ".jg-final__content > p",
      ".jg-final__ctas"
    ].join(",");

    function show(section) {
      qsa("img[data-src]", section).forEach(loadImg);
      if (!reduce) section.classList.add("is-in");
    }

    var groupSel = ".jg-timeline__item, .jg-believe__item, .jg-impact__photos img, .jg-lead-card, .jg-account__item, .jg-final__ctas";

    if (!reduce) {
      sections.forEach(function (section) {
        var t = 0;
        qsa(pieceSel, section).forEach(function (el) {
          el.classList.add("jg-piece");
          el.style.setProperty("--jg-d", t.toFixed(2) + "s");
          t += el.matches(groupSel) ? 0.1 : 0.16;
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
    }, { root: null, rootMargin: "0px 0px -3% 0px", threshold: 0 });
    pending.forEach(function (el) { observer.observe(el); });
  }

  function bindBios() {
    var dialog = qs("[data-jg-bio-dialog]");
    if (!dialog) return;
    var nameEl = qs("[data-jg-bio-name]", dialog);
    var fileEl = qs("[data-jg-bio-file]", dialog);
    var frame = qs("[data-jg-bio-frame]", dialog);
    var lastFocus = null;
    var pdfs = {
      rocky: {
        name: "Rocky J. Malloy",
        src: "../about_finish/leadershep/2026 Bio Rocky J Malloy June.pdf"
      },
      jose: {
        name: "Jose Morales",
        src: "../about_finish/leadershep/Jose Morales - EN.pdf"
      },
      efrain: {
        name: "Efrain Duran",
        src: "../about_finish/leadershep/Efrain_Duran_Professional_Resume - 8-23-26.pdf"
      }
    };

    function close() {
      dialog.hidden = true;
      document.body.classList.remove("is-bio-open");
      if (frame) frame.src = "about:blank";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    function open(id) {
      var bio = pdfs[id];
      if (!bio) return;
      lastFocus = document.activeElement;
      if (nameEl) nameEl.textContent = bio.name;
      if (fileEl) fileEl.href = bio.src;
      if (frame) frame.src = bio.src;
      dialog.hidden = false;
      document.body.classList.add("is-bio-open");
      var closeBtn = qs(".jg-bio__close", dialog);
      if (closeBtn) closeBtn.focus();
    }

    qsa("[data-jg-bio]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        var id = el.getAttribute("data-jg-bio");
        if (!id) return;
        if (el.tagName === "ARTICLE" && e.target.closest("button")) return;
        open(id);
      });
    });

    qsa("[data-jg-bio-close]", dialog).forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dialog.hidden) close();
    });
  }

  function bindLeadCarousel() {
    var root = qs("[data-jg-lead-carousel]");
    if (!root) return;
    var track = qs(".jg-lead__track", root);
    var slides = qsa(".jg-lead-card", track);
    var prev = qs("[data-jg-lead-prev]", root);
    var next = qs("[data-jg-lead-next]", root);
    var dotsWrap = qs("[data-jg-lead-dots]", root);
    if (!track || slides.length < 2 || !dotsWrap) return;

    var count = slides.length;
    var clone = slides[0].cloneNode(true);
    clone.setAttribute("data-jg-clone", "");
    clone.setAttribute("aria-hidden", "true");
    if ("inert" in clone) clone.inert = true;
    track.appendChild(clone);

    var index = 0;
    var timer = null;
    var delay = 5000;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var startX = 0;
    var pointerId = null;
    var suppressClick = false;

    root.setAttribute("aria-roledescription", "carousel");
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "jg-lead__dot";
      dot.setAttribute("aria-label", "Show leader " + (i + 1));
      dot.addEventListener("click", function () {
        goDot(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = qsa(".jg-lead__dot", dotsWrap);

    function bioOpen() {
      var dialog = qs("[data-jg-bio-dialog]");
      return !!(dialog && !dialog.hidden);
    }

    function logical() {
      return index === count ? 0 : index;
    }

    function show(n, animate) {
      var motion = animate !== false && !reduce;
      if (!motion) track.style.transition = "none";
      index = n;
      track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
      var dotIndex = logical();
      dots.forEach(function (dot, i) {
        var on = i === dotIndex;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      slides.forEach(function (slide, i) {
        var on = i === dotIndex && index !== count;
        slide.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in slide) slide.inert = !on;
      });
      if (!motion) {
        track.offsetHeight;
        track.style.transition = "";
      }
    }

    function nextSlide() {
      var current = logical();
      if (current === count - 1) {
        show(reduce ? 0 : count, !reduce);
        return;
      }
      show(current + 1, true);
    }

    function prevSlide() {
      var current = logical();
      if (current !== 0) {
        show(current - 1, true);
        return;
      }
      if (reduce) {
        show(count - 1, false);
        return;
      }
      show(count, false);
      window.requestAnimationFrame(function () {
        show(count - 1, true);
      });
    }

    function goDot(i) {
      var current = logical();
      if (i === current) return;
      if (current === count - 1 && i === 0) {
        nextSlide();
        return;
      }
      if (current === 0 && i === count - 1) {
        prevSlide();
        return;
      }
      show(i, true);
    }

    track.addEventListener("transitionend", function (e) {
      if (e.target !== track || e.propertyName !== "transform") return;
      if (index !== count) return;
      show(0, false);
    });

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function start() {
      if (timer || reduce || bioOpen() || document.hidden) return;
      if (root.contains(document.activeElement)) return;
      if (finePointer && root.matches(":hover")) return;
      timer = window.setInterval(function () {
        if (bioOpen() || document.hidden) return;
        nextSlide();
      }, delay);
    }

    function restart() {
      stop();
      start();
    }

    if (prev) prev.addEventListener("click", function () { prevSlide(); restart(); });
    if (next) next.addEventListener("click", function () { nextSlide(); restart(); });

    if (finePointer) {
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
    }
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (e) {
      if (!root.contains(e.relatedTarget)) start();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("button, a")) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      suppressClick = false;
      stop();
      if (track.setPointerCapture) {
        try { track.setPointerCapture(e.pointerId); } catch (err) {}
      }
    });
    track.addEventListener("pointerup", function (e) {
      if (pointerId == null || pointerId !== e.pointerId) return;
      var dx = e.clientX - startX;
      pointerId = null;
      if (Math.abs(dx) > 48) {
        suppressClick = true;
        if (dx < 0) nextSlide();
        else prevSlide();
      }
      restart();
    });
    track.addEventListener("pointercancel", function () {
      pointerId = null;
      start();
    });
    track.addEventListener("click", function (e) {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);

    var dialog = qs("[data-jg-bio-dialog]");
    if (dialog && window.MutationObserver) {
      new MutationObserver(function () {
        if (bioOpen()) stop();
        else start();
      }).observe(dialog, { attributes: true, attributeFilter: ["hidden"] });
    }

    show(0, false);
    start();
  }

  bindMenu();
  bindStats();
  bindNewsletter();
  bindReveal();
  bindBios();
  bindLeadCarousel();
})();
