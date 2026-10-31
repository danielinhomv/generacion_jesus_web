/* ===== MENÚ MÓVIL (hamburguesa) ===== */
/* Propio de esta página: funciona aunque jg-home.js no cargue, y si carga, evita que el menú se abra y se cierre dos veces. */
(function () {
  "use strict";
  var header = document.querySelector("[data-jg-header]");
  if (!header) return;
  var toggle = header.querySelector("[data-jg-menu-toggle]");
  if (!toggle) return;
  header.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-jg-menu-toggle]") : null;
    if (t) {
      e.stopPropagation(); /* evita que otro script repita el cambio */
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (e.target.closest && e.target.closest("a")) {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }, true);
})();

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