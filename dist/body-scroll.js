"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var $head = document.head;
  var $html = document.documentElement;
  var $body = document.body;
  var supportsCustomEvents = typeof window.CustomEvent === "function";

  var getOrCreateUniqueStyleElement = function getOrCreateUniqueStyleElement(id) {
    return $head.querySelector("#".concat(id)) || function () {
      var $style = document.createElement("style");
      $style.id = id;
      return $style;
    }();
  };

  var isStyleElementInHead = function isStyleElementInHead($style) {
    return $style.parentNode === $head;
  };

  var insertIndexedRuleInStyleElement = function insertIndexedRuleInStyleElement($style) {
    var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (!isStyleElementInHead($style)) {
      $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
      $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(rule, index);
    return $style;
  };

  var $locker = getOrCreateUniqueStyleElement("body-scroll-locker");
  var CssVars = {
    SCROLL_Y: "--body-scroll-scroll-y",
    SCROLLBAR_WIDTH: "--body-scroll-scrollbar-width"
  };

  var getClientWidth = function getClientWidth(locked) {
    $body.style.width = locked ? "".concat($html.clientWidth, "px") : "";
    $html.style.overflow = locked ? "hidden" : "";
    return $html.clientWidth;
  };

  var setLockerCssVars = function setLockerCssVars() {
    insertIndexedRuleInStyleElement($locker, ":root {\n            ".concat(CssVars.SCROLL_Y, ": ").concat(window.scrollY, "px!important;\n            ").concat(CssVars.SCROLLBAR_WIDTH, ": ").concat(getClientWidth(true) - getClientWidth(false), "px!important;\n        }"));
  };

  if (!!!window.getComputedStyle($html).getPropertyValue(CssVars.SCROLLBAR_WIDTH)) {
    insertIndexedRuleInStyleElement(getOrCreateUniqueStyleElement("body-scroll-defaults"), ":root {\n            ".concat(CssVars.SCROLLBAR_WIDTH, ": 0;\n        }"));
  }

  var scroll = {
    x: 0,
    y: 0
  };

  var getScrollPosition = function getScrollPosition() {
    return new Object({
      x: window.scrollX,
      y: window.scrollY
    });
  };

  var saveScrollPosition = function saveScrollPosition() {
    return scroll = getScrollPosition();
  };

  var restoreScrollPosition = function restoreScrollPosition() {
    return window.scrollTo(scroll.x, scroll.y);
  };

  var LOCKED_STATUS_CSS_CLASS = "body-scroll-locked";

  var isLocked = function isLocked() {
    return isStyleElementInHead($locker) && !$locker.disabled && $html.classList.contains(LOCKED_STATUS_CSS_CLASS);
  };

  var update = function update() {
    if (!isLocked()) {
      return;
    }

    _unlock();

    _lock();
  };

  var _lock = function _lock() {
    saveScrollPosition();
    $locker.disabled = false;
    setLockerCssVars();
    $html.classList.add(LOCKED_STATUS_CSS_CLASS);
  };

  var lock = function lock() {
    _lock();

    if (supportsCustomEvents) {
      window.dispatchEvent(new CustomEvent("bodyScrollLock"));
    }

    window.addEventListener("resize", update);
  };

  var _unlock = function _unlock() {
    $html.classList.remove(LOCKED_STATUS_CSS_CLASS);
    restoreScrollPosition();
    $locker.disabled = true;
  };

  var unlock = function unlock() {
    _unlock();

    if (supportsCustomEvents) {
      window.dispatchEvent(new CustomEvent("bodyScrollUnlock"));
    }

    window.removeEventListener("resize", update);
  };

  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    toggle: function toggle() {
      return isLocked() ? unlock() : lock();
    },
    update: update
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
