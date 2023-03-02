import chai from 'chai';

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
