import { expect } from 'chai';
import sinon from 'sinon';

import Padlock from '../../src/padlock';

import getJsdomWindow from '../utils/get-jsdom-window';

describe('src/padlock', () => {
  let window;

  let document;

  const sinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    window = getJsdomWindow();

    ({ document } = window);
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
      expect(
        () => new Padlock(undefined, undefined, window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)

      expect(
        () => new Padlock({}, undefined, window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)

      expect(
        () => new Padlock(document.createElement('div'), undefined, window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)

      expect(
        () => new Padlock({ ...window, client: window }).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)

      expect(
        () => new Padlock(document.documentElement, undefined, window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)

      expect(
        () => new Padlock(document.body, undefined, window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.scrollingElement)
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
      expect(
        () => new Padlock(document.createElement('div'), undefined, window),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.cssClassName)

      expect(
        () => new Padlock(document.createElement('div'), '1', window).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.cssClassName)
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
      expect(
        () => new Padlock({ cssClassName: undefined, client: window }).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.cssClassName)

      expect(
        () => new Padlock({ cssClassName: '1', client: window }).destroy(),
      ).to.not.throw(TypeError);

      // TODO: test what is set in instance here (instance.cssClassName)
    });

    it('should throw if first argument option object with invalid scrolling element property is passed', () => {
      // TODO:
    });

    it('should create an instance when first argument option object with valid scrolling element property is passed', () => {
      // TODO:
    });

    it('should throw if first argument option object with invalid scrolling event element property is passed', () => {
      // TODO:
    });

    it('should create an instance when first argument option object with valid scrolling event element property is passed', () => {
      // TODO:
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
        let instance = new Padlock(document.body, undefined, window);

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
    // TODO: split into granular test cases
    it('should be able to append a style tag with css variables for given values targeting a given element', () => {
      const div = document.createElement('div');
      const holder = document.createElement('div');

      holder.prepend(div);

      let styles = document.head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(0);

      let instance = new Padlock(div, undefined, window);

      styles = document.head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(1);

      let [style] = styles || [];

      expect(document.head.contains(style)).to.be.true;
      expect(div.matches('[data-scroll-padlock]')).to.be.true;

      let attrValue = div.getAttribute('data-scroll-padlock');
      expect(parseInt(attrValue, 10)).to.a('number').and.to.not.be.NaN;

      let rules = style.sheet.cssRules[0];
      expect(rules.selectorText).equals(`[data-scroll-padlock="${attrValue}"]`);

      instance.destroy();

      styles = document.head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(0);

      expect(document.head.contains(style)).to.be.false;
      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      const indexShifterDummyEl = document.createElement('div');

      holder.prepend(indexShifterDummyEl);

      instance = new Padlock(div, undefined, window);

      styles = document.head.querySelectorAll('style');

      expect(styles).to.be.lengthOf(1);

      ([style] = styles || []);

      expect(document.head.contains(style)).to.be.true;

      const oldAttrValue = attrValue;
      attrValue = div.getAttribute('data-scroll-padlock');
      expect(attrValue).not.to.equals(oldAttrValue);
      expect(parseInt(attrValue, 10)).to.be.a('number').and.to.not.be.NaN;

      [rules] = style.sheet.cssRules;

      expect(rules.selectorText).equals(`[data-scroll-padlock="${attrValue}"]`);

      indexShifterDummyEl.remove();
      div.remove();

      instance.destroy();
    });
  });

  describe('objects computation', () => {
    // TODO: split into granular test cases
    it('should update instance "layout" object only on resize and "scroll" object only on scroll', async () => {
      const div = document.createElement('div');

      let dimensions = {
        width: 100,
        height: 200,
      };
      let scrollPosition = {
        top: 1000,
        left: 2000,
      };

      div.getBoundingClientRect = () => dimensions;
      div.scrollTop = scrollPosition.top;
      div.scrollLeft = scrollPosition.left;

      const instance = new Padlock(div, undefined, window);

      expect(instance.layout).to.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      dimensions = {
        width: 300,
        height: 400,
      };
      scrollPosition = {
        top: 2000,
        left: 3000,
      };

      div.getBoundingClientRect = () => dimensions;
      div.scrollTop = scrollPosition.top;
      div.scrollLeft = scrollPosition.left;

      expect(instance.layout).to.not.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.not.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      window.dispatchEvent(new window.CustomEvent('resize'));

      await new Promise(window.setTimeout);

      expect(instance.layout).to.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.not.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      dimensions = {
        width: 400,
        height: 500,
      };

      div.dispatchEvent(new window.CustomEvent('scroll'));

      await new Promise(window.setTimeout);

      expect(instance.layout).not.to.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      instance.destroy();
    });

    // TODO: split into granular test cases
    it('should update instance "scroll" object and "layout" object on "update" method call', () => {
      const div = document.createElement('div');

      let dimensions = {
        width: 100,
        height: 200,
      };
      let scrollPosition = {
        top: 1000,
        left: 2000,
      };

      div.getBoundingClientRect = () => dimensions;
      div.scrollTop = scrollPosition.top;
      div.scrollLeft = scrollPosition.left;

      const instance = new Padlock(div, undefined, window);

      expect(instance.layout).to.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      dimensions = {
        width: 300,
        height: 400,
      };
      scrollPosition = {
        top: 2000,
        left: 3000,
      };

      div.getBoundingClientRect = () => dimensions;
      div.scrollTop = scrollPosition.top;
      div.scrollLeft = scrollPosition.left;

      expect(instance.layout).to.not.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.not.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      instance.update();

      expect(instance.layout).to.include({
        outerWidth: dimensions.width,
        outerHeight: dimensions.height,
      });
      expect(instance.scroll).to.include({
        top: scrollPosition.top,
        left: scrollPosition.left,
      });

      instance.destroy();
    });
  });

  describe('scroll setter effects', () => {
    // TODO: split into granular test cases
    // TODO: use sinon stubs/spies instead of methods override
    it('should scroll the element through "scroll" setter when unlocked state, save it for later when locked, restore saved scroll on unlock', async () => {
      const div = document.createElement('div');

      const lockedStateCSSClassName = 'loooocked';

      let scrollToCalls = 0;

      div.scrollTo = (arg) => {
        scrollToCalls += 1;

        if (typeof arg === 'object') {
          div.scrollTop = arg?.top;
        }

        if (typeof arg === 'number') {
          div.scrollTop = arg;
        }
      };

      const instance = new Padlock(div, lockedStateCSSClassName, window);

      // Tests programmatic scroll change through instance
      let { scrollTop } = div;

      instance.scroll = { top: 100, left: 200 };

      expect(scrollTop).not.to.equals(div.scrollTop);
      expect(scrollToCalls).to.equals(1);

      scrollTop = instance.scroll.top;

      // Tests programmatic scroll change attempt through
      // instance on locked state (given scroll object is saved for later)
      ({ scrollTop } = div);

      div.classList.add(lockedStateCSSClassName);

      await new Promise(window.setTimeout);

      instance.scroll = { top: 200, left: 300 };

      expect(scrollTop).to.equals(div.scrollTop);
      expect(scrollToCalls).to.equals(1);

      // Tests automatic scroll restore on previously
      // given scroll object (through scroll change attempt)
      div.classList.remove(lockedStateCSSClassName);

      await new Promise(window.setTimeout);

      expect(scrollTop).not.to.equals(div.scrollTop);
      expect(scrollToCalls).to.equals(2);

      instance.destroy();
    });
  });

  describe('destruction', () => {
    // TODO: split into granular test cases
    // TODO: use sinon stubs/spies instead of methods override
    it('should avoid further computations or DOM changes after "destroy" method call', () => {
      const div = document.createElement('div');

      const getStylesheetsCount = () => document.head.querySelectorAll('style').length;

      const stylesheetsCountBeforeInit = getStylesheetsCount();

      const {
        MutationObserver: windowMutationObserverBackup,
        addEventListener: windowAddEventListenerBackup,
        removeEventListener: windowRemoveEventListenerBackup,
      } = window;

      let observed = 0;
      let unobserved = 0;
      let disconnect = 0;

      let resizeListened = 0;
      let scrollListened = 0;
      let scrollRemoved = 0;
      let resizeRemoved = 0;

      window.MutationObserver = function MutationObserverStub() {
        this.observe = () => {
          observed += 1;
        };

        this.unobserve = () => {
          unobserved += 1;
        };

        this.disconnect = () => {
          disconnect += 1;
        };
      };

      const attachListener = (type) => {
        switch (type) {
          case 'scroll':
            scrollListened += 1;
            break;

          case 'resize':
            resizeListened += 1;
            break;

          default:
            break;
        }
      };

      window.addEventListener = attachListener;
      div.addEventListener = attachListener;

      const detachListener = (type) => {
        switch (type) {
          case 'scroll':
            scrollRemoved += 1;
            break;

          case 'resize':
            resizeRemoved += 1;
            break;

          default:
            break;
        }
      };

      window.removeEventListener = detachListener;
      div.removeEventListener = detachListener;

      expect(observed).to.equals(0);
      expect(unobserved).to.equals(0);
      expect(disconnect).to.equals(0);
      expect(resizeListened).to.equals(0);
      expect(scrollListened).to.equals(0);
      expect(resizeRemoved).to.equals(0);
      expect(scrollRemoved).to.equals(0);

      expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

      const instance = new Padlock(div, undefined, window);

      expect(getStylesheetsCount()).to.not.equals(stylesheetsCountBeforeInit);

      expect(observed).to.equals(1);
      expect(unobserved).to.equals(0);
      expect(disconnect).to.equals(0);
      expect(resizeListened).to.equals(1);
      expect(scrollListened).to.equals(1);
      expect(resizeRemoved).to.equals(0);
      expect(scrollRemoved).to.equals(0);

      expect(div.matches('[data-scroll-padlock]')).to.be.true;

      instance.destroy();

      expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      div.dispatchEvent(new window.CustomEvent('scroll'));

      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      div.dispatchEvent(new window.CustomEvent('resize'));

      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      instance.update();

      expect(div.matches('[data-scroll-padlock]')).to.be.false;

      expect(observed).to.equals(1);
      expect(unobserved).to.equals(0);
      expect(disconnect).to.equals(1);
      expect(resizeListened).to.equals(1);
      expect(scrollListened).to.equals(1);
      expect(resizeRemoved).to.equals(1);
      expect(scrollRemoved).to.equals(1);

      window.addEventListener = windowAddEventListenerBackup;
      window.removeEventListener = windowRemoveEventListenerBackup;
      window.MutationObserver = windowMutationObserverBackup;

      instance.destroy();
    });
  });

  describe('listeners', () => {
    it('should be able to pause scroll event listener', () => {
      // TODO:
    });

    it('should be able to resume scroll event listener', () => {
      // TODO:
    });

    it('should be able to pause resize event listener', () => {
      // TODO:
    });

    it('should be able to resume resize event listener', () => {
      // TODO:
    });
  });
});
