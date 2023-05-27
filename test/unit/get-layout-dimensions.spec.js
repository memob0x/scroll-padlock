import { describe, it } from 'node:test';
import chai from 'chai';

import getLayout from '../../src/get-layout-dimensions.js';

const { expect } = chai;

describe('src/get-layout-dimensions', () => {
  it('should not throw with given invalid arguments', () => {
    expect(getLayout())
      .to.deep.equals(getLayout(null))
      .to.deep.equals(getLayout(null, null))
      .to.deep.equals({
        outerWidth: 0,
        outerHeight: 0,

        innerWidth: 0,
        innerHeight: 0,

        scrollWidth: 0,
        scrollHeight: 0,

        scrollbarWidth: 0,
        scrollbarHeight: 0,
      });
  });

  it('should be able to retrieve html elements dimensions', () => {
    const mockedDiv = {
      clientWidth: 10,
      clientHeight: 20,
      scrollWidth: 50,
      scrollHeight: 60,

      getBoundingClientRect: () => ({
        width: 30,
        height: 40,
      }),
    };

    expect(getLayout(mockedDiv, mockedDiv)).to.deep.equals({
      outerWidth: mockedDiv.getBoundingClientRect().width,
      outerHeight: mockedDiv.getBoundingClientRect().height,

      innerWidth: mockedDiv.clientWidth,
      innerHeight: mockedDiv.clientHeight,

      scrollWidth: mockedDiv.scrollWidth,
      scrollHeight: mockedDiv.scrollHeight,

      scrollbarWidth: mockedDiv.getBoundingClientRect().width
        - mockedDiv.clientWidth,
      scrollbarHeight: mockedDiv.getBoundingClientRect().height
        - mockedDiv.clientHeight,
    });
  });

  it('should be able to detect page dimensions', () => {
    const mockedWindow = {
      innerWidth: 30,
      innerHeight: 40,
    };

    const mockedDocumentElement = {
      clientWidth: 10,
      clientHeight: 20,
      scrollWidth: 50,
      scrollHeight: 60,
    };

    expect(getLayout(mockedDocumentElement, mockedWindow)).to.deep.equals({
      outerWidth: mockedWindow.innerWidth,
      outerHeight: mockedWindow.innerHeight,

      innerWidth: mockedDocumentElement.clientWidth,
      innerHeight: mockedDocumentElement.clientHeight,

      scrollWidth: mockedDocumentElement.scrollWidth,
      scrollHeight: mockedDocumentElement.scrollHeight,

      scrollbarWidth: mockedWindow.innerWidth - mockedDocumentElement.clientWidth,
      scrollbarHeight: mockedWindow.innerHeight - mockedDocumentElement.clientHeight,
    });
  });
});
