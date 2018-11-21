"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('samplePage', factory) : factory();
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

  var scrollbarGapSelectors = [];
  var defaults = {
    selector: null,
    property: 'margin-right'
  };
  var supportedProperty = ['margin-right', 'margin-bottom', 'padding-right', 'padding-bottom', 'right', 'bottom'];

  var registerScrollbarGapSelectors = function registerScrollbarGapSelectors() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    scrollbarGapSelectors = [];

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

        if (!Array.isArray(entry) && entryType === 'object' && entry.selector && (!entry.property || supportedProperty.indexOf(entry.property) > -1)) {
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

      var css = "\n        html {\n            position: fixed!important;\n            top: ".concat(scrollState$$1.top * -1, "px!important;\n            left: ").concat(scrollState$$1.left * -1, "px!important;\n            right: auto!important;\n            bottom: auto!important;\n        }\n        html,\n        body {\n            margin: 0!important;\n            padding: 0!important;\n            min-width: ").concat(bw, "px!important;\n            width: ").concat(bw, "px!important;\n            max-width: ").concat(bw, "px!important;\n            min-height: ").concat(bh, "px!important;\n            height: ").concat(bh, "px!important;\n            max-height: ").concat(bh, "px!important;\n            overflow: visible!important;\n        }");

      if (hasScrollbarsGapSelectors) {
        scrollbarGapSelectors.forEach(function (entry) {
          var gap = scrollbars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

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
    registerScrollbarGapSelectors: registerScrollbarGapSelectors,
    isLocked: function isLocked() {
      return status;
    }
  };
  var logEl = document.querySelector('#console');

  var log = function log() {
    var _console;

    for (var _len = arguments.length, message = new Array(_len), _key = 0; _key < _len; _key++) {
      message[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, message);

    if (!logEl.hasChildNodes()) {
      var ol = document.createElement('ol');
      logEl.append(ol);
    }

    var list = logEl.querySelector('ol');
    var li = document.createElement('li');
    li.innerHTML = message;
    list.append(li);
    logEl.scrollTop = list.offsetHeight;
  };

  bodyScroll.registerScrollbarGapSelectors([{
    selector: '#nav',
    property: 'right'
  }, '#console']);
  document.querySelector('.toggle-body-scroll-lock').addEventListener('click', function () {
    if (bodyScroll.isLocked()) {
      log('unlocking');
      bodyScroll.unlock();
    } else {
      log('locking');
      bodyScroll.lock();
    }
  });
  document.querySelector('button.toggle-body-custom-scrollbar').addEventListener('click', function () {
    log('toggling custom scrollbars');
    document.documentElement.classList.toggle('custom-scrollbar');
  });
});
//# sourceMappingURL=sample-page.js.map
