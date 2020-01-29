"use strict";

var $console = document.querySelector(".console");

var log = function log() {
  var _console;

  for (var _len = arguments.length, message = new Array(_len), _key = 0; _key < _len; _key++) {
    message[_key] = arguments[_key];
  }

  console.log && (_console = console).log.apply(_console, message);
  var $ol = $console.querySelector("ol");

  if (!$ol) {
    $ol = document.createElement("ol");
    $ol.classList.add("console__list");
    $console.appendChild($ol);
  }

  var $li = document.createElement("li");
  $li.classList.add("console__list__item");
  $li.innerHTML = message;
  $ol.appendChild($li);
  $ol.scrollTo(0, $ol.scrollHeight);
};

document.querySelector(".toggle-scroll-lock").addEventListener("click", function () {
  return !bodyScroll.isLocked() ? bodyScroll.lock() : bodyScroll.unlock();
});
document.querySelector("button.toggle-custom-scrollbar").addEventListener("click", function () {
  log("toggling custom scrollbars");
  document.body.classList.toggle("custom-scrollbar");
  bodyScroll.update();
});
window.addEventListener("bodyscrolllock", function () {
  return log("body scroll locked");
});
window.addEventListener("bodyscrollunlock", function () {
  return log("body scroll unlocked");
});

(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  window.CustomEvent = CustomEvent;
})();
//# sourceMappingURL=scripts.js.map
