import 'jsdom-global/register';

import chai from 'chai';

import {
  STR_CAMEL_SCROLLBAR_WIDTH,
  STR_CAMEL_SCROLLBAR_HEIGHT,
  STR_CAMEL_OUTER_WIDTH,
  STR_CAMEL_INNER_WIDTH,
  STR_CAMEL_SCROLL_WIDTH,
  STR_CAMEL_OUTER_HEIGHT,
  STR_CAMEL_INNER_HEIGHT,
  STR_CAMEL_SCROLL_HEIGHT,
} from '../../src/constants-computed';

import getLayout from '../../src/get-layout-dimensions';

const { expect } = chai;

describe('src/get-layout-dimensions', () => {
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
      [STR_CAMEL_OUTER_WIDTH]: mockedDiv.getBoundingClientRect().width,
      [STR_CAMEL_OUTER_HEIGHT]: mockedDiv.getBoundingClientRect().height,

      [STR_CAMEL_INNER_WIDTH]: mockedDiv.clientWidth,
      [STR_CAMEL_INNER_HEIGHT]: mockedDiv.clientHeight,

      [STR_CAMEL_SCROLL_WIDTH]: mockedDiv.scrollWidth,
      [STR_CAMEL_SCROLL_HEIGHT]: mockedDiv.scrollHeight,

      [STR_CAMEL_SCROLLBAR_WIDTH]: mockedDiv.getBoundingClientRect().width
        - mockedDiv.clientWidth,
      [STR_CAMEL_SCROLLBAR_HEIGHT]: mockedDiv.getBoundingClientRect().height
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
      [STR_CAMEL_OUTER_WIDTH]: mockedWindow.innerWidth,
      [STR_CAMEL_OUTER_HEIGHT]: mockedWindow.innerHeight,

      [STR_CAMEL_INNER_WIDTH]: mockedDocumentElement.clientWidth,
      [STR_CAMEL_INNER_HEIGHT]: mockedDocumentElement.clientHeight,

      [STR_CAMEL_SCROLL_WIDTH]: mockedDocumentElement.scrollWidth,
      [STR_CAMEL_SCROLL_HEIGHT]: mockedDocumentElement.scrollHeight,

      [STR_CAMEL_SCROLLBAR_WIDTH]: mockedWindow.innerWidth - mockedDocumentElement.clientWidth,
      [STR_CAMEL_SCROLLBAR_HEIGHT]: mockedWindow.innerHeight - mockedDocumentElement.clientHeight,
    });
  });
});
