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
} from '../src/layout.mjs';

describe('layout', () => {
    const doc = document;
    const { head, body, documentElement } = doc;

    const SCROLLBAR_SIZE = 20;

    const styler = doc.createElement('style');

    before(() => {
        head.append(styler);

        styler.sheet.insertRule(`::-webkit-scrollbar { width: ${SCROLLBAR_SIZE}px; height: ${SCROLLBAR_SIZE}px; }`);
    });

    after(() => (styler.remove()));

    it('should be able to retrieve html elements dimensions', () => {
        const div = doc.createElement('div');

        body.append(div);

        const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = div;

        expect(getLayout(div, div)).to.include({
            [LAYOUT_WIDTH_OUTER]: offsetWidth,
            [LAYOUT_HEIGHT_OUTER]: offsetHeight,

            [LAYOUT_WIDTH_INNER]: clientWidth,
            [LAYOUT_HEIGHT_INNER]: clientHeight,

            [LAYOUT_WIDTH_SCROLL]: scrollWidth,
            [LAYOUT_HEIGHT_SCROLL]: scrollHeight
        });

        div.remove();
    });

    it('should be able to detect page dimensions', () => {
        const { innerWidth, innerHeight } = window;
        const { clientWidth, clientHeight, scrollWidth, scrollHeight } = documentElement;

        expect(getLayout(documentElement, window)).to.include({
            [LAYOUT_WIDTH_OUTER]: innerWidth,
            [LAYOUT_HEIGHT_OUTER]: innerHeight,

            [LAYOUT_WIDTH_INNER]: clientWidth,
            [LAYOUT_HEIGHT_INNER]: clientHeight,

            [LAYOUT_WIDTH_SCROLL]: scrollWidth,
            [LAYOUT_HEIGHT_SCROLL]: scrollHeight
        });
    });

    it('should be able to get a given element scrollbars width', () => {
        const div = doc.createElement('div');

        const { style } = div;

        style.width = style.height = '100px';

        body.append(div);

        style.overflow = 'hidden';

        expect(getLayout(div, div)).to.include({
            [LAYOUT_SCROLLBAR_HEIGHT]: 0,
            [LAYOUT_SCROLLBAR_WIDTH]: 0
        });

        style.overflow = 'scroll';

        expect(getLayout(div, div)).to.include({
            [LAYOUT_SCROLLBAR_HEIGHT]: SCROLLBAR_SIZE,
            [LAYOUT_SCROLLBAR_WIDTH]: SCROLLBAR_SIZE
        });

        div.remove();
    });

    it('should be able to get body scrollbars width', () => {
        const { style } = body;

        style.overflow = 'hidden';

        expect(getLayout(documentElement, window)).to.include({
            [LAYOUT_SCROLLBAR_HEIGHT]: 0,
            [LAYOUT_SCROLLBAR_WIDTH]: 0
        });

        style.overflow = 'scroll';

        expect(getLayout(documentElement, window)).to.include({
            [LAYOUT_SCROLLBAR_HEIGHT]: SCROLLBAR_SIZE,
            [LAYOUT_SCROLLBAR_WIDTH]: SCROLLBAR_SIZE
        });

        style.overflow = '';
    });
});
