"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('bodyScroll', factory) : (global = global || self, global.bodyScroll = factory());
})(void 0, function () {
  'use strict';

  var $head = document.head;
  var $stylerBase = document.createElement('style');
  var $stylerResizable = document.createElement('style');
  var isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
  var isMultiTouchMacAkaIOS13 = window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  var isAppleTouchDevice = isLegacyIOS || isMultiTouchMacAkaIOS13;
  var IMPORTANT_STATEMENT = '!important';
  var status = false;
  var scroll = {
    x: 0,
    y: 0
  };
  var scrollbarWidth = 0;
  var clientWidth = 0;

  var getBaseRules = function getBaseRules() {
    var output = '';
    output = ' html,';
    output += 'body {';
    output += 'height: auto' + IMPORTANT_STATEMENT + ';';
    output += 'margin: 0' + IMPORTANT_STATEMENT + ';';
    output += 'padding: 0 ' + scrollbarWidth + 'px 0 0' + IMPORTANT_STATEMENT + ';';
    output += '}';

    if (isAppleTouchDevice) {
      output += 'html {';
      output += 'position: fixed' + IMPORTANT_STATEMENT + ';';
      output += 'top: ' + -1 * scroll.y + 'px' + IMPORTANT_STATEMENT + ';';
      output += 'left: ' + -1 * scroll.x + 'px' + IMPORTANT_STATEMENT + ';';
      output += 'overflow: visible' + IMPORTANT_STATEMENT + ';';
      output += '}';
    } else {
      output += 'body {';
      output += 'overflow: hidden' + IMPORTANT_STATEMENT + ';';
      output += '}';
    }

    return output;
  };

  var getResizableRules = function getResizableRules() {
    var output = '';
    output = ' html,';
    output += 'body {';
    output += 'width: ' + clientWidth + 'px' + IMPORTANT_STATEMENT + ';';
    output += '}';
    return output;
  };

  var printRules = function printRules($actor, rules) {
    $actor.innerHTML = rules;

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

  var isLocked = function isLocked() {
    return status;
  };

  var lock = function lock() {
    if (status) {
      return false;
    }

    status = true;
    scroll = {
      x: window.scrollX,
      y: window.scrollY
    };
    var _clientWidth = document.documentElement.clientWidth;
    document.body.style.width = document.body.clientWidth + 'px';
    document.documentElement.style.overflow = 'hidden';
    clientWidth = document.documentElement.clientWidth;
    scrollbarWidth = clientWidth - _clientWidth;
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    printBaseRules();
    printResizableRules();

    if (isAppleTouchDevice) {
      window.scroll(0, 0);
    }

    window.dispatchEvent(new CustomEvent('bodyScrollLock', {
      clientWidth: clientWidth,
      scrollbarWidth: scrollbarWidth
    }));
    return true;
  };

  var unlock = function unlock() {
    if (!status) {
      return false;
    }

    status = false;
    $stylerBase.innerHTML = '';
    $stylerResizable.innerHTML = '';

    if (isAppleTouchDevice) {
      window.scroll(scroll.x, scroll.y);
    }

    window.dispatchEvent(new CustomEvent('bodyScrollUnlock', {
      clientWidth: clientWidth,
      scrollbarWidth: scrollbarWidth
    }));
    return true;
  };

  var resize = function resize() {
    if (!status) {
      return;
    }

    clientWidth = document.documentElement.clientWidth;
    printResizableRules();
  };

  document.addEventListener('resize', resize);
  var bodyScroll = {
    lock: lock,
    unlock: unlock,
    toggle: function toggle() {
      return !isLocked() ? lock() : unlock();
    },
    isLocked: isLocked,
    update: resize
  };
  return bodyScroll;
});
//# sourceMappingURL=body-scroll.js.map
