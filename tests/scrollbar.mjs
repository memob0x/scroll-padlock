import { DEFAULT_SCROLLBAR, getScrollbarsGaps } from '../src/scrollbar.mjs';

describe('scrollbar', () => {
    const doc = document;
    const body = doc.body;
    const html = doc.documentElement;

    const SCROLLBAR_SIZE = 20;

    const style = doc.createElement('style');

    before(() => {
        doc.head.append(style);

        style.sheet.insertRule(`::-webkit-scrollbar { width: ${SCROLLBAR_SIZE}px; height: ${SCROLLBAR_SIZE}px; }`);
    });

    after(() => (style.remove()));

    it('should be able to get a given element scrollbars width', () => {      
        const div = doc.createElement('div');

        const styles = div.style;

        styles.width = styles.height = '100px';

        body.append(div);

        styles.overflow = 'hidden';

        expect(JSON.stringify(getScrollbarsGaps(div, div))).to.be.equals(JSON.stringify(DEFAULT_SCROLLBAR));

        styles.overflow = 'scroll';

        expect(JSON.stringify(getScrollbarsGaps(div, div))).to.be.equals(JSON.stringify({ horizontal: SCROLLBAR_SIZE, vertical: SCROLLBAR_SIZE }));
        
        div.remove();
    });
    
    it('should be able to get body scrollbars width', () => {  
        const styles = body.style;
        
        styles.overflow = 'hidden';
        
        expect(JSON.stringify(getScrollbarsGaps(html, window))).to.be.equals(JSON.stringify(DEFAULT_SCROLLBAR));
        
        styles.overflow = 'scroll';
        
        expect(JSON.stringify(getScrollbarsGaps(html, window))).to.be.equals(JSON.stringify({ horizontal: SCROLLBAR_SIZE, vertical: SCROLLBAR_SIZE }));

        styles.overflow = '';
    });
});
