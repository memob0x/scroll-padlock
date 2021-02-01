import 'jsdom-global/register.js';

import chai from 'chai';

import {
    LAYOUT_SCROLLBAR_WIDTH,
    LAYOUT_SCROLLBAR_HEIGHT,
    LAYOUT_WIDTH_OUTER,
    LAYOUT_WIDTH_INNER,
    LAYOUT_WIDTH_SCROLL,
    LAYOUT_HEIGHT_OUTER,
    LAYOUT_HEIGHT_INNER,
    LAYOUT_HEIGHT_SCROLL,
    getLayout
} from '../../src/layout.mjs';

const { expect } = chai;

describe('layout', () => {
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
            [LAYOUT_WIDTH_OUTER]: mockedDiv.offsetWidth,
            [LAYOUT_HEIGHT_OUTER]: mockedDiv.offsetHeight,

            [LAYOUT_WIDTH_INNER]: mockedDiv.clientWidth,
            [LAYOUT_HEIGHT_INNER]: mockedDiv.clientHeight,

            [LAYOUT_WIDTH_SCROLL]: mockedDiv.scrollWidth,
            [LAYOUT_HEIGHT_SCROLL]: mockedDiv.scrollHeight,

            [LAYOUT_SCROLLBAR_WIDTH]: mockedDiv.offsetWidth - mockedDiv.clientWidth,
            [LAYOUT_SCROLLBAR_HEIGHT]: mockedDiv.offsetHeight - mockedDiv.clientHeight
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
            [LAYOUT_WIDTH_OUTER]: mockedWindow.innerWidth,
            [LAYOUT_HEIGHT_OUTER]: mockedWindow.innerHeight,

            [LAYOUT_WIDTH_INNER]: mockedDocumentElement.clientWidth,
            [LAYOUT_HEIGHT_INNER]: mockedDocumentElement.clientHeight,

            [LAYOUT_WIDTH_SCROLL]: mockedDocumentElement.scrollWidth,
            [LAYOUT_HEIGHT_SCROLL]: mockedDocumentElement.scrollHeight,

            [LAYOUT_SCROLLBAR_WIDTH]: mockedWindow.innerWidth - mockedDocumentElement.clientWidth,
            [LAYOUT_SCROLLBAR_HEIGHT]: mockedWindow.innerHeight - mockedDocumentElement.clientHeight
        });
    });
});
