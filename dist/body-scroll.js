"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : global.bodyScroll = factory();
})(void 0, function () {
  'use strict';

  var s4 = function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  var uniqueID = function uniqueID() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  var stringContains = function stringContains(heystack, needle) {
    return String.prototype.includes ? heystack.includes(needle) : heystack.indexOf(needle, 0) !== -1;
  };

  var html = document.documentElement;
  var body = document.body || document.getElementsByTagName('body')[0];
  var head = document.head || document.getElementsByTagName('head')[0];
  var userAgent = navigator.userAgent.toLowerCase();
  var vendorsPrefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];

  var MutationObserver = function () {
    for (var i = 0; i < vendorsPrefixes.length; i++) {
      if (vendorsPrefixes[i] + 'MutationObserver' in window) {
        return window[vendorsPrefixes[i] + 'MutationObserver'];
      }
    }

    return false;
  }();

  var _requestAnimationFrame = window.requestAnimationFrame;
  var _cancelAnimationFrame = window.cancelAnimationFrame;
  ['ms', 'moz', 'webkit', 'o'].forEach(function (vendor) {
    _requestAnimationFrame = _requestAnimationFrame || window[vendor + 'RequestAnimationFrame'];
    _cancelAnimationFrame = _cancelAnimationFrame || window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
  });
  var requestAnimationFrame = _requestAnimationFrame;
  var cancelAnimationFrame = _cancelAnimationFrame;

  var transitionEndEventName = function () {
    var el = document.createElement('div');
    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      msTransition: 'MSTransitionEnd',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }

    return false;
  }();

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

  var status = false;

  var setStatus = function setStatus(bool) {
    return status = bool;
  };

  var getStatus = function getStatus() {
    return status;
  };

  var scrollTo = {
    top: 0,
    left: 0,
    behavior: 'auto'
  };

  var setScrollTo = function setScrollTo() {
    scrollTo = {
      top: body.scrollTop || html.scrollTop,
      left: body.scrollLeft || html.scrollLeft
    };
  };

  var getScrollTo = function getScrollTo() {
    return scrollTo;
  };

  var namespacesKey = 'namespaces_' + uniqueID();

  var addEventListener = function addEventListener(element, event, handler, options) {
    if (!element[namespacesKey]) {
      element[namespacesKey] = {};
    }

    element[namespacesKey][event] = handler;
    element.addEventListener(event.split('.')[0], handler, options || false);
  };

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

  var getWindowWidth = function getWindowWidth() {
    return window.innerWidth || html.clientWidth || body.clientWidth;
  };

  var getWindowHeight = function getWindowHeight() {
    return window.innerHeight || html.clientHeight || body.clientHeight;
  };

  var lockStatus = false;
  var scrollTo$1 = {
    top: 0,
    left: 0,
    behavior: 'auto'
  };

  var unlockBodyScroll = function unlockBodyScroll() {
    if (lockStatus) {
      head.querySelector('#body-scroll-lock').remove();
      window.scrollTo(scrollTo$1);
      lockStatus = false;
    }
  };

  var scrollSizeCorrections = [];

  var lockBodyScroll = function lockBodyScroll() {
    if (!lockStatus) {
      scrollTo$1.top = body.scrollTop || html.scrollTop;
      scrollTo$1.left = body.scrollLeft || html.scrollLeft;
      var w = body.clientWidth - (body.clientWidth - body.offsetWidth);
      var h = body.clientHeight - (body.clientHeight - body.offsetHeight);
      var style = document.createElement('style');
      style.type = 'text/css';
      style.id = 'body-scroll-lock';
      var css = "\n        html,\n        body {\n            overflow: hidden!important;\n        }\n        body {\n            position: fixed!important;\n            top: 0!important;\n            left: 0!important;\n            right: auto!important;\n            bottom: auto!important;\n            margin: -".concat(scrollTo$1.top, "px 0 0 -").concat(scrollTo$1.left, "px!important;\n            min-width: ").concat(w, "px!important;\n            width: ").concat(w, "px!important;\n            max-width: ").concat(w, "px!important;\n            min-height: ").concat(h, "px!important;\n            height: ").concat(h, "px!important;\n            max-height: ").concat(h, "px!important;\n        }");

      if (scrollSizeCorrections.length) {
        var vw = getWindowWidth();
        var vh = getWindowHeight();
        var scroll = {
          y: vw > w ? vw - w : 0,
          x: vh > h ? vh - h : 0
        };
        scrollSizeCorrections.forEach(function (x) {
          return css += "".concat(x.selector, " { ").concat(x.property, ": ").concat(scroll[stringContains(x.property, 'right') ? 'y' : 'x'], "px!important; }");
        });
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
      lockStatus = true;
    }
  };

  addEventListener(window, 'resize.toolbox', debounce(function () {
    if (lockStatus) {
      unlockBodyScroll();
      lockBodyScroll();
    }
  }, 500));
  var scrollbarCompensations = [];

  var registerSelectors = function registerSelectors() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return scrollbarCompensations = collection.filter(function (x) {
      return x.property === 'margin-right' || x.property === 'margin-bottom' || x.property === 'padding-right' || x.property === 'padding-bottom';
    });
  };

  var registerSelectors$1 = Object.freeze({
    get scrollbarCompensations() {
      return scrollbarCompensations;
    },

    registerSelectors: registerSelectors
  });

  var lock = function lock() {
    if (!getStatus()) {
      setScrollTo();

      var _scrollTo = getScrollTo();

      var w = body.clientWidth - (body.clientWidth - body.offsetWidth);
      var h = body.clientHeight - (body.clientHeight - body.offsetHeight);
      var style = document.createElement('style');
      style.type = 'text/css';
      style.id = 'body-scroll-lock';
      var css = "\n        html,\n        body {\n            overflow: hidden!important;\n        }\n        body {\n            position: fixed!important;\n            top: 0!important;\n            left: 0!important;\n            right: auto!important;\n            bottom: auto!important;\n            margin: -".concat(_scrollTo.top, "px 0 0 -").concat(_scrollTo.left, "px!important;\n            min-width: ").concat(w, "px!important;\n            width: ").concat(w, "px!important;\n            max-width: ").concat(w, "px!important;\n            min-height: ").concat(h, "px!important;\n            height: ").concat(h, "px!important;\n            max-height: ").concat(h, "px!important;\n        }");

      if (scrollbarCompensations.length) {
        var vw = getWindowWidth();
        var vh = getWindowHeight();
        var scroll = {
          y: vw > w ? vw - w : 0,
          x: vh > h ? vh - h : 0
        };
        scrollbarCompensations.forEach(function (x) {
          return css += "".concat(x.selector, " { ").concat(x.property, ": ").concat(scroll[stringContains(x.property, 'right') ? 'y' : 'x'], "px!important; }");
        });
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
      setStatus(true);
    }
  };

  var lock$1 = Object.freeze({
    lock: lock
  });

  var unlock = function unlock() {
    if (getStatus()) {
      head.querySelector('#body-scroll-lock').remove();
      window.scrollTo(getScrollTo());
      setStatus(false);
    }
  };

  var unlock$1 = Object.freeze({
    unlock: unlock
  });
  var isLocked = getStatus;
  var isLocked$1 = Object.freeze({
    isLocked: isLocked
  });
  addEventListener(window, 'resize.body-scroll-lock', debounce(function () {
    if (getStatus()) {
      unlock();
      lock();
    }
  }, 500));

  var bodyScroll = _objectSpread({}, lock$1, unlock$1, isLocked$1, registerSelectors$1);

  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
