import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import {
  deepEqual,
  doesNotThrow, equal, match, strictEqual, throws,
} from 'node:assert';
import { JSDOM } from 'jsdom';
import { randomUUID } from 'node:crypto';
import { setStyle } from './set-style.js';

describe(setStyle.name, () => {
  let originalGlobalThis: typeof globalThis;

  beforeEach(() => {
    originalGlobalThis = globalThis;

    const { window: jsDomWin } = new JSDOM(
      `<html>
       <head> </head>
       <body> </body>
      </html>`,

      {
        url: 'http://localhost',
      },
    );

    Object.defineProperty(jsDomWin.document, 'scrollingElement', {
      value: jsDomWin.document.body,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'document', {
      value: jsDomWin.document,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'HTMLElement', {
      value: jsDomWin.HTMLElement,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'getComputedStyle', {
      value: jsDomWin.getComputedStyle,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'document', {
      value: originalGlobalThis.document,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'HTMLElement', {
      value: originalGlobalThis.HTMLElement,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'getComputedStyle', {
      value: originalGlobalThis.getComputedStyle,
      writable: true,
      configurable: true,
    });
  });

  describe('parameter signature', () => {
    it('should throw if the "selector" option is passed as falsy', () => {
      throws(() => setStyle({ selector: '' }), {
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
      const fn = globalThis.document.createElement;

      globalThis.document.createElement = () => fn.call(globalThis.document, 'div');

      throws(() => setStyle({ selector: `.selector-${randomUUID()}` }), {
        message: 'Invalid CSSStyleSheet instance.',
      });
    });

    it('should create a style element', () => {
      const style = setStyle();

      equal(style.tagName, 'STYLE');

      equal(globalThis.document.head.contains(style), true);
    });

    it('should reuse an existent style when the function is called without options both times', () => {
      equal(globalThis.document.head.querySelectorAll('style').length, 0);

      const style0 = setStyle();

      equal(globalThis.document.head.querySelectorAll('style').length, 1);

      const style1 = setStyle();

      equal(globalThis.document.head.querySelectorAll('style').length, 1);

      strictEqual(style0, style1);
    });

    it('should reuse an existent style when the same selector is passed', () => {
      equal(globalThis.document.head.querySelectorAll('style').length, 0);

      const selector = `.selector-${randomUUID()}`;

      const style0 = setStyle({ selector });

      equal(globalThis.document.head.querySelectorAll('style').length, 1);

      const style1 = setStyle({ selector });

      equal(globalThis.document.head.querySelectorAll('style').length, 1);

      strictEqual(style0, style1);
    });

    it('should append again a previously created style element which is not in the DOM anymore', () => {
      equal(globalThis.document.head.querySelectorAll('style').length, 0);

      const selector = `.selector-${randomUUID()}`;

      const style = setStyle({ selector });

      equal(globalThis.document.head.querySelectorAll('style').length, 1);

      style.remove();

      equal(globalThis.document.head.querySelectorAll('style').length, 0);

      setStyle({ selector });

      equal(globalThis.document.head.querySelectorAll('style').length, 1);
    });
  });

  describe('data retrieval', () => {
    it('should call use the global computed properties when no element is provided', () => {
      let calls = 0;

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      Object.assign(globalThis, {
        innerWidth: 1,
        innerHeight: 2,
        scrollY: 3,
        scrollX: 4,
      });

      Object.defineProperty(globalThis.document, 'scrollingElement', {
        value: {
          clientWidth: 5,
          clientHeight: 6,
          scrollWidth: 7,
          scrollHeight: 8,
        },
        writable: true,
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

    it('should call use the fallback global computed properties when no element is provided and the standard global element is not available', () => {
      let calls = 0;

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      Object.assign(globalThis, {
        innerWidth: 1,
        innerHeight: 2,
        scrollY: 3,
        scrollX: 4,
      });

      Object.defineProperty(globalThis.document, 'scrollingElement', {
        value: null,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'clientWidth', {
        value: 5,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'clientHeight', {
        value: 6,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'scrollWidth', {
        value: 7,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
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

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      const winProps = {
        innerWidth: 1,
        innerHeight: 2,
        scrollY: 3,
        scrollX: 4,
      };

      Object.assign(globalThis, winProps);

      const element = globalThis.document.createElement('div');

      const elProps = {
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      };

      Object.entries(elProps).forEach(([key, value]) => Object.defineProperty(element, key, {
        value,
        configurable: true,
      }));

      Object.defineProperty(globalThis.document, 'scrollingElement', {
        value: element,
        writable: true,
        configurable: true,
      });

      setStyle({
        formatter,
        element,
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

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      Object.assign(globalThis, {
        innerWidth: 1,
        innerHeight: 2,
        scrollY: 3,
        scrollX: 4,
      });

      Object.defineProperty(globalThis.document.body, 'clientWidth', {
        value: 5,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.body, 'clientHeight', {
        value: 6,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.body, 'scrollWidth', {
        value: 7,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.body, 'scrollHeight', {
        value: 8,
        configurable: true,
      });

      setStyle({
        formatter,
        element: globalThis.document.body,
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

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      Object.assign(globalThis, {
        innerWidth: 1,
        innerHeight: 2,
        scrollY: 3,
        scrollX: 4,
      });

      Object.defineProperty(globalThis.document.documentElement, 'clientWidth', {
        value: 5,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'clientHeight', {
        value: 6,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'scrollWidth', {
        value: 7,
        configurable: true,
      });

      Object.defineProperty(globalThis.document.documentElement, 'scrollHeight', {
        value: 8,
        configurable: true,
      });

      setStyle({
        formatter,
        element: globalThis.document.documentElement,
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

      let params: unknown[] = [];

      const formatter = (...args: unknown[]) => {
        calls += 1;

        params = args;

        return '';
      };

      const element = globalThis.document.createElement('div');

      const props = {
        offsetWidth: 1,
        offsetHeight: 2,
        scrollTop: 3,
        scrollLeft: 4,
        clientWidth: 5,
        clientHeight: 6,
        scrollWidth: 7,
        scrollHeight: 8,
      };

      Object.entries(props).forEach(([key, value]) => Object.defineProperty(element, key, {
        value,
        configurable: true,
      }));

      setStyle({
        formatter,
        element,
      });

      equal(calls, 1);

      deepEqual(params, [
        props,
      ]);
    });
  });

  describe('css rules format', () => {
    it('should create a single rule', () => {
      const { cssRules } = setStyle().sheet || {};

      equal(cssRules?.length, 1);
    });

    it('should all the rules before adding a new one', () => {
      const style = setStyle();

      style.sheet?.insertRule(`.selector-${randomUUID()} { --${randomUUID()}: ${randomUUID()}; }`);

      style.sheet?.insertRule(`.selector-${randomUUID()} { --${randomUUID()}: ${randomUUID()}; }`);

      equal(style.sheet?.cssRules.length, 3);

      setStyle();

      equal(style.sheet?.cssRules.length, 1);
    });

    it('should address a default selector if the relative option is not provided', () => {
      const [{ cssText }] = setStyle().sheet?.cssRules || [];

      equal(cssText.startsWith('.scroll-padlock'), true);
    });

    it('should address the provided selector if the relative option is provided', () => {
      const selector = `.selector-${randomUUID()}`;

      const [{ cssText }] = setStyle({ selector }).sheet?.cssRules || [];

      equal(cssText.startsWith(selector), true);
    });

    it('should create a rule with the right format', () => {
      const style = setStyle().sheet;

      match(style?.cssRules[0].cssText || '', /^\.scroll-padlock\s*\{\s*(--[\w-]+:\s*[^;]+;\s*){10}\}$/);
    });
  });

  describe('style computation', () => {
    it('should set the provided custom styles to the element which matches the provided selector without using inline styles', () => {
      const cssClass = `custom-element-${randomUUID()}`;

      const selector = `.${cssClass}`;

      const element = globalThis.document.createElement('div');

      element.classList.add(cssClass);

      globalThis.document.body.appendChild(element);

      const propertyName = `--${randomUUID()}`;

      const propertyValue = randomUUID();

      setStyle({
        selector,
        element,
        formatter: () => `${propertyName}: ${propertyValue}`,
      });

      equal(element.hasAttribute('style'), false);

      equal(
        globalThis.getComputedStyle(element).getPropertyValue(propertyName),

        propertyValue,
      );
    });

    it('should set the default css variables to the element which matches the provided selector', () => {
      const cssClass = `custom-element-${randomUUID()}`;

      const selector = `.${cssClass}`;

      const element = globalThis.document.createElement('div');

      element.classList.add(cssClass);

      globalThis.document.body.appendChild(element);

      setStyle({
        selector,
        element,
      });

      equal(globalThis.getComputedStyle(element).getPropertyValue('--offset-width').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--offset-height').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--client-width').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--client-height').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scroll-width').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scroll-height').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scrollbar-width').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scrollbar-height').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scroll-top').endsWith('px'), true);
      equal(globalThis.getComputedStyle(element).getPropertyValue('--scroll-left').endsWith('px'), true);
    });
  });
});
