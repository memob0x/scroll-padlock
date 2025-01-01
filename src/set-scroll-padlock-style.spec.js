import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import {
  deepEqual,
  doesNotThrow, equal, strictEqual, throws,
} from 'node:assert';
import { JSDOM } from 'jsdom';
import { randomUUID } from 'node:crypto';
import setScrollPadlockStyle from './set-scroll-padlock-style.js';

const originalGlobalThis = globalThis;

describe(setScrollPadlockStyle.name, () => {
  /**
   * @type {Window}
   */
  let testingEnvGlobalThis;

  beforeEach(() => {
    ({ window: testingEnvGlobalThis } = new JSDOM(
      `<html>
       <head> </head>
       <body> </body>
      </html>`,

      {
        url: 'http://localhost',
      },
    ));

    testingEnvGlobalThis.document.scrollingElement = testingEnvGlobalThis.document.body;

    // eslint-disable-next-line no-global-assign
    globalThis = testingEnvGlobalThis;
  });

  afterEach(() => {
    // eslint-disable-next-line no-global-assign
    globalThis = originalGlobalThis;
  });

  it('should throw if the "selector" option is passed as falsy', () => {
    throws(() => setScrollPadlockStyle({ selector: '' }), {
      message: 'Invalid settings provided.',

    });
  });

  it('should throw if the "element" option is passed as null', () => {
    throws(() => setScrollPadlockStyle({ element: null }), {
      message: 'Invalid settings provided.',
    });
  });

  it('should throw if the "formatter" option is passed as null', () => {
    throws(() => setScrollPadlockStyle({ formatter: null }), {
      message: 'Invalid settings provided.',
    });
  });

  it('should not throw if the "selector" option is passed as undefined', () => {
    doesNotThrow(() => setScrollPadlockStyle({ selector: undefined }));
  });

  it('should not throw if the "element" option is passed as undefined', () => {
    doesNotThrow(() => setScrollPadlockStyle({ element: undefined }));
  });

  it('should not throw if the "formatter" option is passed as undefined', () => {
    doesNotThrow(() => setScrollPadlockStyle({ formatter: undefined }));
  });

  it('should not throw if is called without options', () => {
    doesNotThrow(() => setScrollPadlockStyle());
  });

  it('should throw if it\'s not able to access the created style element "sheet" instance', () => {
    const fn = testingEnvGlobalThis.document.createElement;

    testingEnvGlobalThis.document.createElement = () => fn.call(testingEnvGlobalThis.document, 'div');

    throws(() => setScrollPadlockStyle({ selector: `.${randomUUID()}` }), {
      message: 'Invalid CSSStyleSheet instance.',
    });
  });

  it('should create a style element', () => {
    const style = setScrollPadlockStyle();

    equal(style.tagName, 'STYLE');

    equal(testingEnvGlobalThis.document.head.contains(style), true);
  });

  it('should reuse an existent style when the function is called without options both times', () => {
    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

    const style0 = setScrollPadlockStyle();

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

    const style1 = setScrollPadlockStyle();

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

    strictEqual(style0, style1);
  });

  it('should reuse an existent style when the same selector is passed', () => {
    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

    const selector = `.${randomUUID()}`;

    const style0 = setScrollPadlockStyle({ selector });

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

    const style1 = setScrollPadlockStyle({ selector });

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

    strictEqual(style0, style1);
  });

  it('should appaind again a previouslty created style element which was removed', () => {
    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

    const selector = `.${randomUUID()}`;

    const style = setScrollPadlockStyle({ selector });

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

    style.remove();

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

    setScrollPadlockStyle({ selector });

    equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);
  });

  it('should call use the global computed properties when no element is given', () => {
    let calls = 0;

    let params = [];

    const formatter = (...args) => {
      calls += 1;

      params = args;
    };

    testingEnvGlobalThis.innerWidth = 1;
    testingEnvGlobalThis.innerHeight = 2;
    testingEnvGlobalThis.scrollY = 3;
    testingEnvGlobalThis.scrollX = 4;

    testingEnvGlobalThis.document.scrollingElement = {};
    testingEnvGlobalThis.document.scrollingElement.clientWidth = 5;
    testingEnvGlobalThis.document.scrollingElement.clientHeight = 6;
    testingEnvGlobalThis.document.scrollingElement.scrollWidth = 7;
    testingEnvGlobalThis.document.scrollingElement.scrollHeight = 8;

    setScrollPadlockStyle({
      formatter,
    });

    equal(calls, 1);

    deepEqual(params, [
      {
        offsetWidth: 1,
        offsetHeight: 2,
        scrollTop: 3,
        scrollLeft: 4,
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      },
    ]);
  });

  it('should call use the global computed properties when the default scrolling element is given', () => {
    let calls = 0;

    let params = [];

    const formatter = (...args) => {
      calls += 1;

      params = args;
    };

    testingEnvGlobalThis.innerWidth = 1;
    testingEnvGlobalThis.innerHeight = 2;
    testingEnvGlobalThis.scrollY = 3;
    testingEnvGlobalThis.scrollX = 4;

    testingEnvGlobalThis.document.scrollingElement = {};
    testingEnvGlobalThis.document.scrollingElement.clientWidth = 5;
    testingEnvGlobalThis.document.scrollingElement.clientHeight = 6;
    testingEnvGlobalThis.document.scrollingElement.scrollWidth = 7;
    testingEnvGlobalThis.document.scrollingElement.scrollHeight = 8;

    setScrollPadlockStyle({
      formatter,

      element: testingEnvGlobalThis.document.scrollingElement,
    });

    equal(calls, 1);

    deepEqual(params, [
      {
        offsetWidth: 1,
        offsetHeight: 2,
        scrollTop: 3,
        scrollLeft: 4,
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      },
    ]);
  });

  it('should call use the global computed properties when the "body" element is given', () => {
    let calls = 0;

    let params = [];

    const formatter = (...args) => {
      calls += 1;

      params = args;
    };

    testingEnvGlobalThis.innerWidth = 1;
    testingEnvGlobalThis.innerHeight = 2;
    testingEnvGlobalThis.scrollY = 3;
    testingEnvGlobalThis.scrollX = 4;

    Object.defineProperty(testingEnvGlobalThis.document.body, 'clientWidth', {
      value: 5,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.body, 'clientHeight', {
      value: 6,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.body, 'scrollWidth', {
      value: 7,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.body, 'scrollHeight', {
      value: 8,
      configurable: true,
    });

    setScrollPadlockStyle({
      formatter,

      element: testingEnvGlobalThis.document.body,
    });

    equal(calls, 1);

    deepEqual(params, [
      {
        offsetWidth: 1,
        offsetHeight: 2,
        scrollTop: 3,
        scrollLeft: 4,
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      },
    ]);
  });

  it('should call use the global computed properties when the "document element" is given', () => {
    let calls = 0;

    let params = [];

    const formatter = (...args) => {
      calls += 1;

      params = args;
    };

    testingEnvGlobalThis.innerWidth = 1;
    testingEnvGlobalThis.innerHeight = 2;
    testingEnvGlobalThis.scrollY = 3;
    testingEnvGlobalThis.scrollX = 4;

    Object.defineProperty(testingEnvGlobalThis.document.documentElement, 'clientWidth', {
      value: 5,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.documentElement, 'clientHeight', {
      value: 6,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.documentElement, 'scrollWidth', {
      value: 7,
      configurable: true,
    });

    Object.defineProperty(testingEnvGlobalThis.document.documentElement, 'scrollHeight', {
      value: 8,
      configurable: true,
    });

    setScrollPadlockStyle({
      formatter,

      element: testingEnvGlobalThis.document.documentElement,
    });

    equal(calls, 1);

    deepEqual(params, [
      {
        offsetWidth: 1,
        offsetHeight: 2,
        scrollTop: 3,
        scrollLeft: 4,
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      },
    ]);
  });

  it('should call use the given element computed properties when a custom element is given', () => {
    let calls = 0;

    let params = [];

    const formatter = (...args) => {
      calls += 1;

      params = args;
    };

    const elementProperties = {
      offsetWidth: 1,
      offsetHeight: 2,
      scrollTop: 3,
      scrollLeft: 4,
      clientWidth: 5,
      clientHeight: 6,
      scrollWidth: 7,
      scrollHeight: 8,
    };

    setScrollPadlockStyle({
      formatter,

      element: {
        ...elementProperties,

        extra: 'property',
      },
    });

    equal(calls, 1);

    deepEqual(params, [
      elementProperties,
    ]);
  });

  it('should set the given custom styles to the element which matches the given selector without using inline styles', () => {
    const cssClass = `custom-element-${randomUUID()}`;

    const selector = `.${cssClass}`;

    const element = testingEnvGlobalThis.document.createElement('div');

    element.classList.add(cssClass);

    testingEnvGlobalThis.document.body.appendChild(element);

    const propertyName = `--${randomUUID()}`;

    const propertyValue = randomUUID();

    setScrollPadlockStyle({
      selector,

      element,

      formatter: () => `${propertyName}: ${propertyValue}`,
    });

    equal(element.hasAttribute('style'), false);

    equal(
      testingEnvGlobalThis.getComputedStyle(element).getPropertyValue(propertyName),

      propertyValue,
    );
  });

  it('should replace the formerly set css styles when invoked again with the same element and selector', () => {
    const cssClass = `custom-element-${randomUUID()}`;

    const selector = `.${cssClass}`;

    const element = testingEnvGlobalThis.document.createElement('div');

    element.classList.add(cssClass);

    testingEnvGlobalThis.document.body.appendChild(element);

    const propertyName0 = `--${randomUUID()}`;

    const propertyValue0 = `prop-0-${randomUUID()}`;

    const style0 = setScrollPadlockStyle({
      selector,

      element,

      formatter: () => `${propertyName0}: ${propertyValue0}`,
    });

    equal(
      style0.sheet.cssRules[0].cssText,

      `${selector} {${propertyName0}: ${propertyValue0};}`,
    );

    const propertyName1 = `--${randomUUID()}`;

    const propertyValue1 = `prop-1-${randomUUID()}`;

    const style1 = setScrollPadlockStyle({
      selector,

      element,

      formatter: () => `${propertyName1}: ${propertyValue1}`,
    });

    deepEqual(
      style0.sheet.cssRules,

      style1.sheet.cssRules,
    );

    equal(
      style1.sheet.cssRules[0].cssText,

      `${selector} {${propertyName1}: ${propertyValue1};}`,
    );

    // TODO: check why computed styles are not being updated at this point
  });

  it('should set the default css variables to the element which matches the given selector', () => {
    const cssClass = `custom-element-${randomUUID()}`;

    const selector = `.${cssClass}`;

    const element = testingEnvGlobalThis.document.createElement('div');

    element.classList.add(cssClass);

    testingEnvGlobalThis.document.body.appendChild(element);

    setScrollPadlockStyle({
      selector,

      element,
    });

    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--offset-width').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--offset-height').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--client-width').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--client-height').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scroll-width').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scroll-height').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scrollbar-width').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scrollbar-height').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scroll-top').endsWith('px'), true);
    equal(testingEnvGlobalThis.getComputedStyle(element).getPropertyValue('--scroll-left').endsWith('px'), true);
  });
});
