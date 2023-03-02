import { expect } from 'chai';

import Padlock from '../../src/padlock';

import {
  STR_WORD_SCROLL,
  STR_WORD_RESIZE,
} from '../../src/constants';

import {
  STR_KEBAB_DATA_SCROLL_PADLOCK,
  STR_CAMEL_OUTER_WIDTH,
  STR_CAMEL_OUTER_HEIGHT,
  STR_WORD_TOP,
  STR_WORD_LEFT,
} from '../../src/constants-computed';

import getElementParentsLength from '../../src/get-element-parents-length';
import getElementIndex from '../../src/get-element-index';
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
      .to.not.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), {}))
      .to.not.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), []))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), ''))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), 0))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), 1))
      .to.throw(TypeError);

    // This instances have an invalid CSS class argument in a valid options argument
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: null }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: [] }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: {} }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: '' }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: 0 }))
      .to.throw(TypeError);
    expect(createInstanceMomentary.bind(this, createDiv(), { cssClassName: 1 }))
      .to.throw(TypeError);

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

      expect(window.document.documentElement.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`));

      instance.destroy();

      // If <body> is given as an argument, then it's a global scroller (still <html> element)
      instance = createInstance(window.document.body);

      expect(window.document.documentElement.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`));

      instance.destroy();
    }).to.not.throw(Error);
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
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
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
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.not.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
    });

    window.dispatchEvent(new window.CustomEvent(STR_WORD_RESIZE));

    await new Promise(window.setTimeout);

    expect(instance.layout).to.include({
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.not.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
    });

    dimensions = {
      width: 400,
      height: 500,
    };

    div.dispatchEvent(new window.CustomEvent(STR_WORD_SCROLL));

    await new Promise(window.setTimeout);

    expect(instance.layout).not.to.include({
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
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
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
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
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.not.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
    });

    instance.update();

    expect(instance.layout).to.include({
      [STR_CAMEL_OUTER_WIDTH]: dimensions.width,
      [STR_CAMEL_OUTER_HEIGHT]: dimensions.height,
    });
    expect(instance.scroll).to.include({
      [STR_WORD_TOP]: scrollPosition.top,
      [STR_WORD_LEFT]: scrollPosition.left,
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
        case STR_WORD_SCROLL:
          scrollListened += 1;
          break;

        case STR_WORD_RESIZE:
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
        case STR_WORD_SCROLL:
          scrollRemoved += 1;
          break;

        case STR_WORD_RESIZE:
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

    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.true;

    instance.destroy();

    expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.false;

    div.dispatchEvent(new window.CustomEvent(STR_WORD_SCROLL));

    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.false;

    div.dispatchEvent(new window.CustomEvent(STR_WORD_RESIZE));

    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.false;

    instance.update();

    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.false;

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
    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.true;

    let attrValue = div.getAttribute(STR_KEBAB_DATA_SCROLL_PADLOCK);
    expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

    let rules = style.sheet.cssRules[0];
    expect(rules.selectorText).equals(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}="${attrValue}"]`);

    instance.destroy();

    styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(0);

    expect(window.document.head.contains(style)).to.be.false;
    expect(div.matches(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}]`)).to.be.false;

    const indexShifterDummyEl = createDiv();

    holder.prepend(indexShifterDummyEl);

    instance = createInstance(div);

    styles = window.document.head.querySelectorAll('style');

    expect(styles).to.be.lengthOf(1);

    ([style] = styles || []);

    expect(window.document.head.contains(style)).to.be.true;

    const oldAttrValue = attrValue;
    attrValue = div.getAttribute(STR_KEBAB_DATA_SCROLL_PADLOCK);
    expect(attrValue).not.to.equals(oldAttrValue);
    expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

    // eslint-disable-next-line prefer-destructuring
    rules = style.sheet.cssRules[0];

    expect(rules.selectorText).equals(`[${STR_KEBAB_DATA_SCROLL_PADLOCK}="${attrValue}"]`);

    indexShifterDummyEl.remove();
    div.remove();

    instance.destroy();
  });

  it('should throw an error if an "element" argument is passed and it\'s nor an html element nor a global element (window, body...)', () => {
    expect(() => createInstance()).to.not.throw(TypeError);

    expect(() => createInstance(null)).to.throw(TypeError);

    expect(() => createInstance(window.document.createElement('div'))).to.not.throw(TypeError);

    const {
      document,
    } = window || {};

    const {
      body,

      documentElement,
    } = document || {};

    expect(() => createInstance({ ...window })).to.throw();

    expect(() => createInstance(window)).to.not.throw(TypeError);

    expect(() => createInstance(document)).to.not.throw(TypeError);

    expect(() => createInstance(documentElement)).to.not.throw(TypeError);

    expect(() => createInstance(body)).to.not.throw(TypeError);
  });

  // TODO: should check that element / scroller / target members
  // are effectively set by passing "element" argument to constructor
});
