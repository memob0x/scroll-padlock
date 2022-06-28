import 'jsdom-global/register';

import { expect } from 'chai';
import isValidPadlockElement from '../../src/is-valid-padlock-element';

describe('src/is-valid-padlock-element', () => {
  it('should be able to detect valid (non-global) dom scroll-padlock elements', () => {
    expect(() => isValidPadlockElement()).to.not.throw(TypeError);
    expect(isValidPadlockElement()).to.be.false;

    expect(() => isValidPadlockElement(null)).to.throw(TypeError);

    expect(isValidPadlockElement(document.createElement('div'))).to.be.true;

    const win = window;

    const {
      documentElement,

      body,
    } = window;

    const client = {
      win,

      documentElement,

      body,
    };

    expect(() => isValidPadlockElement({ ...win })).to.throw();

    expect(isValidPadlockElement(win, client)).to.be.false;

    expect(isValidPadlockElement(documentElement, client)).to.be.false;

    expect(isValidPadlockElement(body, client)).to.be.false;
  });
});
