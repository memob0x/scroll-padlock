import {
  describe, it, beforeEach, mock,
} from 'node:test';
import assert from 'node:assert';
import Padlock from '../../src/scroll-padlock.js';
import getJsdomWindow from '../utils/get-jsdom-window.js';

describe(Padlock.name, () => {
  let window;

  let document;

  let head;

  let body;

  beforeEach(() => {
    window = getJsdomWindow();

    ({ document } = window);

    ({ head, body } = document);
  });

  describe('construction', () => {
    it('should throw if incorrect first argument is passed to constructor', () => {
      assert.throws(
        () => new Padlock(null, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock([], undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock('', undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(0, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(1, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(NaN, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(Infinity, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(window, undefined, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document, undefined, window),

        TypeError,
      );
    });

    it('should create an instance when valid first argument is passed to constructor', () => {
      let instance;

      const a = () => {
        instance = new Padlock(undefined, undefined, window);
      };

      assert.doesNotThrow(a, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const b = () => {
        instance = new Padlock({}, undefined, window);
      };

      assert.doesNotThrow(b, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock(div, undefined, window);
      };

      assert.doesNotThrow(c, TypeError);

      assert.equal(instance.scrollingElement, div);

      assert.equal(instance.scrollEventElement, div);

      instance.destroy();

      const d = () => {
        instance = new Padlock({ ...window, client: window });
      };

      assert.doesNotThrow(d, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const e = () => {
        instance = new Padlock(document.documentElement, undefined, window);
      };

      assert.doesNotThrow(e, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const f = () => {
        instance = new Padlock(body, undefined, window);
      };

      assert.doesNotThrow(f, TypeError);

      assert.equal(instance.scrollingElement, body);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();
    });

    it('should throw if incorrect second argument is passed to constructor', () => {
      assert.throws(
        () => new Padlock(document.createElement('div'), null, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), {}, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), [], window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), '', window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), 0, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), 1, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), NaN, window),

        TypeError,
      );

      assert.throws(
        () => new Padlock(document.createElement('div'), Infinity, window),

        TypeError,
      );
    });

    it('should create an instance when valid second argument is passed to constructor', () => {
      let instance;

      const a = () => {
        instance = new Padlock(document.createElement('div'), undefined, window);
      };

      assert.doesNotThrow(a, TypeError);

      assert.equal(instance.cssClassName, 'scroll-padlock-locked');

      instance.destroy();

      const b = () => {
        instance = new Padlock(document.createElement('div'), '1', window);
      };

      assert.doesNotThrow(b, TypeError);

      assert.equal(instance.cssClassName, '1');

      instance.destroy();
    });

    it('should throw if first argument option object with invalid css class name property is passed', () => {
      assert.throws(
        () => new Padlock({ cssClassName: null, client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: [], client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: {}, client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: '', client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: 0, client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: 1, client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: NaN, client: window }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({ cssClassName: Infinity, client: window }),

        TypeError,
      );
    });

    it('should create an instance when first argument option object with valid css class name property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({ cssClassName: undefined, client: window });
      };

      assert.doesNotThrow(a, TypeError);

      assert.equal(instance.cssClassName, 'scroll-padlock-locked');

      instance.destroy();

      const b = () => {
        instance = new Padlock({ cssClassName: '1', client: window });
      };

      assert.doesNotThrow(b, TypeError);

      assert.equal(instance.cssClassName, '1');

      instance.destroy();
    });

    it('should throw if first argument option object with invalid scrolling element property is passed', () => {
      assert.throws(
        () => new Padlock({
          scrollingElement: null,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: [],

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: {},

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: '',

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: 0,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: 1,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: NaN,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: Infinity,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: window,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollingElement: document,

          client: window,
        }),

        TypeError,
      );
    });

    it('should create an instance when first argument option object with valid scrolling element property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({
          scrollingElement: undefined,

          client: window,
        });
      };

      assert.doesNotThrow(a, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock({
          scrollingElement: div,

          client: window,
        });
      };

      assert.doesNotThrow(c, TypeError);

      assert.equal(instance.scrollingElement, div);

      assert.equal(instance.scrollEventElement, div);

      instance.destroy();

      const e = () => {
        instance = new Padlock({
          scrollingElement: document.documentElement,

          client: window,
        });
      };

      assert.doesNotThrow(e, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const f = () => {
        instance = new Padlock({
          scrollingElement: body,

          client: window,
        });
      };

      assert.doesNotThrow(f, TypeError);

      assert.equal(instance.scrollingElement, body);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();
    });

    it('should throw if first argument option object with invalid scrolling event element property is passed', () => {
      assert.throws(
        () => new Padlock({
          scrollEventElement: null,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: [],

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: {},

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: '',

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: 0,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: 1,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: NaN,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: Infinity,

          client: window,
        }),

        TypeError,
      );

      assert.throws(
        () => new Padlock({
          scrollEventElement: document,

          client: window,
        }),

        TypeError,
      );
    });

    it('should create an instance when first argument option object with valid scrolling event element property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({
          scrollEventElement: undefined,

          client: window,
        });
      };

      assert.doesNotThrow(a, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock({
          scrollEventElement: div,

          client: window,
        });
      };

      assert.doesNotThrow(c, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, div);

      instance.destroy();

      const e = () => {
        instance = new Padlock({
          scrollEventElement: window,

          client: window,
        });
      };

      assert.doesNotThrow(e, TypeError);

      assert.equal(instance.scrollingElement, document.documentElement);

      assert.equal(instance.scrollEventElement, window);

      instance.destroy();
    });

    it('should throw if an element has already an instance attached to it', () => {
      // These instances are created on the same given element,
      // an error has to be thrown
      assert.throws(() => {
        const div = document.createElement('div');

        let instance = new Padlock(div, undefined, window);

        try {
          instance = new Padlock(div, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }, Error);

      // These instances are created on the same default element,
      // an error has to be thrown
      assert.throws(() => {
        let instance = new Padlock(undefined, undefined, window);

        try {
          instance = new Padlock(undefined, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }, Error);

      // These instances are created on different elements,
      // but it's still the global scroller element,
      // an error has to be thrown
      assert.throws(() => {
        let instance = new Padlock(body, undefined, window);

        try {
          instance = new Padlock(document.documentElement, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }, Error);
    });

    it('should create an instance when the element has not an instance attached to it', () => {
      // These instances are created on different elements,
      // no error is thrown here because they are two completely different instances
      assert.doesNotThrow(() => {
        const instanceA = new Padlock(document.createElement('div'), undefined, window);

        const instanceB = new Padlock(document.createElement('div'), undefined, window);

        instanceA.destroy();

        instanceB.destroy();
      }, Error);

      // These instances are created on the same element,
      // but no error is thrown because the first one is destroyed before the second
      assert.doesNotThrow(() => {
        const div = document.createElement('div');

        let instance = new Padlock(div, undefined, window);

        instance.destroy();

        instance = new Padlock(div, undefined, window);

        instance.destroy();
      }, Error);
    });
  });

  describe('dom effects', () => {
    it('should add a data attribute value to the scrolling element on instance creation', () => {
      const div = document.createElement('div');

      assert.equal(div.matches('[data-scroll-padlock]'), false);

      const instance = new Padlock(div, undefined, window);

      assert.equal(div.matches('[data-scroll-padlock]'), true);

      assert.match(div.getAttribute('data-scroll-padlock'), /^\d+$/);

      instance.destroy();
    });

    it('should remove a data attribute value to the scrolling element on instance destruction', () => {
      const div = document.createElement('div');

      const instance = new Padlock(div, undefined, window);

      assert.equal(div.matches('[data-scroll-padlock]'), true);

      instance.destroy();

      assert.equal(div.matches('[data-scroll-padlock]'), false);
    });

    it('should renew scrolling element data attribute value on instance creation', () => {
      const div = document.createElement('div');

      let instance = new Padlock(div, undefined, window);

      const firstInstanceAttrValue = div.getAttribute('data-scroll-padlock');

      instance.destroy();

      instance = new Padlock(div, undefined, window);

      const secondInstanceAttrValue = div.getAttribute('data-scroll-padlock');

      assert.ok(secondInstanceAttrValue);

      assert.notEqual(secondInstanceAttrValue, firstInstanceAttrValue);

      instance.destroy();
    });

    it('should append a style tag on instance creation', () => {
      let styles = head.querySelectorAll('style');

      assert.equal(styles.length, 0);

      const instance = new Padlock(document.createElement('div'), undefined, window);

      styles = head.querySelectorAll('style');

      assert.equal(styles.length, 1);

      instance.destroy();
    });

    it('should remove the appended style tag on instance destruction', () => {
      const instance = new Padlock(document.createElement('div'), undefined, window);

      const style = head.querySelector('style');

      assert.equal(head.contains(style), true);

      instance.destroy();

      assert.equal(head.contains(style), false);
    });

    it('should style the applied css selector attribute', () => {
      const div = document.createElement('div');

      const instance = new Padlock(div, undefined, window);

      const style = head.querySelector('style');

      const attrValue = div.getAttribute('data-scroll-padlock');

      assert.equal(style.sheet.cssRules.length, 1);

      assert.equal(style.sheet.cssRules[0].selectorText, `[data-scroll-padlock="${attrValue}"]`);

      instance.destroy();
    });
  });

  describe('objects computation', () => {
    it('should update instance "layout" object on "resize"', async () => {
      const div = document.createElement('div');

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 100,

        height: 200,
      }));

      const instance = new Padlock(div, undefined, window);

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 200,

        height: 300,
      }));

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      assert.equal(instance.layout.outerWidth, 200);

      assert.equal(instance.layout.outerHeight, 300);

      mock.method(div, 'getBoundingClientRect');

      div.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      assert.equal(instance.layout.outerWidth, 200);

      assert.equal(instance.layout.outerHeight, 300);

      assert.equal(div.getBoundingClientRect.mock.calls.length, 0);

      instance.destroy();
    });

    it('should update instance "scroll" object on "scroll"', async () => {
      const div = document.createElement('div');

      div.scrollTop = 1000;

      div.scrollLeft = 2000;

      const instance = new Padlock(div, undefined, window);

      assert.deepEqual(instance.scroll, {
        top: 1000,

        left: 2000,
      });

      div.scrollTop = 2000;

      div.scrollLeft = 3000;

      assert.deepEqual(instance.scroll, {
        top: 1000,

        left: 2000,
      });

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      assert.notEqual(instance.scroll.top, 2000);

      assert.notEqual(instance.scroll.left, 3000);

      div.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      assert.deepEqual(instance.scroll, {
        top: 2000,

        left: 3000,
      });

      instance.destroy();
    });

    it('should update instance "layout" object on "update" method call', () => {
      const div = document.createElement('div');

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 100,

        height: 200,
      }));

      const instance = new Padlock(div, undefined, window);

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 300,

        height: 400,
      }));

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      instance.update();

      assert.equal(instance.layout.outerWidth, 300);

      assert.equal(instance.layout.outerHeight, 400);

      instance.destroy();
    });

    it('should update instance "scroll" object on "update" method call', () => {
      const div = document.createElement('div');

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 100,

        height: 200,
      }));

      const instance = new Padlock(div, undefined, window);

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      mock.method(div, 'getBoundingClientRect', () => ({
        width: 300,

        height: 400,
      }));

      assert.equal(instance.layout.outerWidth, 100);

      assert.equal(instance.layout.outerHeight, 200);

      instance.update();

      assert.equal(instance.layout.outerWidth, 300);

      assert.equal(instance.layout.outerHeight, 400);

      instance.destroy();
    });
  });

  describe('scroll setter effects', () => {
    it('should trigger scroll when setting new values to "scroll" instance setter when in "unlocked" state', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      mock.method(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      instance.scroll = { top: 100, left: 200 };

      assert.equal(div.scrollTo.mock.calls.length, 1);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      let { calls } = div.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [200, 100]);

      instance.destroy();

      ({ calls } = div.scrollTo.mock);

      assert.equal(calls.length, 1);
    });

    it('should register scroll requests when in locked state, forbid it, and then fires it on scroll unlock', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      mock.method(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      assert.equal(div.scrollTo.mock.calls.length, 0);

      div.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const { calls } = div.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [300, 200]);

      instance.destroy();
    });

    it('should update "scroll" instance object on scroll when in "unlocked" state', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      mock.method(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      assert.equal(div.scrollTo.mock.calls.length, 0);

      instance.scroll = { top: 100, left: 200 };

      let { calls } = div.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [200, 100]);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      ({ calls } = div.scrollTo.mock);

      assert.equal(calls.length, 1);

      instance.scroll = { top: 300, left: 400 };

      assert.equal(calls.length, 1);

      instance.destroy();
    });

    it('should register scroll requests when in locked state, forbid it, and then fires it on scroll unlock updating scroll object', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      mock.method(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      assert.equal(div.scrollTo.mock.calls.length, 0);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      assert.equal(div.scrollTo.mock.calls.length, 0);

      instance.scroll = { top: 300, left: 400 };

      assert.equal(div.scrollTo.mock.calls.length, 0);

      div.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const { calls } = div.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [400, 300]);

      instance.destroy();
    });

    it('should not react to extraneous css class names being set', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      mock.method(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      assert.equal(div.scrollTo.mock.calls.length, 0);

      div.classList.add('another-css-class-name');

      await new Promise(window.setTimeout);

      assert.equal(div.scrollTo.mock.calls.length, 0);

      instance.scrollingElement.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const { calls } = instance.scrollEventElement.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [300, 200]);

      instance.destroy();
    });

    it('should not react to "update" method calls or "scroll" setter calls when locked state', async () => {
      const cssClassName = 'locked';

      const instance = new Padlock(undefined, cssClassName, window);

      mock.method(instance.scrollEventElement, 'scrollTo', () => {});

      instance.scrollingElement.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      assert.equal(instance.scrollEventElement.scrollTo.mock.calls.length, 0);

      instance.scroll = { top: 100, left: 200 };

      assert.equal(instance.scrollEventElement.scrollTo.mock.calls.length, 0);

      instance.update();

      assert.equal(instance.scrollEventElement.scrollTo.mock.calls.length, 0);

      instance.scrollingElement.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const { calls } = instance.scrollEventElement.scrollTo.mock;

      assert.equal(calls.length, 1);

      assert.deepEqual(calls[0].arguments, [200, 100]);

      instance.destroy();
    });
  });

  describe('destruction', () => {
    it('should be able to set instance members references to initial state on destroy', () => {
      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      assert.equal(instance.scrollingElement instanceof window.HTMLElement, true);

      assert.equal(instance.scrollEventElement, window);

      assert.equal(typeof instance.cssClassName, 'string');

      assert.ok(instance.cssClassName);

      assert.equal(typeof instance.scroll, 'object');

      assert.notEqual(instance.scroll, null);

      assert.equal(typeof instance.layout, 'object');

      assert.notEqual(instance.layout, null);

      instance.destroy();

      assert.equal(instance.scrollingElement, null);

      assert.equal(instance.scrollEventElement, null);

      assert.equal(instance.cssClassName, '');

      assert.equal(instance.scroll, null);

      assert.equal(instance.layout, null);

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      assert.equal(instance.scrollingElement, null);

      assert.equal(instance.scrollEventElement, null);

      assert.equal(instance.cssClassName, '');

      assert.equal(instance.scroll, null);

      assert.equal(instance.layout, null);

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      assert.equal(instance.scrollingElement, null);

      assert.equal(instance.scrollEventElement, null);

      assert.equal(instance.cssClassName, '');

      assert.equal(instance.scroll, null);

      assert.equal(instance.layout, null);

      instance.update();

      assert.equal(instance.scrollingElement, null);

      assert.equal(instance.scrollEventElement, null);

      assert.equal(instance.cssClassName, '');

      assert.equal(instance.scroll, null);

      assert.equal(instance.layout, null);

      instance.scroll = { top: 1, left: 2 };

      assert.equal(instance.scrollingElement, null);

      assert.equal(instance.scrollEventElement, null);

      assert.equal(instance.cssClassName, '');

      assert.equal(instance.scroll, null);

      assert.equal(instance.layout, null);
    });

    it('should stop observing to dom changes after destruction', () => {
      mock.method(window.MutationObserver.prototype, 'observe');

      mock.method(window.MutationObserver.prototype, 'disconnect');

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 0);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 0);

      const { scrollingElement } = instance;

      instance.destroy();

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 1);

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 1);

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 1);

      instance.update();

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 1);

      instance.scroll = { top: 1, left: 2 };

      assert.equal(window.MutationObserver.prototype.observe.mock.calls.length, 1);

      assert.equal(window.MutationObserver.prototype.disconnect.mock.calls.length, 1);
    });

    it('should stop listening to resize event after destruction', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      mock.method(scrollingElement, 'addEventListener');

      mock.method(scrollingElement, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.update();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.scroll = { top: 0, left: 1 };

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);
    });

    it('should stop listening to scroll event after destruction', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      mock.method(scrollingElement, 'addEventListener');

      mock.method(scrollingElement, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.update();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);

      instance.scroll = { top: 0, left: 2 };

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(scrollingElement.removeEventListener.mock.calls.length, 0);
    });
  });

  describe('listeners', () => {
    it('should be able to pause scroll event listener', () => {
      mock.method(window, 'addEventListener', () => {});

      mock.method(window, 'removeEventListener', () => {});

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.unlisten('scroll');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);
    });

    it('should be able to resume scroll event listener', () => {
      mock.method(window, 'addEventListener', () => {});

      mock.method(window, 'removeEventListener', () => {});

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.unlisten('scroll');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      instance.listen('scroll');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 2);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      instance.destroy();
    });

    it('should not be able to resume scroll event listener after destruction', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      instance.listen('scroll');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'scroll').length, 1);
    });

    it('should be able to pause resize event listener', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.unlisten('resize');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);
    });

    it('should be able to resume resize event listener', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.unlisten('resize');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      instance.listen('resize');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 2);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      instance.destroy();
    });

    it('should not be able to resume resize event listener after destruction', () => {
      mock.method(window, 'addEventListener');

      mock.method(window, 'removeEventListener');

      assert.equal(window.addEventListener.mock.calls.length, 0);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      const instance = new Padlock(undefined, undefined, window);

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.length, 0);

      instance.destroy();

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      instance.listen('resize');

      assert.equal(window.addEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);

      assert.equal(window.removeEventListener.mock.calls.filter((x) => x.arguments[0] === 'resize').length, 1);
    });
  });

  describe('resize handler wrapper', () => {
    it('should be able to wrap the resize handler through options parameter', async () => {
      let handler;

      const wrapper = mock.fn((originalHandler) => {
        handler = mock.fn(originalHandler);

        return handler;
      });

      const instance = new Padlock({
        resizeHandlerWrapper: wrapper,

        client: window,
      });

      assert.equal(wrapper.mock.calls.length, 1);
      assert.equal(handler.mock.calls.length, 0);

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      assert.equal(wrapper.mock.calls.length, 1);
      assert.equal(handler.mock.calls.length, 1);

      instance.destroy();
    });

    it('should be able to wrap the scroll handler through options parameter', async () => {
      let handler;

      const wrapper = mock.fn((originalHandler) => {
        handler = mock.fn(originalHandler);

        return handler;
      });

      const instance = new Padlock({
        scrollHandlerWrapper: wrapper,

        client: window,
      });

      assert.equal(wrapper.mock.calls.length, 1);
      assert.equal(handler.mock.calls.length, 0);

      window.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      assert.equal(wrapper.mock.calls.length, 1);
      assert.equal(handler.mock.calls.length, 1);

      instance.destroy();
    });
  });
});
