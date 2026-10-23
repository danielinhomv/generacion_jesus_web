(function () {
  "use strict";

  var panel = document.querySelector(".jg-gv-panel");
  if (!panel) return;

  var freqs = panel.querySelectorAll("[data-gv-freq]");
  var amounts = panel.querySelectorAll("[data-gv-amount]");
  var other = panel.querySelector(".jg-gv-other");
  var otherInput = other ? other.querySelector("input") : null;

  function setFreq(value) {
    freqs.forEach(function (button) {
      var on = button.getAttribute("data-gv-freq") === value;
      button.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  freqs.forEach(function (button) {
    button.addEventListener("click", function () {
      setFreq(button.getAttribute("data-gv-freq"));
    });
  });

  amounts.forEach(function (button) {
    button.addEventListener("click", function () {
      amounts.forEach(function (item) {
        item.setAttribute("aria-pressed", "false");
      });
      button.setAttribute("aria-pressed", "true");
      var isOther = button.getAttribute("data-gv-amount") === "other";
      if (other) other.hidden = !isOther;
      if (isOther && otherInput) otherInput.focus();
    });
  });

  document.querySelectorAll("[data-gv-jump]").forEach(function (link) {
    link.addEventListener("click", function () {
      var freq = link.getAttribute("data-gv-jump");
      if (freq) setFreq(freq);
    });
  });
})();
