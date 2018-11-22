"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define('samplePage', factory) : factory();
})(void 0, function () {
  'use strict';

  var status = false;

  var setStatus = function setStatus() {
    var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return status = bool;
  };

  var settings = {
    incubator: false
  };

  var setOptions = function setOptions() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!status) {
      settings = _objectSpread({}, settings, options);
    }
  };

  var html = document.documentElement;
  var body = document.body || document.getElementsByTagName('body')[0];
  var head = document.head || document.getElementsByTagName('head')[0];
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

    if (!head.querySelector('style#' + stylerID)) {
      head.appendChild(styler);
    }
  };

  var incubator = function (_incubator) {
    var s4 = function s4() {
      return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    };

    _incubator.id = "body-scroll-lock-".concat(s4()).concat(s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4(), "-").concat(s4()).concat(s4()).concat(s4());
    return _incubator;
  }(document.createElement('div'));

  var state = {
    scroll: {
      top: 0,
      left: 0,
      behavior: 'auto'
    },
    dimensions: {
      width: 0,
      height: 0
    },
    scrollbar: {
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

  var corrections = [];
  var defaults = {
    selector: null,
    property: 'margin-right',
    inverted: false
  };
  var supportedProperty = ['margin-right', 'margin-bottom', 'padding-right', 'padding-bottom', 'right', 'bottom'];

  var setCorrections = function setCorrections() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    corrections = [];

    var collectionType = _typeof(collection);

    if (collectionType === 'string' || !Array.isArray(collection) && collectionType === 'object') {
      collection = [collection];
    }

    collection.forEach(function (entry) {
      if (entry) {
        var entryType = _typeof(entry);

        if (entryType === 'string') {
          corrections.push(_objectSpread({}, defaults, {
            selector: entry
          }));
        }

        if (!Array.isArray(entry) && entryType === 'object' && entry.selector && (!entry.property || supportedProperty.indexOf(entry.property) > -1)) {
          corrections.push(_objectSpread({}, defaults, entry));
        }
      }
    });
  };

  var getCorrections = function getCorrections() {
    var inverted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var css = '';

    if (corrections.length) {
      corrections.forEach(function (entry) {
        var gap = state.scrollbars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

        if (gap > 0) {
          var factor = 1;

          if (inverted) {
            factor = entry.inverted ? -1 : 0;
          }

          css += "\n                ".concat(entry.selector, " {\n                    ").concat(entry.property, ": ").concat(gap * factor, "px!important;\n                }");
        }
      });
    }

    return css;
  };

  var lock = function lock() {
    if (!status) {
      setState();

      if (settings.incubator) {
        incubator.innerHTML = '';

        while (body.firstChild) {
          incubator.append(body.firstChild);
        }

        body.append(incubator);
      }

      setStyle("\n            html,\n            body\n            ".concat(settings.incubator ? ', #' + incubator.id : '', " {\n                margin: 0!important;\n                padding: 0!important;\n                min-width: auto!important;\n                min-height: auto!important;\n                max-width: none!important;\n                max-height: none!important;\n            }\n\n            html\n            ").concat(settings.incubator ? ', body' : '', " {\n                width: ").concat(state.html.width, "px!important;\n                height: ").concat(state.html.height, "px!important;\n            }\n\n            html {\n                position: fixed!important;\n                top: ").concat(state.scroll.top * -1, "px!important;\n                left: ").concat(state.scroll.left * -1, "px!important;\n            }\n\n            html,\n            body {              \n                overflow: visible!important;\n            }\n\n            ").concat(settings.incubator ? '#' + incubator.id : 'body', " {\n                width: ").concat(state.body.width, "px!important;\n                height: ").concat(state.body.height, "px!important;\n            }\n            \n            ").concat(getCorrections()));
      setStatus(true);
    }
  };

  var unlock = function unlock() {
    if (status) {
      setStyle(getCorrections(true));

      if (settings.incubator) {
        while (incubator.firstChild) {
          incubator.before(incubator.firstChild);
        }

        incubator.remove();
      }

      window.scrollTo(state.scroll);
      setStatus(false);
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
    setCorrections: setCorrections,
    isLocked: function isLocked() {
      return status;
    },
    setOptions: setOptions
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

  bodyScroll.setCorrections([{
    selector: '#nav',
    property: 'right'
  }, '#console']);
  document.querySelector('.toggle-body-scroll-lock').addEventListener('click', function () {
    return bodyScroll.toggle();
  });
  document.querySelector('button.toggle-body-custom-scrollbar').addEventListener('click', function () {
    log('toggling custom scrollbars');
    document.documentElement.classList.toggle('custom-scrollbar');
  });
  document.querySelector('button.toggle-body-min-width').addEventListener('click', function () {
    log('toggling horizontal scrollbar');
    document.documentElement.classList.toggle('min-width');
  });
  var incubator$1 = false;
  bodyScroll.setOptions({
    incubator: incubator$1
  });
  document.querySelector('button.toggle-incubator').addEventListener('click', function () {
    log('toggling incubator mode');

    if (!bodyScroll.isLocked()) {
      incubator$1 = !incubator$1;
      bodyScroll.setOptions({
        incubator: incubator$1
      });
    }
  });
});
//# sourceMappingURL=sample-page.js.map
