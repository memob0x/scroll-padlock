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
      width: 0,
      height: 0
    },
    body: {
      width: 0,
      height: 0
    },
    scrollbars: {
      y: 0,
      x: 0
    }
  };

  var setState = function setState() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var scroll = {
      top: html.scrollTop,
      left: html.scrollLeft
    };
    var scrollbars = {
      y: vw > width ? vw - width : 0,
      x: vh > height ? vh - height : 0
    };
    state = _objectSpread({}, state, {
      scroll: scroll,
      html: {
        width: vw + scroll.left - scrollbars.y,
        height: vh + scroll.top - scrollbars.x
      },
      body: {
        width: html.scrollWidth,
        height: html.scrollHeight
      },
      scrollbars: scrollbars
    });
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

  var stylerID = 'body-scroll';
  var styler = document.createElement('style');
  styler.type = 'text/css';
  styler.id = stylerID;

  var setStyle = function setStyle() {
    var css = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (!css) {
      styler.remove();
      return;
    }

    if (styler.styleSheet) {
      styler.styleSheet.cssText = css;
    } else {
      styler.innerHTML = '';
      styler.appendChild(document.createTextNode(css));
    }

    if (!head.querySelector("style#".concat(stylerID))) {
      head.appendChild(styler);
    }
  };

  var getStyle = function getStyle() {
    var imp = settings.important ? '!important' : '';
    var css = '';

    if (!status) {
      css += "html,\n            body {\n            margin: 0".concat(imp, ";\n            padding: 0").concat(imp, ";\n            min-width: auto").concat(imp, ";\n            min-height: auto").concat(imp, ";\n            max-width: none").concat(imp, ";\n            max-height: none").concat(imp, ";\n        }\n\n        html {\n            width: ").concat(state.html.width, "px").concat(imp, ";\n            height: ").concat(state.html.height, "px").concat(imp, ";\n        }\n\n        html {\n            position: fixed").concat(imp, ";\n            top: ").concat(state.scroll.top * -1, "px").concat(imp, ";\n            left: ").concat(state.scroll.left * -1, "px").concat(imp, ";\n        }\n\n        html,\n            body {\n            overflow: visible").concat(imp, ";\n        }\n\n        body{\n            width: ").concat(state.body.width, "px").concat(imp, ";\n            height: ").concat(state.body.height, "px").concat(imp, ";\n        }");
    }

    var corrections = settings.corrections;

    if (corrections.length) {
      corrections.forEach(function (entry) {
        var gap = state.scrollbars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

        if (gap > 0) {
          var factor = 1;

          if (status) {
            factor = entry.inverted ? -1 : 0;
          }

          css += "\n                ".concat(entry.selector, " {\n                    ").concat(entry.property, ": ").concat(gap * factor, "px").concat(settings.important ? '!important' : '', ";\n                }");
        }
      });
    }

    return css;
  };

  var updateStyle = function updateStyle() {
    return setStyle(getStyle());
  };

  var lock = function lock() {
    if (!status) {
      setState();
      updateStyle();
      setStatus(true);
      window.dispatchEvent(new BodyScrollEvent('bodyScrollLock'));
    }
  };

  var unlock = function unlock() {
    if (status) {
      updateStyle();
      window.scrollTo(state.scroll);
      setStatus(false);
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
