import { SCROLL_TOP, SCROLL_LEFT, getScroll } from '../src/scroll.mjs';

describe('scroll', () => {
    const doc = document;
    const { body } = doc;

    const createDummy = () => doc.createElement('div');

    let expander;

    beforeEach(() => {
        expander = createDummy();

        const styles = expander.style;

        styles.width = styles.height = '2000px';
    });

    afterEach(() => expander.remove());

    it('should be able to get an element scroll position', () => {
        const div = createDummy();

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
        body.append(expander);

        expect(getScroll(window)).to.deep.equals({ [SCROLL_TOP]: 0, [SCROLL_LEFT]: 0 });

        const newPosition = { [SCROLL_TOP]: 123, [SCROLL_LEFT]: 345 };

        window.scrollTo(newPosition[SCROLL_LEFT], newPosition[SCROLL_TOP]);

        expect(getScroll(window)).to.deep.equals(newPosition);
    });
});
