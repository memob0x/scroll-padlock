"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : global.bodyScroll = factory();
})(void 0, function () {
  'use strict';

  var html = document.documentElement;
  var head = document.head || document.getElementsByTagName('head')[0];
  var ua = navigator.userAgent;
  var isSafari = !!ua.match(/Version\/[\d\.]+.*Safari/);
  var isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  var isSafariIOS = isIOS && isSafari;

  var BodyScrollEvent = function () {
    if (typeof window.CustomEvent === 'function') {
      return window.CustomEvent;
    }

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    return CustomEvent;
  }();

  var status = false;

  var setStatus = function setStatus() {
    var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return status = bool;
  };

  var state = {
    scroll: {
      top: 0,
      left: 0,
      behavior: 'auto'
    },
    html: {
      width: 'auto',
      height: 'auto'
    },
    body: {
      width: 'auto',
      height: 'auto',
      paddingRight: 0,
      paddingBottom: 0
    },
    scrollbars: {
      y: 0,
      x: 0
    }
  };

  var setState = function setState() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var _state = _objectSpread({}, state, {
      scroll: {
        top: html.scrollTop,
        left: html.scrollLeft
      }
    });

    if (isSafariIOS) {
      _state.html = {
        width: vw + _state.scroll.left,
        height: vh + _state.scroll.top
      };
      _state.body = {
        width: html.scrollWidth,
        height: html.scrollHeight
      };
    } else {
      var width = html.clientWidth;
      var height = html.clientHeight;
      _state.scrollbars = {
        y: vw > width ? vw - width : 0,
        x: vh > height ? vh - height : 0
      };
      _state.body.paddingRight = _state.scrollbars.y;
    }

    state = _state;
  };

  var settings = {
    important: true,
    corrections: []
  };
  var defaultCorrection = {
    selector: null,
    property: 'margin-right',
    inverted: false
  };
  var supportedProperties = ['margin-right', 'margin-bottom', 'padding-right', 'padding-bottom', 'right', 'bottom'];

  var setCorrections = function setCorrections() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var corrections = [];

    var collectionType = _typeof(collection);

    if (collectionType === 'string' || !Array.isArray(collection) && collectionType === 'object') {
      collection = [collection];
    }

    collection.forEach(function (entry) {
      if (entry) {
        var entryType = _typeof(entry);

        if (entryType === 'string') {
          corrections.push(_objectSpread({}, defaultCorrection, {
            selector: entry
          }));
        }

        if (!Array.isArray(entry) && entryType === 'object' && entry.selector && (!entry.property || supportedProperties.indexOf(entry.property) > -1)) {
          corrections.push(_objectSpread({}, defaultCorrection, entry));
        }
      }
    });
    return corrections;
  };

  var setOptions = function setOptions() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!status) {
      settings = _objectSpread({}, settings, options);
      settings.corrections = setCorrections(settings.corrections);
    }
  };

  var styler = function styler(id) {
    id = "body-scroll-".concat(id);
    var element = head.querySelector("style#".concat(id));

    if (!element) {
      element = document.createElement('style');
      element.type = 'text/css';
      element.id = id;
      head.appendChild(element);
    }

    return element;
  };

  var updateStyle = function updateStyle() {
    var important = settings.important ? '!important' : '';
    var $base = styler('base');
    $base.disabled = !status;

    if (!$base.sheet.cssRules.length) {
      $base.sheet.insertRule("\n            html,\n            body {\n                margin: 0".concat(important, ";\n                min-width: auto").concat(important, ";\n                min-height: auto").concat(important, ";\n                max-width: none").concat(important, ";\n                max-height: none").concat(important, ";\n            }\n        "), 0);
      $base.sheet.insertRule("\n            html {\n                padding: 0".concat(important, ";\n            }\n        "), 1);
    }

    var $scrollbar = styler('scrollbar');
    $scrollbar.disabled = !status;

    if ($scrollbar.sheet.cssRules.length) {
      $scrollbar.sheet.deleteRule(1);
      $scrollbar.sheet.deleteRule(0);
    }

    $scrollbar.sheet.insertRule("\n        html {\n            width: ".concat(state.html.width, "px").concat(important, ";\n            height: ").concat(state.html.height, "px").concat(important, ";\n        }\n    "), 0);
    $scrollbar.sheet.insertRule("\n        body{\n            width: ".concat(state.body.width, "px").concat(important, ";\n            height: ").concat(state.body.height, "px").concat(important, ";\n            padding: 0 ").concat(state.body.paddingRight, "px ").concat(state.body.paddingBottom, "px 0").concat(important, ";\n        }\n    "), 1);
    var $lock = styler('lock');
    $lock.disabled = !status;

    if (isSafariIOS) {
      if (!$lock.sheet.cssRules.length) {
        $lock.sheet.insertRule("\n                html,\n                body {\n                    overflow: visible".concat(important, ";\n                }\n            "), 0);
        $lock.sheet.insertRule("\n                html {\n                    position: fixed".concat(important, ";\n                }\n            "), 1);
      } else {
        $scrollbar.sheet.deleteRule(2);
      }

      $lock.sheet.insertRule("\n            html {\n                top: ".concat(state.scroll.top * -1, "px").concat(important, ";\n                left: ").concat(state.scroll.left * -1, "px").concat(important, ";\n            }\n        "), 2);
    } else {
      if (!$lock.sheet.cssRules.length) {
        $lock.sheet.insertRule("\n                body {\n                    overflow: hidden".concat(important, ";\n                }\n            "), 0);
      }
    }

    var corrections = settings.corrections;

    if (corrections.length) {
      var $corrections = styler('corrections');

      for (var i = $corrections.sheet.cssRules.length - 1; i >= 0; i--) {
        $corrections.sheet.deleteRule(i);
      }

      corrections.forEach(function (entry) {
        var gap = state.scrollbars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

        if (gap > 0) {
          var factor = 1;

          if (!status) {
            factor = entry.inverted ? -1 : 0;
          }

          $corrections.sheet.insertRule("\n                    ".concat(entry.selector, " {\n                        ").concat(entry.property, ": ").concat(gap * factor, "px").concat(settings.important ? '!important' : '', ";\n                    }\n                "));
        }
      });
    }
  };

  var lock = function lock() {
    if (!status) {
      setStatus(true);
      setState();
      updateStyle();
      window.dispatchEvent(new BodyScrollEvent('bodyScrollLock'));
    }
  };

  var unlock = function unlock() {
    if (status) {
      setStatus(false);
      updateStyle();
      window.scrollTo(state.scroll);
      window.dispatchEvent(new BodyScrollEvent('bodyScrollUnlock'));
    }
  };

  var toggle = function toggle() {
    return !status ? lock() : unlock();
  };

  var timer = null;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (status) {
        unlock();
        lock();
      }
    }, 500);
  });
  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: toggle,
    isLocked: function isLocked() {
      return status;
    },
    setOptions: setOptions
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
