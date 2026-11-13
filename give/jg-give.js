/* ===== MENÚ MÓVIL (hamburguesa) ===== */
(function () {
  "use strict";
  var header = document.querySelector("[data-jg-header]");
  if (!header) return;
  var toggle = header.querySelector("[data-jg-menu-toggle]");
  if (!toggle) return;
  header.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-jg-menu-toggle]") : null;
    if (t) {
      e.stopPropagation();
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
  if (window.__jgDonateModal) return;
  window.__jgDonateModal = true;

  var CONTACT_URL = "https://link.followdrip.com/preview/xB8RcIiUig3o4jC325Pv?notrack=true#message";
  var FORM_BASE = "https://link.followdrip.com/widget/form/";

  /* Frequency is chosen only in this modal (Best Gift Today | Monthly).
     Do not also show Billing Frequency inside the embedded GHL forms. */
  var GIFTS = {
    chaplain: {
      title: "Help Prepare a Chaplain",
      lead: "Your gift supports training and certification to serve as an active school chaplain.",
      type: "either",
      defaultFreq: "once",
      amounts: [
        { value: 25, impact: "Join three others." },
        { value: 50, impact: "Join one other." },
        { value: 100, impact: "Provide a full scholarship." }
      ],
      custom: true,
      formOnce: "EDFVFlGxMsBoE0t9UfLe",
      formOnceName: "formulario de donacion prep-capellan-JG",
      formMonthly: "1zno1K78mTdWBf1b5FBN",
      formMonthlyName: "formulario de donacion prep-capellan-mensual-JG",
      height: 724,
      heightMonthly: 892
    },
    bible: {
      title: "Sponsor a School Bible Class",
      lead: "Your gift provides discipleship materials for a school's Bible class during regular school hours.",
      type: "either",
      defaultFreq: "once",
      amounts: [{ value: 150, impact: "Discipleship materials for one school Bible class." }],
      custom: true,
      formOnce: "xwukstggw5jQgH8tSEtx",
      formOnceName: "formulario de donacion class-biblica-JG",
      formMonthly: "AQHQWX8FlqYjYo2iZi07",
      formMonthlyName: "formulario de donacion class-biblica-mensual-JG",
      height: 724,
      heightMonthly: 990
    },
    webinar: {
      title: "Keep Chaplains Equipped",
      lead: "Your gift helps sponsor weekly live in-service training for international chaplains.",
      type: "either",
      defaultFreq: "once",
      amounts: [{ value: 1000, impact: "Sponsors one weekly live webinar." }],
      custom: true,
      formOnce: "TjMxpvuu6kp7UkNn7Fuy",
      formOnceName: "formulario de donacion mant-equip-capellan-JG",
      formMonthly: "JfEiYFPu7a0DpQsBb0hn",
      formMonthlyName: "formulario de donacion mant-equip-capellan-mensual-JG",
      height: 724,
      heightMonthly: 892
    },
    general: {
      title: "Jesus Generation Outreach",
      lead: "Your donation supports evangelism, discipleship, and the ongoing work of Jesus Generation where the need is greatest.",
      purpose: "Jesus Generation Outreach",
      type: "either",
      defaultFreq: "monthly",
      amounts: [],
      custom: true,
      formOnce: "5H9P6swfd5NWkVETOqjQ",
      formOnceName: "formulario general de donacion-JG",
      formMonthly: "MMQOmbttdMoUNivOeujK",
      formMonthlyName: "formulario general de donacion-mensual-JG",
      height: 822
    },
    country: {
      title: "Support a Country Leadership Team",
      lead: "Your gift helps sustain the national leadership team that equips chaplains and coordinates ministry in the country you choose to support.",
      type: "either",
      defaultFreq: "monthly",
      amounts: [{ value: 100 }, { value: 250 }, { value: 500 }],
      custom: true,
      chooseExtra: "In the form, use Country you want to support to name the national leadership team. That choice is separate from Billing Country, which is where you live. Initial donors are in the United States.",
      formOnce: "UQBLBErAylKq3aIzDIGd",
      formOnceName: "formulario de donacion liderazgo-nacional-JG",
      formMonthly: "Hgl66IOP7IKudso6WVGx",
      formMonthlyName: "formulario de donacion liderazgo-nacional-mensual-JG",
      height: 846
    }
  };

  var modal = document.getElementById("jg-donate-modal");
  if (!modal) return;

  function $(s) { return modal.querySelector(s); }
  var dialog = $(".jg-dm__dialog");
  var frame = $("[data-jg-dm-frame]");
  var loader = $("[data-jg-dm-loader]");
  var summary = $("[data-jg-dm-summary]");
  var freqSwitch = $("[data-jg-dm-switch]");
  var opener = null;
  var currentGiftKey = "general";
  var currentFrequency = "monthly";

  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }

  function resolveFreq(g, preferred) {
    if (preferred === "once" || preferred === "monthly") return preferred;
    if (g.defaultFreq === "once" || g.defaultFreq === "monthly") return g.defaultFreq;
    return g.type === "monthly" ? "monthly" : "once";
  }

  function render(g, activeFreq) {
    var isMonthly = activeFreq === "monthly";
    var purpose = g.purpose || g.title;

    summary.setAttribute("data-freq", isMonthly ? "monthly" : "once");
    $("[data-jg-dm-title]").textContent = g.title;
    $("[data-jg-dm-lead]").textContent = g.lead || "";
    $("[data-jg-dm-badge]").textContent = isMonthly ? "Monthly" : "Best Gift Today";

    $("[data-jg-dm-note]").textContent = isMonthly
      ? "Renews automatically each month until you cancel."
      : "One-time contribution charged today.";

    $("[data-jg-dm-amount]").textContent = g.amounts && g.amounts.length
      ? g.amounts.map(function (a) { return money(a.value); }).join(" · ")
      : "Any amount";

    $("[data-jg-dm-per]").textContent = isMonthly ? "/ month" : "one-time";

    var choices = $("[data-jg-dm-choices]");
    choices.innerHTML = "";
    if (g.amounts) {
      g.amounts.forEach(function (a) {
        if (!a.impact) return;
        var li = el("li");
        li.appendChild(el("b", money(a.value)));
        li.appendChild(el("span", a.impact));
        choices.appendChild(li);
      });
    }
    if (g.custom) {
      var c = el("li", "", "is-custom");
      c.appendChild(el("b", "Custom"));
      c.appendChild(el("span", "You can also enter any amount you wish in the form."));
      choices.appendChild(c);
    }
    choices.style.display = choices.children.length ? "" : "none";

    var choose = g.custom
      ? "Select or enter your amount in the form, then complete the gift with Give Now."
      : "Select your amount in the form, then complete the gift with Give Now.";
    if (g.chooseExtra) choose += " " + g.chooseExtra;

    var steps = isMonthly ? [
      ["Choose", choose],
      ["Today", "The selected amount is charged to your payment method."],
      ["Every month", "The same amount is charged automatically on the same day each month, until you cancel."]
    ] : [
      ["Choose", choose],
      ["Today", "Your card is charged once when you select Give Now."],
      ["After that", "No further charges. This Best Gift Today does not repeat."]
    ];

    var ol = $("[data-jg-dm-timeline]");
    ol.innerHTML = "";
    steps.forEach(function (s) {
      var li = el("li");
      li.appendChild(el("b", s[0]));
      li.appendChild(document.createTextNode(s[1]));
      ol.appendChild(li);
    });

    var st = $("[data-jg-dm-statement]");
    st.innerHTML = "";
    if (isMonthly) {
      st.appendChild(document.createTextNode("By selecting Give Now, you are starting a "));
      st.appendChild(el("em", "Monthly"));
      st.appendChild(document.createTextNode(" gift to " + purpose + ". It renews automatically until canceled."));
    } else {
      st.appendChild(document.createTextNode("By selecting Give Now, you are making a "));
      st.appendChild(el("em", "Best Gift Today"));
      st.appendChild(document.createTextNode(" to " + purpose + ". Your card is charged only once today."));
    }
  }

  function loadForm(formId, formName, height) {
    frame.id = "inline-" + formId;
    frame.setAttribute("data-layout-iframe-id", "inline-" + formId);
    frame.setAttribute("data-form-id", formId);
    frame.setAttribute("data-form-name", formName);
    frame.setAttribute("data-height", String(height || 822));
    frame.setAttribute("title", formName);
    if (loader) loader.style.display = "";
    frame.onload = function () { if (loader) loader.style.display = "none"; };
    frame.src = FORM_BASE + formId;
  }

  function setFrequency(freq) {
    currentFrequency = freq;
    var g = GIFTS[currentGiftKey];
    if (!g) return;

    if (freqSwitch) {
      var buttons = freqSwitch.querySelectorAll("[data-jg-freq]");
      buttons.forEach(function (btn) {
        var match = btn.getAttribute("data-jg-freq") === freq;
        btn.setAttribute("aria-pressed", match ? "true" : "false");
      });
    }

    render(g, currentFrequency);

    var formId = currentFrequency === "monthly" ? (g.formMonthly || g.form) : (g.formOnce || g.form);
    var formName = currentFrequency === "monthly" ? (g.formMonthlyName || g.formName) : (g.formOnceName || g.formName);
    var height = currentFrequency === "monthly" ? (g.heightMonthly || g.height) : g.height;
    loadForm(formId, formName, height);
  }

  function open(key, trigger, preferredFreq) {
    var g = GIFTS[key];
    if (!g) return false;
    currentGiftKey = key;
    opener = trigger || null;
    currentFrequency = resolveFreq(g, preferredFreq);

    if (freqSwitch) {
      freqSwitch.hidden = g.type !== "either" && !(g.type === "monthly" && g.alsoIndividual);
      if (g.type === "monthly" && g.alsoIndividual) freqSwitch.hidden = false;
      if (g.type === "either") freqSwitch.hidden = false;
    }

    $("[data-jg-dm-contact]").setAttribute("href", CONTACT_URL);
    modal.hidden = false;
    document.body.classList.add("is-dm-open");

    setFrequency(currentFrequency);

    $(".jg-dm__side").scrollTop = 0;
    dialog.focus();
    return true;
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove("is-dm-open");
    frame.removeAttribute("src");
    if (opener && opener.focus) opener.focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-jg-donate]") : null;
    if (t && GIFTS[t.getAttribute("data-jg-donate")]) {
      e.preventDefault();
      open(t.getAttribute("data-jg-donate"), t, t.getAttribute("data-jg-freq-pref"));
      return;
    }

    var freqBtn = e.target.closest ? e.target.closest("[data-jg-freq]") : null;
    if (freqBtn && !modal.hidden) {
      e.preventDefault();
      var selected = freqBtn.getAttribute("data-jg-freq");
      if (selected !== currentFrequency) setFrequency(selected);
      return;
    }

    if (!modal.hidden && e.target.closest && e.target.closest("[data-jg-dm-close]")) close();
  });

  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = dialog.querySelectorAll('button:not([hidden]), [href], iframe, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
