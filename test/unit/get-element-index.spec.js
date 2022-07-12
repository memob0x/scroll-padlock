import chai from 'chai';

import getElementIndex from '../../src/get-element-index';
import getJsdomWindow from '../utils/get-jsdom-window';

const { expect } = chai;

describe('src/get-element-index', () => {
  it('should be able to get a given element index in DOM tree', () => {
    const window = getJsdomWindow();

    const holder = window.document.createElement('div');

    const div1 = window.document.createElement('div');

    const div2 = window.document.createElement('div');

    const div3 = window.document.createElement('div');

    expect(getElementIndex(window.document.documentElement)).to.equals(0);

    expect(getElementIndex(holder)).to.equals(0);

    holder.prepend(div3);

    holder.prepend(div2);

    holder.prepend(div1);

    expect(getElementIndex(div1)).to.equals(0);

    expect(getElementIndex(div2)).to.equals(1);

    expect(getElementIndex(div3)).to.equals(2);
  });
});
