"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var NAMESPACE = "body-scroll-lock";
  var $head = document.head;
  var $html = document.documentElement;
  var $body = document.body;

  var $style = $head.querySelector("#".concat(NAMESPACE)) || function () {
    var $style = document.createElement("style");
    $style.id = NAMESPACE;
    return $style;
  }();

  var _x = 0;
  var _y = 0;

  var save = function save() {
    _x = window.pageXOffset;
    _y = window.pageYOffset;
  };

  var restore = function restore() {
    return window.scrollTo(_x, _y);
  };

  var _styleExists = function _styleExists() {
    return $style.parentNode === $head;
  };

  var _getClientWidth = function _getClientWidth(locked) {
    $body.style.width = locked ? "".concat($html.getBoundingClientRect().width, "px") : "";
    $html.style.overflow = locked ? "hidden" : "";
    return $html.getBoundingClientRect().width;
  };

  var _dispatch = function _dispatch(eventName) {
    return typeof window.CustomEvent === "function" ? window.dispatchEvent(new CustomEvent(eventName)) : function () {};
  };

  var _lock = function _lock() {
    save();
    $style.disabled = false;
    var index = 0;

    if (!_styleExists()) {
      $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
      $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(":root {\n            --".concat(NAMESPACE, "-top-rect: ").concat(window.scrollY * -1, "px!important;\n            --").concat(NAMESPACE, "-scrollbar-gap: ").concat(_getClientWidth(true) - _getClientWidth(false), "px!important;\n        }"), index);
    $html.classList.add(NAMESPACE);
  };

  var _unlock = function _unlock() {
    $html.classList.remove(NAMESPACE);
    restore();
    $style.disabled = true;
  };

  var _resize = function _resize(mode) {
    return window["".concat(mode, "EventListener")]("resize", update);
  };

  var isLocked = function isLocked() {
    return _styleExists() && !$style.disabled && $html.classList.contains(NAMESPACE);
  };

  var update = function update() {
    if (!isLocked()) {
      return;
    }

    _unlock();

    _lock();
  };

  var lock = function lock() {
    _lock();

    _dispatch("bodyscrolllock");

    _resize("add");
  };

  var unlock = function unlock() {
    _unlock();

    _dispatch("bodyscrollunlock");

    _resize("remove");
  };

  var Api = Object.freeze({
    __proto__: null,
    isLocked: isLocked,
    update: update,
    lock: lock,
    unlock: unlock
  });
  return Api;
});
//# sourceMappingURL=body-scroll.es5.js.map
