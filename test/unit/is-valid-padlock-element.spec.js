import { expect } from 'chai';
import isValidPadlockElement from '../../src/is-valid-padlock-element';
import getJsdomWindow from '../utils/get-jsdom-window';

describe('src/is-valid-padlock-element', () => {
  const window = getJsdomWindow();

  it('should be able to detect valid (non-global) dom scroll-padlock elements', () => {
    expect(() => isValidPadlockElement(undefined, window)).to.not.throw(TypeError);
    expect(isValidPadlockElement(undefined, window)).to.be.false;

    expect(() => isValidPadlockElement(null, window)).to.throw(TypeError);

    expect(isValidPadlockElement(window.document.createElement('div'), window)).to.be.true;

    const {
      document,
    } = window || {};

    const {
      body,

      documentElement,
    } = document || {};

    expect(() => isValidPadlockElement({ ...window }, window)).to.throw();

    expect(isValidPadlockElement(window, window)).to.be.false;

    expect(isValidPadlockElement(document, window)).to.be.false;

    expect(isValidPadlockElement(documentElement, window)).to.be.false;

    expect(isValidPadlockElement(body, window)).to.be.false;
  });
});
