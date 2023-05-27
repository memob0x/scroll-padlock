import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import { expect } from 'chai';
import sinon from 'sinon';

import Padlock from '../../src/padlock.js';

import getJsdomWindow from '../utils/get-jsdom-window.js';

describe('src/padlock', () => {
  let window;

  let document;

  let head;

  let body;

  const sinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    window = getJsdomWindow();

    ({ document } = window);

    ({ head, body } = document);
  });

  afterEach(() => {
    sinonSandbox.restore();
  });

  describe('construction', () => {
    it('should throw if incorrect first argument is passed to constructor', () => {
      expect(
        () => new Padlock(null, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock([], undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock('', undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(0, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(1, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(NaN, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(Infinity, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(window, undefined, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document, undefined, window),
      ).to.throw(TypeError);
    });

    it('should create an instance when valid first argument is passed to constructor', () => {
      let instance;

      const a = () => {
        instance = new Padlock(undefined, undefined, window);
      };

      expect(a).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const b = () => {
        instance = new Padlock({}, undefined, window);
      };

      expect(b).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock(div, undefined, window);
      };

      expect(c).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(div);

      expect(instance.scrollEventElement).to.equal(div);

      instance.destroy();

      const d = () => {
        instance = new Padlock({ ...window, client: window });
      };

      expect(d).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const e = () => {
        instance = new Padlock(document.documentElement, undefined, window);
      };

      expect(e).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const f = () => {
        instance = new Padlock(body, undefined, window);
      };

      expect(f).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(body);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();
    });

    it('should throw if incorrect second argument is passed to constructor', () => {
      expect(
        () => new Padlock(document.createElement('div'), null, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), {}, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), [], window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), '', window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), 0, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), 1, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), NaN, window),
      ).to.throw(TypeError);

      expect(
        () => new Padlock(document.createElement('div'), Infinity, window),
      ).to.throw(TypeError);
    });

    it('should create an instance when valid second argument is passed to constructor', () => {
      let instance;

      const a = () => {
        instance = new Padlock(document.createElement('div'), undefined, window);
      };

      expect(a).to.not.throw(TypeError);

      expect(instance.cssClassName).to.equal('scroll-padlock-locked');

      instance.destroy();

      const b = () => {
        instance = new Padlock(document.createElement('div'), '1', window);
      };

      expect(b).to.not.throw(TypeError);

      expect(instance.cssClassName).to.equal('1');

      instance.destroy();
    });

    it('should throw if first argument option object with invalid css class name property is passed', () => {
      expect(
        () => new Padlock({ cssClassName: null, client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: [], client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: {}, client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: '', client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: 0, client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: 1, client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: NaN, client: window }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({ cssClassName: Infinity, client: window }),
      ).to.throw(TypeError);
    });

    it('should create an instance when first argument option object with valid css class name property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({ cssClassName: undefined, client: window });
      };

      expect(a).to.not.throw(TypeError);

      expect(instance.cssClassName).to.equal('scroll-padlock-locked');

      instance.destroy();

      const b = () => {
        instance = new Padlock({ cssClassName: '1', client: window });
      };

      expect(b).to.not.throw(TypeError);

      expect(instance.cssClassName).to.equal('1');

      instance.destroy();
    });

    it('should throw if first argument option object with invalid scrolling element property is passed', () => {
      expect(
        () => new Padlock({
          scrollingElement: null,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: [],

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: {},

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: '',

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: 0,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: 1,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: NaN,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: Infinity,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: window,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollingElement: document,

          client: window,
        }),
      ).to.throw(TypeError);
    });

    it('should create an instance when first argument option object with valid scrolling element property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({
          scrollingElement: undefined,

          client: window,
        });
      };

      expect(a).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock({
          scrollingElement: div,

          client: window,
        });
      };

      expect(c).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(div);

      expect(instance.scrollEventElement).to.equal(div);

      instance.destroy();

      const e = () => {
        instance = new Padlock({
          scrollingElement: document.documentElement,

          client: window,
        });
      };

      expect(e).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const f = () => {
        instance = new Padlock({
          scrollingElement: body,

          client: window,
        });
      };

      expect(f).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(body);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();
    });

    it('should throw if first argument option object with invalid scrolling event element property is passed', () => {
      expect(
        () => new Padlock({
          scrollEventElement: null,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: [],

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: {},

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: '',

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: 0,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: 1,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: NaN,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: Infinity,

          client: window,
        }),
      ).to.throw(TypeError);

      expect(
        () => new Padlock({
          scrollEventElement: document,

          client: window,
        }),
      ).to.throw(TypeError);
    });

    it('should create an instance when first argument option object with valid scrolling event element property is passed', () => {
      let instance;

      const a = () => {
        instance = new Padlock({
          scrollEventElement: undefined,

          client: window,
        });
      };

      expect(a).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();

      const div = document.createElement('div');

      const c = () => {
        instance = new Padlock({
          scrollEventElement: div,

          client: window,
        });
      };

      expect(c).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(div);

      instance.destroy();

      const e = () => {
        instance = new Padlock({
          scrollEventElement: window,

          client: window,
        });
      };

      expect(e).to.not.throw(TypeError);

      expect(instance.scrollingElement).to.equal(document.documentElement);

      expect(instance.scrollEventElement).to.equal(window);

      instance.destroy();
    });

    it('should throw if an element has already an instance attached to it', () => {
      // These instances are created on the same given element,
      // an error has to be thrown
      expect(() => {
        const div = document.createElement('div');

        let instance = new Padlock(div, undefined, window);

        try {
          instance = new Padlock(div, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }).to.throw(Error);

      // These instances are created on the same default element,
      // an error has to be thrown
      expect(() => {
        let instance = new Padlock(undefined, undefined, window);

        try {
          instance = new Padlock(undefined, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }).to.throw(Error);

      // These instances are created on different elements,
      // but it's still the global scroller element,
      // an error has to be thrown
      expect(() => {
        let instance = new Padlock(body, undefined, window);

        try {
          instance = new Padlock(document.documentElement, undefined, window);
        } catch (e) {
          instance.destroy();

          throw e;
        }
      }).to.throw(Error);
    });

    it('should create an instance when the element has not an instance attached to it', () => {
      // These instances are created on different elements,
      // no error is thrown here because they are two completely different instances
      expect(() => {
        const instanceA = new Padlock(document.createElement('div'), undefined, window);

        const instanceB = new Padlock(document.createElement('div'), undefined, window);

        instanceA.destroy();

        instanceB.destroy();
      }).to.not.throw(Error);

      // These instances are created on the same element,
      // but no error is thrown because the first one is destroyed before the second
      expect(() => {
        const div = document.createElement('div');

        let instance = new Padlock(div, undefined, window);

        instance.destroy();

        instance = new Padlock(div, undefined, window);

        instance.destroy();
      }).to.not.throw(Error);
    });
  });

  describe('dom effects', () => {
    it('should add a data attribute value to the scrolling element on instance creation', () => {
      const div = document.createElement('div');

      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      const instance = new Padlock(div, undefined, window);

      expect(div.matches('[data-scroll-padlock]')).to.be.true;

      expect(div.getAttribute('data-scroll-padlock')).to.be.a('string').which.matches(/^\d+$/);

      instance.destroy();
    });

    it('should remove a data attribute value to the scrolling element on instance destruction', () => {
      const div = document.createElement('div');

      const instance = new Padlock(div, undefined, window);

      expect(div.matches('[data-scroll-padlock]')).to.be.true;

      instance.destroy();

      expect(div.matches('[data-scroll-padlock]')).to.be.false;
    });

    it('should renew scrolling element data attribute value on instance creation', () => {
      const div = document.createElement('div');

      let instance = new Padlock(div, undefined, window);

      const firstInstanceAttrValue = div.getAttribute('data-scroll-padlock');

      instance.destroy();

      instance = new Padlock(div, undefined, window);

      const secondInstanceAttrValue = div.getAttribute('data-scroll-padlock');

      expect(!!secondInstanceAttrValue).to.be.true;

      expect(secondInstanceAttrValue).not.to.equals(firstInstanceAttrValue);

      instance.destroy();
    });

    it('should append a style tag on instance creation', () => {
      let styles = head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(0);

      const instance = new Padlock(document.createElement('div'), undefined, window);

      styles = head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(1);

      instance.destroy();
    });

    it('should remove the appended style tag on instance destruction', () => {
      const instance = new Padlock(document.createElement('div'), undefined, window);

      const style = head.querySelector('style');

      expect(head.contains(style)).to.be.true;

      instance.destroy();

      expect(head.contains(style)).to.be.false;
    });

    it('should style the applied css selector attribute', () => {
      const div = document.createElement('div');

      const instance = new Padlock(div, undefined, window);

      const style = head.querySelector('style');

      const attrValue = div.getAttribute('data-scroll-padlock');

      expect(style.sheet.cssRules).to.have.lengthOf(1);

      expect(style.sheet.cssRules[0].selectorText).equals(`[data-scroll-padlock="${attrValue}"]`);

      instance.destroy();
    });
  });

  describe('objects computation', () => {
    it('should update instance "layout" object on "resize"', async () => {
      const div = document.createElement('div');

      const stub = sinonSandbox.stub(div, 'getBoundingClientRect');

      stub.returns({
        width: 100,

        height: 200,
      });

      const instance = new Padlock(div, undefined, window);

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      stub.returns({
        width: 200,

        height: 300,
      });

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      expect(instance.layout).to.include({
        outerWidth: 200,

        outerHeight: 300,
      });

      stub.returns({
        width: 400,

        height: 500,
      });

      div.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      expect(instance.layout).to.include({
        outerWidth: 200,

        outerHeight: 300,
      });

      instance.destroy();
    });

    it('should update instance "scroll" object on "scroll"', async () => {
      const div = document.createElement('div');

      div.scrollTop = 1000;

      div.scrollLeft = 2000;

      const instance = new Padlock(div, undefined, window);

      expect(instance.scroll).deep.equals({
        top: 1000,

        left: 2000,
      });

      div.scrollTop = 2000;

      div.scrollLeft = 3000;

      expect(instance.scroll).deep.equals({
        top: 1000,

        left: 2000,
      });

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      expect(instance.scroll).to.not.include({
        top: 2000,

        left: 3000,
      });

      div.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      expect(instance.scroll).deep.equals({
        top: 2000,

        left: 3000,
      });

      instance.destroy();
    });

    it('should update instance "layout" object on "update" method call', () => {
      const div = document.createElement('div');

      const stub = sinonSandbox.stub(div, 'getBoundingClientRect');

      stub.returns({
        width: 100,

        height: 200,
      });

      const instance = new Padlock(div, undefined, window);

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      stub.returns({
        width: 300,

        height: 400,
      });

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      instance.update();

      expect(instance.layout).to.include({
        outerWidth: 300,

        outerHeight: 400,
      });

      instance.destroy();
    });

    it('should update instance "scroll" object on "update" method call', () => {
      const div = document.createElement('div');

      const stub = sinonSandbox.stub(div, 'getBoundingClientRect');

      stub.returns({
        width: 100,

        height: 200,
      });

      const instance = new Padlock(div, undefined, window);

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      stub.returns({
        width: 300,

        height: 400,
      });

      expect(instance.layout).to.include({
        outerWidth: 100,

        outerHeight: 200,
      });

      instance.update();

      expect(instance.layout).to.include({
        outerWidth: 300,

        outerHeight: 400,
      });

      instance.destroy();
    });
  });

  describe('scroll setter effects', () => {
    it('should trigger scroll when setting new values to "scroll" instance setter when in "unlocked" state', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      sinonSandbox.spy(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      instance.scroll = { top: 100, left: 200 };

      expect(div.scrollTo.getCalls()).to.have.lengthOf(1);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      let calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([200, 100]);

      instance.destroy();

      calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);
    });

    it('should register scroll requests when in locked state, forbid it, and then fires it on scroll unlock', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      sinonSandbox.spy(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      div.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([300, 200]);

      instance.destroy();
    });

    it('should update "scroll" instance object on scroll when in "unlocked" state', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      sinonSandbox.spy(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.scroll = { top: 100, left: 200 };

      let calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([200, 100]);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      instance.scroll = { top: 300, left: 400 };

      expect(calls).to.have.lengthOf(1);

      instance.destroy();
    });

    it('should register scroll requests when in locked state, forbid it, and then fires it on scroll unlock updating scroll object', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      sinonSandbox.spy(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.scroll = { top: 300, left: 400 };

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      div.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const calls = div.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([400, 300]);

      instance.destroy();
    });

    it('should not react to extraneous css class names being set', async () => {
      const div = document.createElement('div');

      div.scrollTo = div.scrollTo || (() => { });

      sinonSandbox.spy(div, 'scrollTo');

      const cssClassName = 'locked';

      const instance = new Padlock(div, cssClassName, window);

      div.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      div.classList.add('another-css-class-name');

      await new Promise(window.setTimeout);

      expect(div.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.scrollingElement.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const calls = instance.scrollEventElement.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([300, 200]);

      instance.destroy();
    });

    it('should not react to "update" method calls or "scroll" setter calls when locked state', async () => {
      const cssClassName = 'locked';

      const instance = new Padlock(undefined, cssClassName, window);

      sinonSandbox.stub(instance.scrollEventElement, 'scrollTo');

      instance.scrollingElement.classList.add(cssClassName);

      await new Promise(window.setTimeout);

      expect(instance.scrollEventElement.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.scroll = { top: 100, left: 200 };

      expect(instance.scrollEventElement.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.update();

      expect(instance.scrollEventElement.scrollTo.getCalls()).to.have.lengthOf(0);

      instance.scrollingElement.classList.remove(cssClassName);

      await new Promise(window.setTimeout);

      const calls = instance.scrollEventElement.scrollTo.getCalls();

      expect(calls).to.have.lengthOf(1);

      expect(calls[0].args).to.deep.equals([200, 100]);

      instance.destroy();
    });
  });

  describe('destruction', () => {
    it('should be able to set instance members references to initial state on destroy', () => {
      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      expect(instance.scrollingElement).to.be.an.instanceOf(window.HTMLElement).which.is.not.null;

      expect(instance.scrollEventElement).to.equals(window);

      expect(instance.cssClassName).to.be.a('string').which.is.not.empty;

      expect(instance.scroll).to.be.an('object').which.is.not.null;

      expect(instance.layout).to.be.an('object').which.is.not.null;

      instance.destroy();

      expect(instance.scrollingElement).to.be.null;

      expect(instance.scrollEventElement).to.be.null;

      expect(instance.cssClassName).to.empty;

      expect(instance.scroll).to.be.null;

      expect(instance.layout).to.be.null;

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      expect(instance.scrollingElement).to.be.null;

      expect(instance.scrollEventElement).to.be.null;

      expect(instance.cssClassName).to.empty;

      expect(instance.scroll).to.be.null;

      expect(instance.layout).to.be.null;

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      expect(instance.scrollingElement).to.be.null;

      expect(instance.scrollEventElement).to.be.null;

      expect(instance.cssClassName).to.empty;

      expect(instance.scroll).to.be.null;

      expect(instance.layout).to.be.null;

      instance.update();

      expect(instance.scrollingElement).to.be.null;

      expect(instance.scrollEventElement).to.be.null;

      expect(instance.cssClassName).to.empty;

      expect(instance.scroll).to.be.null;

      expect(instance.layout).to.be.null;

      instance.scroll = { top: 1, left: 2 };

      expect(instance.scrollingElement).to.be.null;

      expect(instance.scrollEventElement).to.be.null;

      expect(instance.cssClassName).to.empty;

      expect(instance.scroll).to.be.null;

      expect(instance.layout).to.be.null;
    });

    it('should stop observing to dom changes after destruction', () => {
      sinonSandbox.spy(window.MutationObserver.prototype, 'observe');

      sinonSandbox.spy(window.MutationObserver.prototype, 'disconnect');

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(0);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(0);

      const { scrollingElement } = instance;

      instance.destroy();

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(1);

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(1);

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(1);

      instance.update();

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(1);

      instance.scroll = { top: 1, left: 2 };

      expect(window.MutationObserver.prototype.observe.getCalls()).to.have.lengthOf(1);

      expect(window.MutationObserver.prototype.disconnect.getCalls()).to.have.lengthOf(1);
    });

    it('should stop listening to resize event after destruction', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls()).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      sinonSandbox.spy(scrollingElement, 'addEventListener');

      sinonSandbox.spy(scrollingElement, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      scrollingElement.dispatchEvent(new window.CustomEvent('scroll'));

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.update();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.scroll = { top: 0, left: 1 };

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);
    });

    it('should stop listening to scroll event after destruction', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls()).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      const { scrollingElement } = instance;

      sinonSandbox.spy(scrollingElement, 'addEventListener');

      sinonSandbox.spy(scrollingElement, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      scrollingElement.dispatchEvent(new window.CustomEvent('resize'));

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.update();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.scroll = { top: 0, left: 2 };

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(scrollingElement.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);
    });
  });

  describe('listeners', () => {
    it('should be able to pause scroll event listener', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.unlisten('scroll');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);
    });

    it('should be able to resume scroll event listener', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.unlisten('scroll');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      instance.listen('scroll');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(2);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      instance.destroy();
    });

    it('should not be able to resume scroll event listener after destruction', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(0);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      instance.listen('scroll');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'scroll')).to.have.lengthOf(1);
    });

    it('should be able to pause resize event listener', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.unlisten('resize');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);
    });

    it('should be able to resume resize event listener', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.unlisten('resize');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      instance.listen('resize');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(2);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      instance.destroy();
    });

    it('should not be able to resume resize event listener after destruction', () => {
      sinonSandbox.spy(window, 'addEventListener');

      sinonSandbox.spy(window, 'removeEventListener');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      const instance = new Padlock(undefined, undefined, window);

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(0);

      instance.destroy();

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      instance.listen('resize');

      expect(window.addEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);

      expect(window.removeEventListener.getCalls().filter((x) => x.args[0] === 'resize')).to.have.lengthOf(1);
    });
  });
});
