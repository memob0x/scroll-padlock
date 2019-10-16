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

  var isAppleTouchDevice = function isAppleTouchDevice() {
    var userAgent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.navigator.userAgent;
    var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.navigator.platform;
    var maxTouchPoints = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window.navigator.maxTouchPoints;
    var isLegacyIOS = /iPad|iPhone|iPod/.test(userAgent);
    var isMultiTouchMacAkaIOS13 = platform === "MacIntel" && maxTouchPoints > 1;
    return isLegacyIOS || isMultiTouchMacAkaIOS13;
  };

  var shouldUsePositionFixedTechnique = isAppleTouchDevice();
  var scrollPosition = {
    x: 0,
    y: 0
  };
  var scrollbarWidth = 0;
  var clientWidth = 0;
  var options = {
    alwaysUsePositionFixedTechnique: false
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

  var insertBaseRules = function insertBaseRules() {
    insertIndexedRule("html {\n            padding-right: ".concat(scrollbarWidth, "px!important;\n        }"), 0);

    if (shouldUsePositionFixedTechnique || options.alwaysUsePositionFixedTechnique) {
      insertIndexedRule("html {\n                height: auto!important;\n                position: fixed!important;\n                top: ".concat(-1 * scrollPosition.y, "px!important;\n                left: ").concat(-1 * scrollPosition.x, "px!important;\n                overflow: visible!important;\n            }"), 1);
    } else {
      insertIndexedRule("body {\n                overflow: hidden!important;\n            }", 1);
    }
  };

  var insertResizableRules = function insertResizableRules() {
    return insertIndexedRule("html {\n            width: ".concat(clientWidth, "px!important;\n        }"), 2);
  };

  var resizeListener = function resizeListener() {
    clientWidth = $html.clientWidth;
    insertResizableRules();
  };

  var isLocked = function isLocked() {
    return isStyleElementInHead() && !$style.disabled;
  };

  var lock = function lock() {
    if (isLocked()) {
      return false;
    }

    if (shouldUsePositionFixedTechnique || options.alwaysUsePositionFixedTechnique) {
      scrollPosition = {
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
    insertBaseRules();
    insertResizableRules();
    $style.disabled = false;

    if (shouldUsePositionFixedTechnique || options.alwaysUsePositionFixedTechnique) {
      window.scroll(0, 0);
    }

    window.dispatchEvent(new CustomEvent("bodyScrollLock", {
      detail: {
        clientWidth: clientWidth,
        scrollbarWidth: scrollbarWidth
      }
    }));
    window.addEventListener("resize", resizeListener);
    return true;
  };

  var unlock = function unlock() {
    if (!isLocked()) {
      return false;
    }

    $style.disabled = true;

    if (shouldUsePositionFixedTechnique || options.alwaysUsePositionFixedTechnique) {
      window.scroll(scrollPosition.x, scrollPosition.y);
    }

    window.dispatchEvent(new CustomEvent("bodyScrollUnlock", {
      detail: {
        clientWidth: clientWidth,
        scrollbarWidth: scrollbarWidth
      }
    }));
    window.removeEventListener("resize", resizeListener);
    return true;
  };

  var setOption = function setOption(name, value) {
    if (name in options && _typeof(value) === _typeof(options[name])) {
      options[name] = value;
    }
  };

  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: function toggle() {
      return !isLocked() ? lock() : unlock();
    },
    isLocked: isLocked,
    setOption: setOption
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
