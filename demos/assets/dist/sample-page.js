"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('samplePage', factory) : factory();
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
      left: 0
    },
    bars: {
      x: 0,
      y: 0
    },
    html: {
      width: null,
      height: null
    },
    body: {
      width: null,
      height: null
    }
  };

  var setState = function setState() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scroll = {
      top: html.scrollTop,
      left: html.scrollLeft
    };
    var bars = {
      y: vw - html.clientWidth,
      x: vh - html.clientHeight
    };
    state = _objectSpread({}, state, {
      scroll: scroll,
      bars: bars,
      html: {
        width: vw + scroll.left,
        height: vh + scroll.top
      },
      body: {
        width: html.scrollWidth,
        height: html.scrollHeight,
        paddingRight: bars.y,
        paddingBottom: bars.x
      }
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

        if (!Array.isArray(entry) && entryType === 'object' && entry.selector && entry.selector !== 'body' && entry.selector !== 'html' && (!entry.property || supportedProperties.indexOf(entry.property) > -1)) {
          corrections.push(_objectSpread({}, defaultCorrection, entry));
        }
      }
    });
    return corrections;
  };

  var setSettings = function setSettings() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    settings = _objectSpread({}, settings, options);
    settings.corrections = setCorrections(settings.corrections);
  };

  var styler = function styler(id) {
    id = "body-scroll__".concat(id);
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
      $base.sheet.insertRule("\n            html,\n            body {\n                margin: 0".concat(important, ";\n                padding: 0").concat(important, ";\n                min-width: auto").concat(important, ";\n                min-height: auto").concat(important, ";\n                max-width: none").concat(important, ";\n                max-height: none").concat(important, ";\n            }\n        "), 0);
    }

    var $scrollbar = styler('bar');
    $scrollbar.disabled = !status;

    if ($scrollbar.sheet.cssRules.length) {
      $scrollbar.sheet.deleteRule(1);
      $scrollbar.sheet.deleteRule(0);
    }

    $scrollbar.sheet.insertRule("\n        html {\n            width: ".concat(state.html.width, "px").concat(important, ";\n            height: ").concat(state.html.height, "px").concat(important, ";\n        }\n    "), 0);
    $scrollbar.sheet.insertRule("\n        body{\n            width: ".concat(state.body.width, "px").concat(important, ";\n            height: ").concat(state.body.height, "px").concat(important, ";\n        }\n    "), 1);
    var $lock = styler('lock');
    $lock.disabled = !status;

    if (isSafariIOS) {
      if (!$lock.sheet.cssRules.length) {
        $lock.sheet.insertRule("\n                html,\n                body {\n                    overflow: visible".concat(important, ";\n                }\n            "), 0);
        $lock.sheet.insertRule("\n                html {\n                    position: fixed".concat(important, ";\n                }\n            "), 1);
      } else {
        $lock.sheet.deleteRule(2);
      }

      $lock.sheet.insertRule("\n            html {\n                top: ".concat(state.scroll.top * -1, "px").concat(important, ";\n                left: ").concat(state.scroll.left * -1, "px").concat(important, ";\n            }\n        "), 2);
    } else {
      if (!$lock.sheet.cssRules.length) {
        $lock.sheet.insertRule("\n                body {\n                    overflow: hidden".concat(important, ";\n                }\n            "), 0);
      }
    }

    var corrections = settings.corrections;
    var $corrections = styler('corrections');

    for (var _i = $corrections.sheet.cssRules.length - 1; _i >= 0; _i--) {
      $corrections.sheet.deleteRule(_i);
    }

    var i = 0;
    corrections.forEach(function (entry) {
      var gap = state.bars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

      if (gap > 0) {
        var factor = 1;

        if (!status) {
          factor = entry.inverted ? -1 : 0;
        }

        $corrections.sheet.insertRule("\n                ".concat(entry.selector, " {\n                    ").concat(entry.property, ": ").concat(gap * factor, "px").concat(settings.important ? '!important' : '', ";\n                }\n            "), i);
        i++;
      }
    });
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
      html.scrollTop = state.scroll.top;
      html.scrollLeft = state.scroll.left;
      window.dispatchEvent(new BodyScrollEvent('bodyScrollUnlock'));
    }
  };

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      return updateStyle();
    }, 500);
  });
  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: function toggle() {
      return !status ? lock() : unlock();
    },
    isLocked: function isLocked() {
      return status;
    },
    setOptions: function setOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      setSettings(options);
      updateStyle();
    }
  };

  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('append')) {
        return;
      }

      Object.defineProperty(item, 'append', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function append() {
          var argArr = Array.prototype.slice.call(arguments),
              docFrag = document.createDocumentFragment();
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          this.appendChild(docFrag);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

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

  bodyScroll.setOptions({
    corrections: [{
      selector: '#nav',
      property: 'right'
    }, '#console']
  });
  var html$1 = document.documentElement;
  document.querySelector('.toggle-scroll-lock').addEventListener('click', function () {
    return bodyScroll.toggle();
  });
  document.querySelector('button.toggle-custom-scrollbar').addEventListener('click', function () {
    log('toggling custom scrollbars');
    html$1.classList.toggle('custom-scrollbar');
  });
  document.querySelector('button.toggle-horizontal-orientation').addEventListener('click', function () {
    log('toggling page orientation');
    html$1.classList.toggle('horizontal');
  });
  window.addEventListener('bodyScrollLock', function () {
    return log('body scroll locked');
  });
  window.addEventListener('bodyScrollUnlock', function () {
    return log('body scroll unlocked');
  });
  window.bodyScroll = bodyScroll;
});
//# sourceMappingURL=sample-page.js.map
