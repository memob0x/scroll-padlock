"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var $head = document.head;
  var $html = document.documentElement;
  var $body = document.body;

  var createStyle = function createStyle() {
    var $el = document.createElement("style");
    $el.type = "text/css";
    return $el;
  };

  var $stylerBase = createStyle();
  var $stylerResizable = createStyle();
  var isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  var isMultiTouchMacAkaIOS13 = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  var isAppleTouchDevice = isLegacyIOS || isMultiTouchMacAkaIOS13;

  var BodyScrollEvent = function () {
    if (typeof window.CustomEvent === "function") {
      return window.CustomEvent;
    }

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }();

  var status = false;
  var scroll = {
    x: 0,
    y: 0
  };
  var scrollbarWidth = 0;
  var clientWidth = 0;

  var getBaseRules = function getBaseRules() {
    var output = "html, body {\n        height: auto!important;\n        margin: 0!important;\n        padding: 0 ".concat(scrollbarWidth, "px 0 0!important;\n    }");

    if (isAppleTouchDevice) {
      output += "html {\n            position: fixed!important;\n            top: ".concat(-1 * scroll.y, "px!important;\n            left: ").concat(-1 * scroll.x, "px!important;\n            overflow: visible!important;\n        }");
    } else {
      output += "body {\n            overflow: hidden!important;\n        }";
    }

    return output;
  };

  var getResizableRules = function getResizableRules() {
    return "html, body {\n        width: ".concat(clientWidth, "px!important;\n    }");
  };

  var printRules = function printRules($actor, rules) {
    if ($actor.styleSheet) {
      $actor.styleSheet.cssText = rules;
    } else {
      $actor.appendChild(document.createTextNode(rules));
    }

    if ($actor.parentNode !== $head) {
      $head.append($actor);
    }
  };

  var printBaseRules = function printBaseRules() {
    return printRules($stylerBase, getBaseRules());
  };

  var printResizableRules = function printResizableRules() {
    return printRules($stylerResizable, getResizableRules());
  };

  var resize = function resize() {
    if (!status) {
      return;
    }

    clientWidth = $html.clientWidth;
    printResizableRules();
  };

  var isLocked = function isLocked() {
    return status;
  };

  var lock = function lock() {
    if (status) {
      return false;
    }

    status = true;

    if (isAppleTouchDevice) {
      scroll = {
        x: window.scrollX,
        y: window.scrollY
      };
    }

    var _clientWidth = $html.clientWidth;
    $body.style.width = $body.clientWidth + "px";
    $html.style.overflow = "hidden";
    clientWidth = $html.clientWidth;
    scrollbarWidth = clientWidth - _clientWidth;
    $body.style.width = "";
    $html.style.overflow = "";
    printBaseRules();
    printResizableRules();

    if (isAppleTouchDevice) {
      window.scroll(0, 0);
    }

    window.dispatchEvent(new BodyScrollEvent("bodyScrollLock", {
      detail: {
        clientWidth: clientWidth,
        scrollbarWidth: scrollbarWidth
      }
    }));
    document.addEventListener("resize", resize);
    return true;
  };

  var unlock = function unlock() {
    if (!status) {
      return false;
    }

    status = false;
    $stylerBase.innerHTML = "";
    $stylerResizable.innerHTML = "";

    if (isAppleTouchDevice) {
      window.scroll(scroll.x, scroll.y);
    }

    window.dispatchEvent(new BodyScrollEvent("bodyScrollUnlock", {
      detail: {
        clientWidth: clientWidth,
        scrollbarWidth: scrollbarWidth
      }
    }));
    document.removeEventListener("resize", resize);
    return true;
  };

  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: function toggle() {
      return !isLocked() ? lock() : unlock();
    },
    isLocked: isLocked
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
