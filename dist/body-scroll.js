"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : global.bodyScroll = factory();
})(void 0, function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body || document.getElementsByTagName('body')[0];
  var head = document.head || document.getElementsByTagName('head')[0];
  var stylesIncubator = document.createElement('style');
  stylesIncubator.type = 'text/css';
  var styler = stylesIncubator;
  var status = false;

  var setStatus = function setStatus() {
    var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return status = bool;
  };

  var scrollState = {
    top: 0,
    left: 0,
    behavior: 'auto'
  };

  var setScrollState = function setScrollState() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return scrollState = _objectSpread({}, scrollState, obj);
  };

  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  var uniqueID = function uniqueID() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  var stringContains = function stringContains(heystack, needle) {
    return String.prototype.includes ? heystack.includes(needle) : heystack.indexOf(needle, 0) !== -1;
  };

  var scrollbarGapSelectors = [];
  var defaults = {
    selector: null,
    property: 'margin-right'
  };

  var registerScrollbarGapSelectors = function registerScrollbarGapSelectors() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var collectionType = _typeof(collection);

    if (collectionType === 'string' || !Array.isArray(collection) && collectionType === 'object') {
      collection = [collection];
    }

    collection.forEach(function (entry) {
      if (entry) {
        var entryType = _typeof(entry);

        if (entryType === 'string') {
          scrollbarGapSelectors.push(_objectSpread({}, defaults, {
            selector: entry
          }));
        }

        if (!Array.isArray(entry) && entryType === 'object' && entry.selector && (!entry.property || entry.property === 'margin-right' || entry.property === 'margin-bottom' || entry.property === 'padding-right' || entry.property === 'padding-bottom')) {
          scrollbarGapSelectors.push(_objectSpread({}, defaults, entry));
        }
      }
    });
  };

  var lock = function lock() {
    if (!status) {
      var vw = 0;
      var vh = 0;
      var hw = 0;
      var hh = 0;
      var scrollbars = {};
      var hasScrollbarsGapSelectors = scrollbarGapSelectors.length;
      var scrollState$$1 = setScrollState({
        top: html.scrollTop,
        left: html.scrollLeft
      });
      var bw = body.clientWidth;
      var bh = body.clientHeight;
      bw -= bw - body.offsetWidth;
      bh -= bh - body.offsetHeight;

      if (hasScrollbarsGapSelectors) {
        vw = window.innerWidth;
        vh = window.innerHeight;
        hw = html.clientWidth;
        hh = html.clientHeight;
        scrollbars = {
          y: vw > hw ? vw - hw : 0,
          x: vh > hh ? vh - hh : 0
        };
      }

      var css = "\n        html {\n            overflow: visible!important;\n            margin-right: 0!important;\n        }\n        html,\n        body {\n            padding-right: 0!important;\n            min-width: ".concat(bw, "px!important;\n            width: ").concat(bw, "px!important;\n            max-width: ").concat(bw, "px!important;\n            min-height: ").concat(bh, "px!important;\n            height: ").concat(bh, "px!important;\n            max-height: ").concat(bh, "px!important;\n        }\n        body {\n            overflow: hidden!important;\n            position: fixed!important;\n            top: 0!important;\n            left: 0!important;\n            right: auto!important;\n            bottom: auto!important;\n            margin: -").concat(scrollState$$1.top, "px 0 0 -").concat(scrollState$$1.left, "px!important;\n        }");

      if (hasScrollbarsGapSelectors) {
        scrollbarGapSelectors.forEach(function (entry) {
          var gap = scrollbars[stringContains(entry.property, 'right') ? 'y' : 'x'];

          if (gap > 0) {
            css += "\n                    ".concat(entry.selector, " {\n                        ").concat(entry.property, ": ").concat(gap, "px!important;\n                    }");
          }
        });
      }

      if (styler.styleSheet) {
        styler.styleSheet.cssText = css;
      } else {
        styler.innerHTML = '';
        styler.appendChild(document.createTextNode(css));
      }

      head.appendChild(styler);
      setStatus(true);
    }
  };

  var unlock = function unlock() {
    if (status) {
      styler.remove();
      window.scrollTo(scrollState);
      setStatus(false);
    }
  };

  var namespacesKey = 'namespaces_' + uniqueID();

  var addEventListener = function addEventListener(element, event, handler, options) {
    if (!element[namespacesKey]) {
      element[namespacesKey] = {};
    }

    element[namespacesKey][event] = handler;
    element.addEventListener(event.split('.')[0], handler, options || false);
  };

  var _requestAnimationFrame = window.requestAnimationFrame;
  var _cancelAnimationFrame = window.cancelAnimationFrame;
  ['ms', 'moz', 'webkit', 'o'].forEach(function (vendor) {
    _requestAnimationFrame = _requestAnimationFrame || window[vendor + 'RequestAnimationFrame'];
    _cancelAnimationFrame = _cancelAnimationFrame || window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
  });
  var requestAnimationFrame = _requestAnimationFrame;
  var cancelAnimationFrame = _cancelAnimationFrame;

  var CustomEvent = window.CustomEvent || function () {
    var _polyfill = function _polyfill(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    _polyfill.prototype = window.Event.prototype;
    return _polyfill;
  }();

  var supportAnimationFrameTimers = cancelAnimationFrame && requestAnimationFrame;
  var requests = [];

  var requestTimeout = function requestTimeout(fn, delay) {
    if (!supportAnimationFrameTimers) {
      return window.setTimeout(fn, delay);
    }

    var start = Date.now();
    var id = uniqueID();

    var loop = function loop() {
      var current = Date.now();
      var delta = current - start;

      if (delta >= delay) {
        fn.call();
      } else {
        requests[id] = requestAnimationFrame(function () {
          return loop();
        });
      }
    };

    requests[id] = requestAnimationFrame(function () {
      return loop();
    });
    return id;
  };

  var clearTimer = function clearTimer(type, id) {
    if (!supportAnimationFrameTimers) {
      return window['clear' + type](id);
    }

    if (id) {
      cancelAnimationFrame(requests[id]);
      delete requests[id];
    }

    return id;
  };

  var cancelTimeout = function cancelTimeout(id) {
    return clearTimer('Timeout', id);
  };

  var debounce = function debounce() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
    var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var timer = null;
    return function () {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      cancelTimeout(timer);
      timer = requestTimeout(function () {
        timer = null;

        if (!immediate) {
          callback.apply(_this, args);
        }
      }, wait);

      if (immediate && !timer) {
        callback.apply(this, args.concat());
      }
    };
  };

  addEventListener(window, 'resize.body-scroll-lock', debounce(function () {
    if (status) {
      unlock();
      lock();
    }
  }, 500));
  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    registerScrollbarGapSelectors: registerScrollbarGapSelectors,
    isLocked: function isLocked() {
      return status;
    }
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
