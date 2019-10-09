"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var status = false;

  var lock = function lock() {};

  var unlock = function unlock() {};

  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: function toggle() {
      return lock();
    },
    isLocked: function isLocked() {
      return status;
    }
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
