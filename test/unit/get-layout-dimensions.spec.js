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
} from '../../src/constants.js';

import getLayout from '../../src/get-layout-dimensions.js';

const { expect } = chai;

describe('get-layout-dimensions', () => {
    it('should be able to retrieve html elements dimensions', () => {
        const mockedDiv = {
            clientWidth: 10,
            clientHeight: 20,
            scrollWidth: 50,
            scrollHeight: 60,

            getBoundingClientRect: () => ({
                width: 30,
                height: 40
            })
        };

        expect(getLayout(mockedDiv, mockedDiv)).to.deep.equals({
            [OUTER_WIDTH]: mockedDiv.getBoundingClientRect().width,
            [OUTER_HEIGHT]: mockedDiv.getBoundingClientRect().height,

            [INNER_WIDTH]: mockedDiv.clientWidth,
            [INNER_HEIGHT]: mockedDiv.clientHeight,

            [SCROLL_WIDTH]: mockedDiv.scrollWidth,
            [SCROLL_HEIGHT]: mockedDiv.scrollHeight,

            [SCROLLBAR_WIDTH]: mockedDiv.getBoundingClientRect().width - mockedDiv.clientWidth,
            [SCROLLBAR_HEIGHT]: mockedDiv.getBoundingClientRect().height - mockedDiv.clientHeight
        });
    });

    it('should be able to detect page dimensions', () => {
        const mockedWindow = {
            innerWidth: 30,
            innerHeight: 40
        };

        const mockedDocumentElement = {
            clientWidth: 10,
            clientHeight: 20,
            scrollWidth: 50,
            scrollHeight: 60
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
