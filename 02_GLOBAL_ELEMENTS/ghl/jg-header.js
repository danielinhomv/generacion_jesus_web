/* GHL field: Footer Tracking Code — wrap in <script> when pasting, or paste the IIFE body */
(function () {
  function bindHeader(header) {
    var toggle = header.querySelector("[data-jg-menu-toggle]");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function init() {
    var headers = document.querySelectorAll("[data-jg-header]");
    if (!headers.length) return;
    for (var i = 0; i < headers.length; i += 1) {
      bindHeader(headers[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
