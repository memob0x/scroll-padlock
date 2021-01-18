import { SCROLL_TOP, SCROLL_LEFT, getScroll } from '../src/scroll.mjs';

import { body, createDiv } from './_tests.mjs';

describe('scroll', () => {
    let expander;

    beforeEach(() => {
        expander = createDiv();

        const styles = expander.style;

        styles.width = styles.height = '2000px';
    });

    afterEach(() => expander.remove());

    it('should be able to get an element scroll position', () => {
        const div = createDiv();

        const styles = div.style;

        styles.maxWidth = styles.maxHeight = '100px';
        styles.overflow = 'scroll';

        div.append(expander);

        body.append(div);

        expect(getScroll(div)).to.deep.equals({ [SCROLL_TOP]: 0, [SCROLL_LEFT]: 0 });

        const newPosition = { [SCROLL_TOP]: 123, [SCROLL_LEFT]: 345 };

        div.scrollTo(newPosition[SCROLL_LEFT], newPosition[SCROLL_TOP]);

        expect(getScroll(div)).to.deep.equals(newPosition);

        div.remove();
    });

    it('should be able to get the page scroll position', () => {
        window.scrollTo(0, 0);

        body.append(expander);

        expect(getScroll(window)).to.deep.equals({ [SCROLL_TOP]: 0, [SCROLL_LEFT]: 0 });

        const newPosition = { [SCROLL_TOP]: 123, [SCROLL_LEFT]: 345 };

        window.scrollTo(newPosition[SCROLL_LEFT], newPosition[SCROLL_TOP]);

        expect(getScroll(window)).to.deep.equals(newPosition);
        
        window.scrollTo(0, 0);
    });
});
