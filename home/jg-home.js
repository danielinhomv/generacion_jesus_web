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
    img.setAttribute("src", src);
    if (img.complete && img.naturalWidth) done();
  }

  function bindReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = qsa("#main section").filter(function (el) {
      return !el.classList.contains("jg-hero") && !el.classList.contains("jg-soon");
    });
    var pieceSel = [
      ".jg-why > h2",
      ".jg-why > p",
      ".jg-pillar",
      ".jg-next",
      ".jg-gifts .jg-wrap > .jg-kicker",
      ".jg-gifts .jg-wrap > h2",
      ".jg-gifts__lead",
      ".jg-gift",
      ".jg-gifts__note",
      ".jg-matter__copy > *",
      ".jg-matter__group",
      ".jg-harvest",
      ".jg-global__content > h2",
      ".jg-global__content > p",
      ".jg-global__content > a",
      ".jg-final__content > h2",
      ".jg-final__content > p",
      ".jg-final__ctas",
      ".jg-gi-card",
      ".jg-gi-copy > .jg-kicker",
      ".jg-gi-copy > h2:not(.jg-gi-label)",
      ".jg-gi-copy > .jg-gi-label",
      ".jg-gi-copy > p:not(.jg-kicker)",
      ".jg-gi-copy > .jg-btn",
      ".jg-gi-needs li",
      ".jg-gi-band__quote",
      ".jg-gi-band__copy > h2",
      ".jg-gi-band__ctas",
      ".jg-gv-panel",
      ".jg-gv-impact__head",
      ".jg-gv-impact article",
      ".jg-gv-month__copy > *",
      ".jg-gv-month__cta",
      ".jg-gv-ways > h2",
      ".jg-gv-ways > .jg-gv-lead",
      ".jg-gv-card",
      ".jg-gv-note",
      ".jg-gv-close__copy > *",
      ".jg-pp-promise",
      ".jg-pp-grid article",
      ".jg-pp-note"
    ].join(",");

    function show(section) {
      qsa("img[data-src]", section).forEach(loadImg);
      if (!reduce) section.classList.add("is-in");
    }

    var groupSel = ".jg-pillar, .jg-next, .jg-gift, .jg-gifts__note, .jg-matter__group, .jg-harvest, .jg-global__figures, .jg-global__content > a, .jg-final__ctas, .jg-gi-card, .jg-gi-needs li, .jg-gv-card, .jg-gv-impact article, .jg-pp-grid article";

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
  /* ===== DONATE MODAL ===== */
  (function () {
    "use strict";
    if (window.__jgDonateModal) return; /* evita iniciar el modal dos veces si el código está en dos archivos */
    window.__jgDonateModal = true;

    var CONTACT_URL = "https://jesusgeneration.global/contact#message";
    var FORM_BASE = "https://link.followdrip.com/widget/form/";

    /* Una entrada por tarjeta (la clave va en data-jg-donate="..." del botón).
       type: "once" = regalo individual · "monthly" = regalo mensual
       alsoIndividual: en el formulario mensual también se puede cambiar a regalo individual
       custom: el formulario permite un importe personalizado */
    var GIFTS = {
      chaplain: {
        title: "Help Prepare a Chaplain",
        lead: "Your gift supports training and certification to serve as an active school chaplain.",
        type: "once",
        amounts: [
          { value: 25, impact: "Join three others." },
          { value: 50, impact: "Join one other." },
          { value: 100, impact: "Provide a full scholarship." }
        ],
        custom: true,
        form: "EDFVFlGxMsBoE0t9UfLe",
        formName: "formulario de donacion prep-capellan-JG",
        height: 724
      },
      bible: {
        title: "Sponsor a School Bible Class",
        lead: "Your gift provides discipleship materials for a school's Bible class during regular school hours.",
        type: "once",
        amounts: [{ value: 150, impact: "Discipleship materials for one school Bible class." }],
        custom: true,
        form: "xwukstggw5jQgH8tSEtx",
        formName: "formulario de donacion class-biblica-JG",
        height: 724
      },
      webinar: {
        title: "Keep Chaplains Equipped",
        lead: "Your gift helps sponsor weekly live in-service training for international chaplains.",
        type: "once",
        amounts: [{ value: 1000, impact: "Sponsors one weekly live webinar." }],
        custom: true,
        form: "TjMxpvuu6kp7UkNn7Fuy",
        formName: "formulario de donacion mant-equip-capellan-JG",
        height: 724
      },
      general: {
        title: "Help the Next Generation Hear the Gospel",
        lead: "Your donation supports evangelism, discipleship, and the ongoing work of Jesus Generation where the need is greatest.",
        type: "either",
        amounts: [],
        custom: false,
        form: "5H9P6swfd5NWkVETOqjQ",
        formName: "formulario general de donacion-JG",
        height: 822
      },
      country: {
        title: "Support a Country Leadership Team",
        lead: "Your gift helps sustain the team that equips chaplains and coordinates ministry in the country you select.",
        type: "monthly",
        alsoIndividual: true,
        amounts: [{ value: 100 }, { value: 250 }, { value: 500 }],
        custom: true,
        chooseExtra: "Select the country whose leadership team you want to support. This is not where you live.",
        form: "UQBLBErAylKq3aIzDIGd",
        formName: "formulario de donacion liderazgo-nacional-JG",
        height: 822
      }
    };

    var modal = document.getElementById("jg-donate-modal");
    if (!modal) return;

    function $(s) { return modal.querySelector(s); }
    var dialog = $(".jg-dm__dialog");
    var frame = $("[data-jg-dm-frame]");
    var loader = $("[data-jg-dm-loader]");
    var summary = $("[data-jg-dm-summary]");
    var opener = null;

    function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
    function el(tag, text, cls) {
      var e = document.createElement(tag);
      if (text) e.textContent = text;
      if (cls) e.className = cls;
      return e;
    }

    /* El panel azul es solo informativo: se llena una vez al abrir y no cambia mientras el donante usa el formulario. */
    function render(g) {
      var either = g.type === "either"; /* el donante elige individual o mensual dentro del formulario */
      var monthly = g.type === "monthly";
      var both = either || (monthly && g.alsoIndividual);

      summary.setAttribute("data-freq", monthly ? "monthly" : "once");
      $("[data-jg-dm-title]").textContent = g.title;
      $("[data-jg-dm-lead]").textContent = g.lead || "";
      $("[data-jg-dm-badge]").textContent = either ? "Individual or monthly gift" : (monthly ? "Monthly gift" : "Individual gift");
      $("[data-jg-dm-note]").textContent = either
        ? "You choose the gift type in the form."
        : (both ? "Selected by default. You can switch to an individual gift in the form." : "");
      $("[data-jg-dm-amount]").textContent = g.amounts.length
        ? g.amounts.map(function (a) { return money(a.value); }).join(" · ")
        : "Any amount";
      $("[data-jg-dm-per]").textContent = g.amounts.length
        ? (g.custom ? "or enter your own amount in the form" : "choose in the form")
        : "choose or enter your amount in the form";

      /* qué logra cada monto + importe personalizado */
      var choices = $("[data-jg-dm-choices]");
      choices.innerHTML = "";
      g.amounts.forEach(function (a) {
        if (!a.impact) return;
        var li = el("li");
        li.appendChild(el("b", money(a.value)));
        li.appendChild(el("span", a.impact));
        choices.appendChild(li);
      });
      if (g.custom) {
        var c = el("li", "", "is-custom");
        c.appendChild(el("b", "Custom"));
        c.appendChild(el("span", "You can also enter any amount you wish in the form."));
        choices.appendChild(c);
      }
      choices.style.display = choices.children.length ? "" : "none";

      /* cómo se cobra */
      var choose = g.custom
        ? "Pick one of the amounts or enter your own amount in the form."
        : "Pick your amount in the form.";
      if (g.chooseExtra) choose += " " + g.chooseExtra;
      var steps;
      if (either) {
        steps = [
          ["Choose", "In the form, choose an individual gift or a monthly gift, then your amount or an amount of your own."],
          ["Individual gift", "The amount is charged once, today. It does not repeat."],
          ["Monthly gift", "The amount is charged today, then the same amount is charged automatically every month on the same day, until you cancel."]
        ];
      } else if (both) {
        steps = [
          ["Choose", choose + " Monthly is selected by default; switch to an individual gift in the form if you prefer."],
          ["If you keep Monthly", "The amount is charged today, then the same amount is charged automatically every month on the same day, until you cancel."],
          ["If you switch to Individual", "The amount is charged once, today. It does not repeat."]
        ];
      } else if (monthly) {
        steps = [
          ["Choose", choose],
          ["Today", "The amount you choose is charged to your card."],
          ["Every month", "The same amount is charged automatically on the same day each month, starting next month, until you cancel."]
        ];
      } else {
        steps = [
          ["Choose", choose],
          ["Today", "The amount you choose is charged to your card once, when you complete the form."],
          ["After that", "Nothing. This individual gift does not repeat and you will not be billed again."]
        ];
      }
      var ol = $("[data-jg-dm-timeline]");
      ol.innerHTML = "";
      steps.forEach(function (s) {
        var li = el("li");
        li.appendChild(el("b", s[0]));
        li.appendChild(document.createTextNode(s[1]));
        ol.appendChild(li);
      });

      /* frase de confirmación */
      var st = $("[data-jg-dm-statement]");
      st.innerHTML = "";
      if (both) {
        st.appendChild(document.createTextNode("Before you pay, the form shows your gift type and amount. "));
        st.appendChild(el("em", "Monthly gifts renew automatically until you cancel."));
        st.appendChild(document.createTextNode(" Please review both before you confirm payment."));
      } else {
        st.appendChild(document.createTextNode("By completing the form, you are making "));
        st.appendChild(el("em", monthly ? "a monthly gift" : "an individual gift"));
        st.appendChild(document.createTextNode(" to " + g.title + ". "));
        st.appendChild(document.createTextNode(monthly
          ? "Your card is charged today and then automatically every month until you cancel. Please review the amount before you confirm payment."
          : "Your card is charged once, for the amount you choose. Please review the amount before you confirm payment."));
      }
    }

    function loadForm(g) {
      frame.id = "inline-" + g.form;
      frame.setAttribute("data-layout-iframe-id", "inline-" + g.form);
      frame.setAttribute("data-form-id", g.form);
      frame.setAttribute("data-form-name", g.formName);
      frame.setAttribute("data-height", String(g.height || 758));
      frame.setAttribute("title", g.formName);
      if (loader) loader.style.display = "";
      frame.onload = function () { if (loader) loader.style.display = "none"; };
      frame.src = FORM_BASE + g.form; /* se carga una sola vez al abrir */
    }

    function open(key, trigger) {
      var g = GIFTS[key];
      if (!g) return false;
      opener = trigger || null;
      render(g);
      $("[data-jg-dm-contact]").setAttribute("href", CONTACT_URL);
      modal.hidden = false;
      document.body.classList.add("is-dm-open");
      loadForm(g);
      $(".jg-dm__side").scrollTop = 0;
      dialog.focus();
      return true;
    }

    function close() {
      modal.hidden = true;
      document.body.classList.remove("is-dm-open");
      frame.removeAttribute("src"); /* detiene el formulario al cerrar */
      if (opener && opener.focus) opener.focus();
    }

    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-jg-donate]") : null;
      if (t && GIFTS[t.getAttribute("data-jg-donate")]) {
        e.preventDefault();
        open(t.getAttribute("data-jg-donate"), t);
        return;
      }
      if (!modal.hidden && e.target.closest && e.target.closest("[data-jg-dm-close]")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      var f = dialog.querySelectorAll('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();
  bindMenu();
  bindStats();
  bindNewsletter();
  bindReveal();
})();