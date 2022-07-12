import chai from 'chai';

import getElementParentsLength from '../../src/get-element-parents-length';
import getJsdomWindow from '../utils/get-jsdom-window';

const { expect } = chai;

describe('src/get-element-parents-length', () => {
  it('should be able to count a given element parents', () => {
    const window = getJsdomWindow();

    // Expects html element to have no parents
    expect(getElementParentsLength(window.document.documentElement)).to.equals(0);

    // Expects body element to have one parent (html element)
    expect(getElementParentsLength(window.document.body)).to.equals(1);

    // Creates parent div
    const holder = window.document.createElement('div');

    // Expects holder to have no parents (since it's not part of the DOM)
    expect(getElementParentsLength(holder)).to.equals(0);

    // Creates children divs
    const div1 = window.document.createElement('div');
    const div2 = window.document.createElement('div');

    // Ensures the following structure: holder > div1 > div2
    div1.prepend(div2);
    holder.prepend(div1);

    // Expects div1 to have one parent (holder)
    expect(getElementParentsLength(div1)).to.equals(1);

    // Expects div2 to have two ancestors (div1 and holder)
    expect(getElementParentsLength(div2)).to.equals(2);
  });
});
