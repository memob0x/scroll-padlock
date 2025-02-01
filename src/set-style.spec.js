import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import {
  deepEqual,
  doesNotThrow, equal, match, strictEqual, throws,
} from 'node:assert';
import { JSDOM } from 'jsdom';
import { randomUUID } from 'node:crypto';
import setStyle from './set-style.js';

const originalGlobalThis = globalThis;

describe(setStyle.name, () => {
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

  describe('parameter signature', () => {
    it('should throw if the "selector" option is passed as falsy', () => {
      throws(() => setStyle({ selector: '' }), {
        message: 'Invalid options provided.',
      });
    });

    it('should throw if the "element" option is passed as null', () => {
      throws(() => setStyle({ element: null }), {
        message: 'Invalid options provided.',
      });
    });

    it('should throw if the "formatter" option is passed as null', () => {
      throws(() => setStyle({ formatter: null }), {
        message: 'Invalid options provided.',
      });
    });

    it('should not throw if the "selector" option is passed as undefined', () => {
      doesNotThrow(() => setStyle({ selector: undefined }));
    });

    it('should not throw if the "element" option is passed as undefined', () => {
      doesNotThrow(() => setStyle({ element: undefined }));
    });

    it('should not throw if the "formatter" option is passed as undefined', () => {
      doesNotThrow(() => setStyle({ formatter: undefined }));
    });

    it('should not throw if is called without options', () => {
      doesNotThrow(() => setStyle());
    });
  });

  describe('stylesheet element lifecycle', () => {
    it('should throw if it\'s not able to access the created style element "sheet" instance', () => {
      const fn = testingEnvGlobalThis.document.createElement;

      testingEnvGlobalThis.document.createElement = () => fn.call(testingEnvGlobalThis.document, 'div');

      throws(() => setStyle({ selector: `.${randomUUID()}` }), {
        message: 'Invalid CSSStyleSheet instance.',
      });
    });

    it('should create a style element', () => {
      const style = setStyle();

      equal(style.tagName, 'STYLE');

      equal(testingEnvGlobalThis.document.head.contains(style), true);
    });

    it('should reuse an existent style when the function is called without options both times', () => {
      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

      const style0 = setStyle();

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

      const style1 = setStyle();

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

      strictEqual(style0, style1);
    });

    it('should reuse an existent style when the same selector is passed', () => {
      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

      const selector = `.${randomUUID()}`;

      const style0 = setStyle({ selector });

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

      const style1 = setStyle({ selector });

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

      strictEqual(style0, style1);
    });

    it('should append again a previously created style element which is not in the DOM anymore', () => {
      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

      const selector = `.${randomUUID()}`;

      const style = setStyle({ selector });

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);

      style.remove();

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 0);

      setStyle({ selector });

      equal(testingEnvGlobalThis.document.head.querySelectorAll('style').length, 1);
    });
  });

  describe('data retrieval', () => {
    it('should call use the global computed properties when no element is provided', () => {
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

      setStyle({
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

    it('should call use the fallback global computed properties when no element is provided and the standard global element is not available', () => {
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

      testingEnvGlobalThis.document.scrollingElement = null;

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

      setStyle({
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

    it('should call use the global computed properties when the default scrolling element is provided', () => {
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

      setStyle({
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

    it('should call use the global computed properties when the "body" element is provided', () => {
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

      setStyle({
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

    it('should call use the global computed properties when the "document element" is provided', () => {
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

      setStyle({
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

    it('should call use the provided element computed properties when a custom element is provided', () => {
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

      setStyle({
        formatter,

        element: {
          ...elementProperties,

          extra: randomUUID(),
        },
      });

      equal(calls, 1);

      deepEqual(params, [
        elementProperties,
      ]);
    });
  });

  describe('css rules format', () => {
    it('should create a single rule', () => {
      const { cssRules } = setStyle().sheet;

      equal(cssRules.length, 1);
    });

    it('should all the rules before adding a new one', () => {
      const style = setStyle();

      style.sheet.insertRule(`.${randomUUID()} { --${randomUUID()}: ${randomUUID()}; }`);

      style.sheet.insertRule(`.${randomUUID()} { --${randomUUID()}: ${randomUUID()}; }`);

      equal(style.sheet.cssRules.length, 3);

      setStyle();

      equal(style.sheet.cssRules.length, 1);
    });

    it('should address a default selector if the relative option is not provided', () => {
      const [{ cssText }] = setStyle().sheet.cssRules;

      equal(cssText.startsWith('.scroll-padlock'), true);
    });

    it('should address the provided selector if the relative option is provided', () => {
      const selector = `.${randomUUID()}`;

      const [{ cssText }] = setStyle({ selector }).sheet.cssRules;

      equal(cssText.startsWith(selector), true);
    });

    it('should create a rule with the right format', () => {
      const style = setStyle().sheet;

      match(style.cssRules[0].cssText, /^\.scroll-padlock\s*\{\s*(--[\w-]+:\s*[^;]+;\s*){10}\}$/);
    });
  });

  describe('style computation', () => {
    it('should set the provided custom styles to the element which matches the provided selector without using inline styles', () => {
      const cssClass = `custom-element-${randomUUID()}`;

      const selector = `.${cssClass}`;

      const element = testingEnvGlobalThis.document.createElement('div');

      element.classList.add(cssClass);

      testingEnvGlobalThis.document.body.appendChild(element);

      const propertyName = `--${randomUUID()}`;

      const propertyValue = randomUUID();

      setStyle({
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

    it('should set the default css variables to the element which matches the provided selector', () => {
      const cssClass = `custom-element-${randomUUID()}`;

      const selector = `.${cssClass}`;

      const element = testingEnvGlobalThis.document.createElement('div');

      element.classList.add(cssClass);

      testingEnvGlobalThis.document.body.appendChild(element);

      setStyle({
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
});
