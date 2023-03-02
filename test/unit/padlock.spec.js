import { expect } from 'chai';

import Padlock from '../../src/padlock';

import getJsdomWindow from '../utils/get-jsdom-window';

const window = getJsdomWindow();

const createDiv = () => window.document.createElement('div');

const createInstance = (el, opts) => new Padlock(el, opts, window);

const createInstanceMomentary = (el, opts) => createInstance(el, opts).destroy();

describe('src/padlock', () => {
  it('should be able to create an instance and throw if incorrect arguments are passed', () => {
    // This instance has an invalid element argument
    expect(createInstanceMomentary.bind(this, null))
      .to.throw(TypeError);

    // This instances have an invalid CSS class argument or options argument
    expect(createInstanceMomentary.bind(this, createDiv(), null))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), {}))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), []))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), ''))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), 0))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), 1))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), '1'))
      .to.not.throw(TypeError);

    // This instances have an invalid CSS class argument in a valid options argument
    expect(createInstanceMomentary.bind(this, { cssClassName: null }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: [] }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: {} }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: '' }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: 0 }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: 1 }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, { cssClassName: '1' }))
      .to.not.throw(TypeError);

    // These instances are created on the same element, an error has to be thrown
    expect(() => {
      const div = createDiv();

      const instance = createInstance(div);

      // Catches the error in order to clean former
      // instance before rebinding it to make the test work properly
      try {
        createInstanceMomentary(div);
      } catch (e) {
        instance.destroy();

        throw e;
      }
    })
      .to.throw(Error);

    // These instances are created on the same element,
    // but no error is thrown because the first one is destroyed before the second
    expect(() => {
      const div = createDiv();

      let instance = createInstance(div);

      instance.destroy();

      instance = createInstance(div);

      instance.destroy();
    }).to.not.throw(Error);

    expect(() => {
      // If no element is given as an argument,
      // then the default one is page scroller (<html> element)
      let instance = createInstance();

      expect(window.document.documentElement.matches('[data-scroll-padlock]'));

      instance.destroy();

      // If <body> is given as an argument, then it's a global scroller (still <html> element)
      instance = createInstance(window.document.body);

      expect(window.document.documentElement.matches('[data-scroll-padlock]'));

      instance.destroy();
    }).to.not.throw(Error);

    expect(() => createInstanceMomentary()).to.not.throw(TypeError);

    expect(() => createInstanceMomentary(null)).to.throw(TypeError);

    expect(() => createInstanceMomentary(window.document.createElement('div'))).to.not.throw(TypeError);

    const {
      document,
    } = window || {};

    const {
      body,

      documentElement,
    } = document || {};

    expect(() => createInstanceMomentary({ ...window })).to.not.throw();

    expect(() => createInstanceMomentary(window)).to.throw(TypeError);

    expect(() => createInstanceMomentary(document)).to.throw(TypeError);

    expect(() => createInstanceMomentary(documentElement)).to.not.throw(TypeError);

    expect(() => createInstanceMomentary(body)).to.not.throw(TypeError);
  });

  it('should update instance "layout" object only on resize and "scroll" object only on scroll', async () => {
    const div = createDiv();

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

    const instance = createInstance(div);

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

  it('should update instance "scroll" object and "layout" object on "update" method call', () => {
    const div = createDiv();

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

    const instance = createInstance(div);

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

  it('should scroll the element through "scroll" setter when unlocked state, save it for later when locked, restore saved scroll on unlock', async () => {
    const div = createDiv();

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

    const instance = createInstance(div, lockedStateCSSClassName);

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

  it('should avoid further computations or DOM changes after "destroy" method call', () => {
    const div = createDiv();

    const getStylesheetsCount = () => window.document.head.querySelectorAll('style').length;

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

    window.MutationObserver = class {
      // eslint-disable-next-line class-methods-use-this
      observe = () => {
        observed += 1;
      };

      // eslint-disable-next-line class-methods-use-this
      unobserve = () => {
        unobserved += 1;
      };

      // eslint-disable-next-line class-methods-use-this
      disconnect = () => {
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

    const instance = createInstance(div);

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

  it('should be able to append a style tag with css variables for given values targeting a given element', () => {
    const div = createDiv();
    const holder = createDiv();

    holder.prepend(div);

    let styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(0);

    let instance = createInstance(div);

    styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(1);

    let [style] = styles || [];

    expect(window.document.head.contains(style)).to.be.true;
    expect(div.matches('[data-scroll-padlock]')).to.be.true;

    let attrValue = div.getAttribute('data-scroll-padlock');
    expect(parseInt(attrValue, 10)).to.a('number');

    let rules = style.sheet.cssRules[0];
    expect(rules.selectorText).equals(`[data-scroll-padlock="${attrValue}"]`);

    instance.destroy();

    styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(0);

    expect(window.document.head.contains(style)).to.be.false;
    expect(div.matches('[data-scroll-padlock]')).to.be.false;

    const indexShifterDummyEl = createDiv();

    holder.prepend(indexShifterDummyEl);

    instance = createInstance(div);

    styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(1);

    ([style] = styles || []);

    expect(window.document.head.contains(style)).to.be.true;

    const oldAttrValue = attrValue;
    attrValue = div.getAttribute('data-scroll-padlock');
    expect(attrValue).not.to.equals(oldAttrValue);
    expect(parseInt(attrValue, 10)).to.be.a('number');

    // eslint-disable-next-line prefer-destructuring
    rules = style.sheet.cssRules[0];

    expect(rules.selectorText).equals(`[data-scroll-padlock="${attrValue}"]`);

    indexShifterDummyEl.remove();
    div.remove();

    instance.destroy();
  });
});
