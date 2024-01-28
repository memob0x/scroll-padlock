import { describe, it } from 'node:test';
import assert from 'node:assert';
import getLayout from '../../src/get-layout-dimensions.js';

describe(getLayout.name, () => {
  it('should not throw with given invalid arguments', () => {
    assert.deepEqual(getLayout(), getLayout(null));

    assert.deepEqual(getLayout(), getLayout(null, null));

    assert.deepEqual(getLayout(), {
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

    assert.deepEqual(getLayout(mockedDiv, mockedDiv), {
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

    assert.deepEqual(getLayout(mockedDocumentElement, mockedWindow), {
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
