"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var $head = document.head;
  var $html = document.documentElement;
  var $body = document.body;
  var $style = document.createElement("style");
  var CssVars = {
    SCROLL_Y: "--body-scroll-scroll-y",
    SCROLLBAR_WIDTH: "--body-scroll-scrollbar-width"
  };

  var getClientWidth = function getClientWidth(locked) {
    $body.style.width = locked ? "".concat($html.clientWidth, "px") : "";
    $html.style.overflow = locked ? "hidden" : "";
    return $html.clientWidth;
  };

  var isStyleElementInHead = function isStyleElementInHead() {
    return $style.parentNode === $head;
  };

  var insertIndexedRule = function insertIndexedRule() {
    var rule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (!isStyleElementInHead()) {
      $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
      $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(rule, index);
  };

  var setCssVars = function setCssVars() {
    insertIndexedRule(":root {\n            ".concat(CssVars.SCROLL_Y, ": ").concat(window.scrollY, "px;\n            ").concat(CssVars.SCROLLBAR_WIDTH, ": ").concat(getClientWidth(true) - getClientWidth(false), "px;\n        }"));
  };

  var scroll = {
    x: 0,
    y: 0
  };

  var getScrollPosition = function getScrollPosition() {
    return {
      x: window.scrollX,
      y: window.scrollY
    };
  };

  var saveScrollPosition = function saveScrollPosition() {
    return scroll = getScrollPosition();
  };

  var restoreScrollPosition = function restoreScrollPosition() {
    return window.scrollTo(scroll.x, scroll.y);
  };

  var LOCKED_STATUS_CSS_CLASS = "body-scroll-locked";

  var isLocked = function isLocked() {
    return isStyleElementInHead() && !$style.disabled;
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
    $style.disabled = false;
    setCssVars();
    $html.classList.add(LOCKED_STATUS_CSS_CLASS);
  };

  var lock = function lock() {
    _lock();

    window.dispatchEvent(new CustomEvent("bodyScrollLock"));
    window.addEventListener("resize", update);
  };

  var _unlock = function _unlock() {
    $html.classList.remove(LOCKED_STATUS_CSS_CLASS);
    restoreScrollPosition();
    $style.disabled = true;
  };

  var unlock = function unlock() {
    _unlock();

    window.dispatchEvent(new CustomEvent("bodyScrollUnlock"));
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
