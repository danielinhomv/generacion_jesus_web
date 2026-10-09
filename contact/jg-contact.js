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

  function setSubject(value) {
    var select = qs("#jg-subject");
    if (!select || !value) return;
    var match = qsa("option", select).some(function (opt) { return opt.value === value; });
    if (match) select.value = value;
  }

  function bindSubjectLinks() {
    qsa("[data-jg-subject]").forEach(function (link) {
      link.addEventListener("click", function () {
        setSubject(link.getAttribute("data-jg-subject"));
      });
    });
    var params = new URLSearchParams(window.location.search);
    if (params.get("subject")) setSubject(params.get("subject"));
  }

  var COUNTRY_ROWS = [
    ["Afghanistan", "AF", "93", 6, 12],
    ["Albania", "AL", "355", 6, 12],
    ["Algeria", "DZ", "213", 6, 12],
    ["Andorra", "AD", "376", 6, 12],
    ["Angola", "AO", "244", 6, 12],
    ["Antigua and Barbuda", "AG", "1", 10, 10],
    ["Argentina", "AR", "54", 10, 11],
    ["Armenia", "AM", "374", 6, 12],
    ["Australia", "AU", "61", 9, 9],
    ["Austria", "AT", "43", 6, 12],
    ["Azerbaijan", "AZ", "994", 6, 12],
    ["Bahamas", "BS", "1", 10, 10],
    ["Bahrain", "BH", "973", 6, 12],
    ["Bangladesh", "BD", "880", 6, 12],
    ["Barbados", "BB", "1", 10, 10],
    ["Belarus", "BY", "375", 6, 12],
    ["Belgium", "BE", "32", 6, 12],
    ["Belize", "BZ", "501", 7, 7],
    ["Benin", "BJ", "229", 6, 12],
    ["Bhutan", "BT", "975", 6, 12],
    ["Bolivia", "BO", "591", 8, 8],
    ["Bosnia and Herzegovina", "BA", "387", 6, 12],
    ["Botswana", "BW", "267", 6, 12],
    ["Brazil", "BR", "55", 10, 11, "brasil"],
    ["Brunei", "BN", "673", 6, 12],
    ["Bulgaria", "BG", "359", 6, 12],
    ["Burkina Faso", "BF", "226", 6, 12],
    ["Burundi", "BI", "257", 6, 12],
    ["Cabo Verde", "CV", "238", 6, 12, "cape verde"],
    ["Cambodia", "KH", "855", 6, 12],
    ["Cameroon", "CM", "237", 6, 12],
    ["Canada", "CA", "1", 10, 10],
    ["Central African Republic", "CF", "236", 6, 12],
    ["Chad", "TD", "235", 6, 12],
    ["Chile", "CL", "56", 9, 9],
    ["China", "CN", "86", 11, 11],
    ["Colombia", "CO", "57", 10, 10],
    ["Comoros", "KM", "269", 6, 12],
    ["Congo", "CG", "242", 6, 12],
    ["Costa Rica", "CR", "506", 8, 8],
    ["Côte d'Ivoire", "CI", "225", 6, 12, "ivory coast"],
    ["Croatia", "HR", "385", 6, 12],
    ["Cuba", "CU", "53", 8, 8],
    ["Cyprus", "CY", "357", 6, 12],
    ["Czechia", "CZ", "420", 6, 12, "czech republic"],
    ["Democratic Republic of the Congo", "CD", "243", 6, 12],
    ["Denmark", "DK", "45", 8, 8],
    ["Djibouti", "DJ", "253", 6, 12],
    ["Dominica", "DM", "1", 10, 10],
    ["Dominican Republic", "DO", "1", 10, 10],
    ["Ecuador", "EC", "593", 9, 9],
    ["Egypt", "EG", "20", 6, 12],
    ["El Salvador", "SV", "503", 8, 8],
    ["Equatorial Guinea", "GQ", "240", 6, 12],
    ["Eritrea", "ER", "291", 6, 12],
    ["Estonia", "EE", "372", 6, 12],
    ["Eswatini", "SZ", "268", 6, 12, "swaziland"],
    ["Ethiopia", "ET", "251", 6, 12],
    ["Fiji", "FJ", "679", 6, 12],
    ["Finland", "FI", "358", 6, 12],
    ["France", "FR", "33", 9, 9, "francia"],
    ["Gabon", "GA", "241", 6, 12],
    ["Gambia", "GM", "220", 6, 12],
    ["Georgia", "GE", "995", 6, 12],
    ["Germany", "DE", "49", 6, 12, "alemania"],
    ["Ghana", "GH", "233", 6, 12],
    ["Greece", "GR", "30", 6, 12],
    ["Grenada", "GD", "1", 10, 10],
    ["Guatemala", "GT", "502", 8, 8],
    ["Guinea", "GN", "224", 6, 12],
    ["Guinea-Bissau", "GW", "245", 6, 12],
    ["Guyana", "GY", "592", 7, 7],
    ["Haiti", "HT", "509", 8, 8],
    ["Honduras", "HN", "504", 8, 8],
    ["Hong Kong", "HK", "852", 8, 8],
    ["Hungary", "HU", "36", 6, 12],
    ["Iceland", "IS", "354", 6, 12],
    ["India", "IN", "91", 10, 10],
    ["Indonesia", "ID", "62", 6, 12],
    ["Iran", "IR", "98", 6, 12],
    ["Iraq", "IQ", "964", 6, 12],
    ["Ireland", "IE", "353", 6, 12],
    ["Israel", "IL", "972", 6, 12],
    ["Italy", "IT", "39", 6, 11, "italia"],
    ["Jamaica", "JM", "1", 10, 10],
    ["Japan", "JP", "81", 9, 11],
    ["Jordan", "JO", "962", 6, 12],
    ["Kazakhstan", "KZ", "7", 6, 12],
    ["Kenya", "KE", "254", 6, 12],
    ["Kiribati", "KI", "686", 6, 12],
    ["Kosovo", "XK", "383", 6, 12],
    ["Kuwait", "KW", "965", 6, 12],
    ["Kyrgyzstan", "KG", "996", 6, 12],
    ["Laos", "LA", "856", 6, 12],
    ["Latvia", "LV", "371", 6, 12],
    ["Lebanon", "LB", "961", 6, 12],
    ["Lesotho", "LS", "266", 6, 12],
    ["Liberia", "LR", "231", 6, 12],
    ["Libya", "LY", "218", 6, 12],
    ["Liechtenstein", "LI", "423", 6, 12],
    ["Lithuania", "LT", "370", 6, 12],
    ["Luxembourg", "LU", "352", 6, 12],
    ["Macao", "MO", "853", 8, 8],
    ["Madagascar", "MG", "261", 6, 12],
    ["Malawi", "MW", "265", 6, 12],
    ["Malaysia", "MY", "60", 6, 12],
    ["Maldives", "MV", "960", 6, 12],
    ["Mali", "ML", "223", 6, 12],
    ["Malta", "MT", "356", 6, 12],
    ["Marshall Islands", "MH", "692", 6, 12],
    ["Mauritania", "MR", "222", 6, 12],
    ["Mauritius", "MU", "230", 6, 12],
    ["Mexico", "MX", "52", 10, 10, "mexico"],
    ["Micronesia", "FM", "691", 6, 12],
    ["Moldova", "MD", "373", 6, 12],
    ["Monaco", "MC", "377", 6, 12],
    ["Mongolia", "MN", "976", 6, 12],
    ["Montenegro", "ME", "382", 6, 12],
    ["Morocco", "MA", "212", 6, 12],
    ["Mozambique", "MZ", "258", 6, 12],
    ["Myanmar", "MM", "95", 6, 12, "burma"],
    ["Namibia", "NA", "264", 6, 12],
    ["Nauru", "NR", "674", 6, 12],
    ["Nepal", "NP", "977", 6, 12],
    ["Netherlands", "NL", "31", 6, 12],
    ["New Zealand", "NZ", "64", 6, 12],
    ["Nicaragua", "NI", "505", 8, 8],
    ["Niger", "NE", "227", 6, 12],
    ["Nigeria", "NG", "234", 10, 11],
    ["North Korea", "KP", "850", 6, 12],
    ["North Macedonia", "MK", "389", 6, 12],
    ["Norway", "NO", "47", 8, 8],
    ["Oman", "OM", "968", 6, 12],
    ["Pakistan", "PK", "92", 6, 12],
    ["Palau", "PW", "680", 6, 12],
    ["Palestine", "PS", "970", 6, 12],
    ["Panama", "PA", "507", 8, 8],
    ["Papua New Guinea", "PG", "675", 6, 12],
    ["Paraguay", "PY", "595", 9, 9],
    ["Peru", "PE", "51", 9, 9],
    ["Philippines", "PH", "63", 10, 10],
    ["Poland", "PL", "48", 9, 9],
    ["Portugal", "PT", "351", 9, 9],
    ["Puerto Rico", "PR", "1", 10, 10],
    ["Qatar", "QA", "974", 6, 12],
    ["Romania", "RO", "40", 6, 12],
    ["Russia", "RU", "7", 10, 10],
    ["Rwanda", "RW", "250", 6, 12],
    ["Saint Kitts and Nevis", "KN", "1", 10, 10],
    ["Saint Lucia", "LC", "1", 10, 10],
    ["Saint Vincent and the Grenadines", "VC", "1", 10, 10],
    ["Samoa", "WS", "685", 6, 12],
    ["San Marino", "SM", "378", 6, 12],
    ["Sao Tome and Principe", "ST", "239", 6, 12],
    ["Saudi Arabia", "SA", "966", 6, 12],
    ["Senegal", "SN", "221", 6, 12],
    ["Serbia", "RS", "381", 6, 12],
    ["Seychelles", "SC", "248", 6, 12],
    ["Sierra Leone", "SL", "232", 6, 12],
    ["Singapore", "SG", "65", 8, 8],
    ["Slovakia", "SK", "421", 6, 12],
    ["Slovenia", "SI", "386", 6, 12],
    ["Solomon Islands", "SB", "677", 6, 12],
    ["Somalia", "SO", "252", 6, 12],
    ["South Africa", "ZA", "27", 9, 9],
    ["South Korea", "KR", "82", 8, 11, "korea"],
    ["South Sudan", "SS", "211", 6, 12],
    ["Spain", "ES", "34", 9, 9, "espana"],
    ["Sri Lanka", "LK", "94", 6, 12],
    ["Sudan", "SD", "249", 6, 12],
    ["Suriname", "SR", "597", 6, 7],
    ["Sweden", "SE", "46", 6, 12],
    ["Switzerland", "CH", "41", 6, 12],
    ["Syria", "SY", "963", 6, 12],
    ["Taiwan", "TW", "886", 6, 12],
    ["Tajikistan", "TJ", "992", 6, 12],
    ["Tanzania", "TZ", "255", 6, 12],
    ["Thailand", "TH", "66", 6, 12],
    ["Timor-Leste", "TL", "670", 6, 12, "east timor"],
    ["Togo", "TG", "228", 6, 12],
    ["Tonga", "TO", "676", 6, 12],
    ["Trinidad and Tobago", "TT", "1", 10, 10],
    ["Tunisia", "TN", "216", 6, 12],
    ["Turkey", "TR", "90", 10, 10],
    ["Turkmenistan", "TM", "993", 6, 12],
    ["Tuvalu", "TV", "688", 6, 12],
    ["Uganda", "UG", "256", 6, 12],
    ["Ukraine", "UA", "380", 6, 12],
    ["United Arab Emirates", "AE", "971", 6, 12, "uae"],
    ["United Kingdom", "GB", "44", 10, 10, "uk britain england reino unido"],
    ["United States", "US", "1", 10, 10, "usa eeuu estados unidos"],
    ["Uruguay", "UY", "598", 8, 8],
    ["Uzbekistan", "UZ", "998", 6, 12],
    ["Vanuatu", "VU", "678", 6, 12],
    ["Vatican City", "VA", "39", 6, 11],
    ["Venezuela", "VE", "58", 10, 10],
    ["Vietnam", "VN", "84", 6, 12],
    ["Yemen", "YE", "967", 6, 12],
    ["Zambia", "ZM", "260", 6, 12],
    ["Zimbabwe", "ZW", "263", 6, 12]
  ];
  var DIAL_PREFERRED = { "1": "US", "7": "RU", "39": "IT", "44": "GB" };
  var COUNTRIES = COUNTRY_ROWS.map(function (row) {
    return {
      name: row[0],
      iso: row[1],
      dial: row[2],
      min: row[3],
      max: row[4],
      alias: row[5] || ""
    };
  });

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function nameKey(s) {
    return fold(s).replace(/[^a-z0-9]/g, "");
  }
  function digitsOnly(s) {
    return String(s || "").replace(/\D/g, "");
  }
  function flagEmoji(iso) {
    var chars = String(iso || "").toUpperCase();
    if (chars.length !== 2) return "";
    var out = "";
    for (var i = 0; i < 2; i++) {
      var code = chars.charCodeAt(i);
      if (code < 65 || code > 90) return "";
      out += String.fromCodePoint(127397 + code);
    }
    return out;
  }
  function keepZero(country) {
    return country && (country.iso === "IT" || country.iso === "VA");
  }
  function countryByIso(iso) {
    for (var i = 0; i < COUNTRIES.length; i++) {
      if (COUNTRIES[i].iso === iso) return COUNTRIES[i];
    }
    return null;
  }
  function matchesCountry(country, query) {
    if (!query) return true;
    var key = nameKey(query);
    var dialQ = digitsOnly(query);
    if (key && nameKey(country.name).indexOf(key) !== -1) return true;
    if (key && country.alias && nameKey(country.alias).indexOf(key) !== -1) return true;
    if (key.length >= 2 && nameKey(country.iso) === key) return true;
    if (dialQ && country.dial.indexOf(dialQ) === 0) return true;
    return false;
  }
  function countryRank(country, query) {
    var key = nameKey(query);
    var name = nameKey(country.name);
    var dialQ = digitsOnly(query);
    if (!query) return "3" + name;
    if (dialQ && country.dial === dialQ && DIAL_PREFERRED[dialQ] === country.iso) return "0" + name;
    if (key && name.indexOf(key) === 0) return "1" + name;
    if (dialQ && country.dial === dialQ) return "2" + name;
    return "3" + name;
  }
  function matchDial(digits, current) {
    var bestLen = 0;
    var found = [];
    COUNTRIES.forEach(function (country) {
      if (digits.indexOf(country.dial) !== 0) return;
      if (country.dial.length > bestLen) {
        bestLen = country.dial.length;
        found = [country];
      } else if (country.dial.length === bestLen) found.push(country);
    });
    if (!found.length) return null;
    if (current) {
      for (var i = 0; i < found.length; i++) {
        if (found[i].iso === current.iso) return current;
      }
    }
    var pref = DIAL_PREFERRED[found[0].dial];
    if (pref) {
      for (var j = 0; j < found.length; j++) {
        if (found[j].iso === pref) return found[j];
      }
    }
    return found[0];
  }

  function mountCountryPhone(form) {
    var root = qs("[data-jg-country]", form);
    var phoneWrap = qs("[data-jg-phone]", form);
    var noop = {
      countryError: function () { return ""; },
      phoneError: function () { return ""; },
      showErrors: function () {},
      focusCountry: function () {},
      focusPhone: function () {},
      reset: function () {}
    };
    if (!root || !phoneWrap) return noop;

    var btn = qs(".jg-country__btn", root);
    var panel = qs(".jg-country__panel", root);
    var search = qs(".jg-country__search", root);
    var list = qs(".jg-country__list", root);
    var valueEl = qs("[data-jg-country-value]", root);
    var flagEl = qs("[data-jg-country-flag]", root);
    var badgeEl = qs("[data-jg-country-badge]", root);
    var countryErrorEl = qs("[data-jg-country-error]", form);
    var hiddenCountry = qs('input[name="country"]', root);
    var hiddenDial = qs('input[name="dial_code"]', root);
    var phoneInput = qs("#jg-phone", phoneWrap);
    var codeEl = qs("[data-jg-phone-code]", phoneWrap);
    var hintEl = qs("[data-jg-phone-hint]", form);
    var hiddenPhone = qs('input[name="phone"]', form);
    var selected = null;
    var phoneTouched = false;

    function lenText(country) {
      return country.min === country.max
        ? country.min + " digits"
        : country.min + "–" + country.max + " digits";
    }
    function nationalDigits() {
      return cleanNational(digitsOnly(phoneInput.value), selected);
    }
    function cleanNational(digits, country) {
      var d = digits;
      if (country && d.indexOf(country.dial) === 0 && d.length > country.max) d = d.slice(country.dial.length);
      if (country && !keepZero(country)) d = d.replace(/^0+/, "");
      return d;
    }
    function idleHint() {
      if (!selected) return "Choose your country and the dialing code is added for you.";
      var n = digitsOnly(phoneInput.value);
      if (!n) return selected.name + " · +" + selected.dial + " · enter " + lenText(selected) + ".";
      return "Full number: +" + selected.dial + " " + n;
    }
    function setHint(message, isError) {
      if (!hintEl) return;
      hintEl.textContent = message || idleHint();
      hintEl.classList.toggle("is-error", !!isError);
    }
    function syncHidden() {
      var n = digitsOnly(phoneInput.value);
      if (hiddenPhone) hiddenPhone.value = selected && n ? "+" + selected.dial + n : "";
    }
    function countryError() {
      return selected ? "" : "Select your country.";
    }
    function phoneError() {
      var n = digitsOnly(phoneInput.value);
      if (!selected) return n ? "Select your country so we can add the dialing code." : "";
      if (!n) return "Enter your mobile number.";
      if (n.length < selected.min) {
        return selected.min === selected.max
          ? "Enter all " + selected.min + " digits for " + selected.name + "."
          : "Enter at least " + selected.min + " digits for " + selected.name + ".";
      }
      if (n.length > selected.max) return "That number is too long for " + selected.name + ".";
      return "";
    }
    function showCountryError(message) {
      root.classList.toggle("is-invalid", !!message);
      btn.setAttribute("aria-invalid", message ? "true" : "false");
      if (!countryErrorEl) return;
      countryErrorEl.hidden = !message;
      countryErrorEl.textContent = message || "";
    }
    function showPhoneError(message) {
      phoneWrap.classList.toggle("is-invalid", !!message);
      phoneInput.setAttribute("aria-invalid", message ? "true" : "false");
      setHint(message, !!message);
    }
    function paintPhone() {
      if (phoneTouched) showPhoneError(phoneError());
      else setHint("", false);
    }
    function selectCountry(country, focusPhone) {
      selected = country;
      if (hiddenCountry) hiddenCountry.value = country.name;
      if (hiddenDial) hiddenDial.value = country.dial;
      valueEl.textContent = country.name;
      flagEl.textContent = flagEmoji(country.iso);
      flagEl.hidden = false;
      badgeEl.textContent = "+" + country.dial;
      badgeEl.hidden = false;
      btn.classList.remove("is-empty");
      codeEl.textContent = "+" + country.dial;
      codeEl.classList.remove("is-empty");
      phoneInput.maxLength = country.max;
      phoneInput.placeholder = lenText(country);
      var digits = cleanNational(digitsOnly(phoneInput.value), country);
      if (phoneInput.value !== digits) phoneInput.value = digits;
      syncHidden();
      showCountryError("");
      paintPhone();
      closePanel();
      if (focusPhone) phoneInput.focus();
    }
    function resetWidget() {
      selected = null;
      phoneTouched = false;
      valueEl.textContent = "Select your country";
      flagEl.textContent = "";
      flagEl.hidden = true;
      badgeEl.textContent = "";
      badgeEl.hidden = true;
      btn.classList.add("is-empty");
      codeEl.textContent = "+";
      codeEl.classList.add("is-empty");
      phoneInput.maxLength = 15;
      phoneInput.placeholder = "Mobile number";
      showCountryError("");
      phoneWrap.classList.remove("is-invalid");
      phoneInput.removeAttribute("aria-invalid");
      setHint("", false);
      closePanel();
    }
    function optionFrom(node) {
      while (node && node !== list) {
        if (node.classList && node.classList.contains("jg-country__opt")) return node;
        node = node.parentNode;
      }
      return null;
    }
    function reveal(opt) {
      var top = opt.offsetTop;
      var bottom = top + opt.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    }
    function setActive(opt) {
      qsa(".jg-country__opt", list).forEach(function (el) { el.classList.remove("is-active"); });
      if (!opt) {
        search.removeAttribute("aria-activedescendant");
        return;
      }
      opt.classList.add("is-active");
      search.setAttribute("aria-activedescendant", opt.id);
      reveal(opt);
    }
    function render(query) {
      var items = COUNTRIES.filter(function (country) { return matchesCountry(country, query); });
      items.sort(function (a, b) {
        var ra = countryRank(a, query);
        var rb = countryRank(b, query);
        if (ra < rb) return -1;
        if (ra > rb) return 1;
        return 0;
      });
      list.innerHTML = "";
      if (!items.length) {
        var empty = document.createElement("li");
        empty.className = "jg-country__empty";
        empty.textContent = "No country found.";
        list.appendChild(empty);
        search.removeAttribute("aria-activedescendant");
        return;
      }
      var frag = document.createDocumentFragment();
      items.forEach(function (country) {
        var li = document.createElement("li");
        var flag = document.createElement("span");
        var name = document.createElement("span");
        var dial = document.createElement("span");
        li.className = "jg-country__opt";
        li.id = "jg-country-opt-" + country.iso;
        li.setAttribute("role", "option");
        li.setAttribute("data-iso", country.iso);
        li.setAttribute("aria-selected", selected && selected.iso === country.iso ? "true" : "false");
        flag.className = "jg-country__flag";
        flag.setAttribute("aria-hidden", "true");
        flag.textContent = flagEmoji(country.iso);
        name.className = "jg-country__name";
        name.textContent = country.name;
        dial.className = "jg-country__opt-dial";
        dial.textContent = "+" + country.dial;
        li.appendChild(flag);
        li.appendChild(name);
        li.appendChild(dial);
        frag.appendChild(li);
      });
      list.appendChild(frag);
    }
    function openPanel() {
      panel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      search.setAttribute("aria-expanded", "true");
      root.classList.add("is-open");
      search.value = "";
      render("");
      var current = selected ? qs('[data-iso="' + selected.iso + '"]', list) : null;
      setActive(current || qs(".jg-country__opt", list));
      search.focus();
    }
    function closePanel() {
      panel.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      search.setAttribute("aria-expanded", "false");
      root.classList.remove("is-open");
      search.removeAttribute("aria-activedescendant");
    }
    function choose(country) {
      if (country) selectCountry(country, true);
    }
    function applyRaw(raw, fromPaste) {
      var original = String(raw || "");
      var digits = digitsOnly(original);
      var international = fromPaste && (original.indexOf("+") !== -1 || /^\s*00/.test(original));
      if (international && digits.indexOf("00") === 0) digits = digits.slice(2);
      if (international && digits) {
        var matched = matchDial(digits, selected);
        if (matched && digits.length > matched.dial.length) {
          digits = digits.slice(matched.dial.length);
          if (phoneInput.value !== digits) phoneInput.value = digits;
          selectCountry(matched, false);
          return;
        }
      }
      digits = cleanNational(digits, selected);
      if (phoneInput.value !== digits) phoneInput.value = digits;
      syncHidden();
      paintPhone();
    }

    btn.addEventListener("click", function () {
      if (root.classList.contains("is-open")) closePanel();
      else openPanel();
    });
    search.addEventListener("input", function () {
      render(search.value);
      setActive(qs(".jg-country__opt", list));
    });
    search.addEventListener("keydown", function (e) {
      var opts = qsa(".jg-country__opt", list);
      var idx = -1;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].classList.contains("is-active")) idx = i;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(opts[Math.min(opts.length - 1, idx + 1)] || opts[0]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(opts[Math.max(0, idx - 1)] || opts[0]);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActive(opts[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        setActive(opts[opts.length - 1]);
      } else if (e.key === "Enter") {
        e.preventDefault();
        var chosen = idx >= 0 ? opts[idx] : opts[0];
        if (chosen) choose(countryByIso(chosen.getAttribute("data-iso")));
      } else if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        btn.focus();
      }
    });
    list.addEventListener("mousedown", function (e) {
      var opt = optionFrom(e.target);
      if (!opt) return;
      e.preventDefault();
      choose(countryByIso(opt.getAttribute("data-iso")));
    });
    list.addEventListener("mousemove", function (e) {
      var opt = optionFrom(e.target);
      if (opt) setActive(opt);
    });
    document.addEventListener("mousedown", function (e) {
      if (!root.classList.contains("is-open")) return;
      if (!root.contains(e.target)) closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("is-open")) {
        closePanel();
        btn.focus();
      }
    });
    phoneInput.addEventListener("input", function () { applyRaw(phoneInput.value, false); });
    phoneInput.addEventListener("paste", function (e) {
      var clip = e.clipboardData || window.clipboardData;
      var text = clip ? clip.getData("text") : "";
      if (!text) return;
      e.preventDefault();
      phoneTouched = true;
      applyRaw(text, true);
    });
    phoneInput.addEventListener("blur", function () {
      phoneTouched = true;
      showPhoneError(phoneError());
    });
    form.addEventListener("reset", function () {
      setTimeout(resetWidget, 0);
    });

    return {
      countryError: countryError,
      phoneError: phoneError,
      showErrors: function (countryMsg, phoneMsg) {
        phoneTouched = true;
        showCountryError(countryMsg);
        showPhoneError(phoneMsg);
      },
      focusCountry: function () { btn.focus(); },
      focusPhone: function () { phoneInput.focus(); },
      reset: resetWidget
    };
  }

  function bindForm() {
    var form = qs("[data-jg-contact-form]");
    if (!form) return;
    var status = qs("[data-jg-contact-status]", form);
    var phoneCountry = mountCountryPhone(form);

    function setStatus(message) {
      if (!status) return;
      status.hidden = false;
      var note = qs("span", status);
      if (note) note.textContent = message;
      else status.textContent = message;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = qsa("input[required], select[required], textarea[required]", form);
      var ok = true;
      fields.forEach(function (el) {
        var valid = !!String(el.value || "").trim() && (el.type !== "email" || el.checkValidity());
        el.classList.toggle("is-invalid", !valid);
        if (!valid) ok = false;
      });
      var countryMsg = phoneCountry.countryError();
      var phoneMsg = phoneCountry.phoneError();
      phoneCountry.showErrors(countryMsg, phoneMsg);
      if (countryMsg || phoneMsg) ok = false;
      if (!ok) {
        setStatus(countryMsg || phoneMsg || "Please complete the required fields.");
        if (countryMsg) phoneCountry.focusCountry();
        else if (phoneMsg) phoneCountry.focusPhone();
        else {
          var first = qs(".is-invalid", form);
          if (first && first.focus) first.focus();
        }
        return;
      }
      setStatus("Thank you. This local preview does not send the message yet. On the live site a member of our team will get back to you.");
      form.reset();
    });

    qsa("input, select, textarea", form).forEach(function (el) {
      el.addEventListener("input", function () { el.classList.remove("is-invalid"); });
    });
  }

  function bindReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sections = qsa("#main section").filter(function (el) {
      return !el.classList.contains("jg-hero");
    });
    var pieceSel = [
      ".jg-help h2",
      ".jg-help-card",
      ".jg-form-card > h2",
      ".jg-form-card > p",
      ".jg-contact-form",
      ".jg-info-card > h2",
      ".jg-info-card > p",
      ".jg-info-list",
      ".jg-info-card .jg-social",
      ".jg-office__body > *",
      ".jg-prayer > *",
      ".jg-final__content > h2",
      ".jg-final__content > p",
      ".jg-final__ctas"
    ].join(",");
    var groupSel = ".jg-help-card, .jg-final__ctas";

    function show(section) {
      if (!reduce) section.classList.add("is-in");
    }

    if (!reduce) {
      sections.forEach(function (section) {
        var t = 0;
        qsa(pieceSel, section).forEach(function (el) {
          el.classList.add("jg-piece");
          el.style.setProperty("--jg-d", t.toFixed(2) + "s");
          t += el.matches(groupSel) ? 0.1 : 0.14;
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

  bindMenu();
  bindSubjectLinks();
  bindForm();
  bindReveal();
})();
