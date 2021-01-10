import { getScrollPosition, scrollTo } from '../src/scroll.mjs';

describe('scroll', () => {
    const doc = document;
    const body = doc.body;
    
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

        expect(JSON.stringify(getScrollPosition(div))).to.equals(JSON.stringify({ top: 0, left: 0 }));

        const newPosition = { top: 123, left: 345 };

        scrollTo(div, newPosition);
    
        expect(JSON.stringify(getScrollPosition(div))).to.equals(JSON.stringify(newPosition));

        div.remove();
    });

    it('should be able to get the page scroll position', () => {
        body.append(expander);

        expect(JSON.stringify(getScrollPosition(window))).to.equals(JSON.stringify({ top: 0, left: 0 }));

        const newPosition = { top: 123, left: 345 };

        scrollTo(window, newPosition);
    
        expect(JSON.stringify(getScrollPosition(window))).to.equals(JSON.stringify(newPosition));
    });
});
