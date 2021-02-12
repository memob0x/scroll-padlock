import 'jsdom-global/register.js';

import chai from 'chai';

import {
    SCROLLBAR_WIDTH,
    SCROLLBAR_HEIGHT,
    OUTER_WIDTH,
    INNER_WIDTH,
    SCROLL_WIDTH,
    OUTER_HEIGHT,
    INNER_HEIGHT,
    SCROLL_HEIGHT
} from '../../src/constants.mjs';

import getLayout from '../../src/get-layout-dimensions.mjs';

const { expect } = chai;

describe('get-layout-dimensions', () => {
    it('should be able to retrieve html elements dimensions', () => {
        const mockedDiv = {
            offsetWidth: 1,
            offsetHeight: 2,
            clientWidth: 3,
            clientHeight: 4,
            scrollWidth: 5,
            scrollHeight: 6,

            getBoundingClientRect: () => ({
                width: 1,
                height: 2
            })
        };

        expect(getLayout(mockedDiv, mockedDiv)).to.deep.equals({
            [OUTER_WIDTH]: mockedDiv.offsetWidth,
            [OUTER_HEIGHT]: mockedDiv.offsetHeight,

            [INNER_WIDTH]: mockedDiv.clientWidth,
            [INNER_HEIGHT]: mockedDiv.clientHeight,

            [SCROLL_WIDTH]: mockedDiv.scrollWidth,
            [SCROLL_HEIGHT]: mockedDiv.scrollHeight,

            [SCROLLBAR_WIDTH]: mockedDiv.offsetWidth - mockedDiv.clientWidth,
            [SCROLLBAR_HEIGHT]: mockedDiv.offsetHeight - mockedDiv.clientHeight
        });
    });

    it('should be able to detect page dimensions', () => {
        const mockedWindow = {
            innerWidth: 1,
            innerHeight: 2
        };

        const mockedDocumentElement = {
            clientWidth: 3,
            clientHeight: 4,
            scrollWidth: 5,
            scrollHeight: 6
        };

        expect(getLayout(mockedDocumentElement, mockedWindow)).to.deep.equals({
            [OUTER_WIDTH]: mockedWindow.innerWidth,
            [OUTER_HEIGHT]: mockedWindow.innerHeight,

            [INNER_WIDTH]: mockedDocumentElement.clientWidth,
            [INNER_HEIGHT]: mockedDocumentElement.clientHeight,

            [SCROLL_WIDTH]: mockedDocumentElement.scrollWidth,
            [SCROLL_HEIGHT]: mockedDocumentElement.scrollHeight,

            [SCROLLBAR_WIDTH]: mockedWindow.innerWidth - mockedDocumentElement.clientWidth,
            [SCROLLBAR_HEIGHT]: mockedWindow.innerHeight - mockedDocumentElement.clientHeight
        });
    });
});
