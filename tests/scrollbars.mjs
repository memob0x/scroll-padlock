import { SCROLLBAR_WIDTH, SCROLLBAR_HEIGHT, getScrollbars } from '../src/scrollbars.mjs';

import { getDimensions } from '../src/dimensions.mjs';

describe('scrollbars', () => {
    const doc = document;
    const { head, body, documentElement } = doc;

    const SCROLLBAR_SIZE = 20;

    const styler = doc.createElement('style');

    before(() => {
        head.append(styler);

        styler.sheet.insertRule(`::-webkit-scrollbar { width: ${SCROLLBAR_SIZE}px; height: ${SCROLLBAR_SIZE}px; }`);
    });

    after(() => (styler.remove()));

    it('should be able to get a given element scrollbars width', () => {      
        const div = doc.createElement('div');

        const { style } = div;

        style.width = style.height = '100px';

        body.append(div);

        style.overflow = 'hidden';

        expect(getScrollbars(getDimensions(div, div))).to.be.deep.equals({ [SCROLLBAR_HEIGHT]: 0, [SCROLLBAR_WIDTH]: 0 });

        style.overflow = 'scroll';

        expect(getScrollbars(getDimensions(div, div))).to.be.deep.equals({ [SCROLLBAR_HEIGHT]: SCROLLBAR_SIZE, [SCROLLBAR_WIDTH]: SCROLLBAR_SIZE });
        
        div.remove();
    });
    
    it('should be able to get body scrollbars width', () => {  
        const { style } = body;
        
        style.overflow = 'hidden';
        
        expect(getScrollbars(getDimensions(documentElement, window))).to.be.deep.equals({ [SCROLLBAR_HEIGHT]: 0, [SCROLLBAR_WIDTH]: 0 });
        
        style.overflow = 'scroll';
        
        expect(getScrollbars(getDimensions(documentElement, window))).to.be.deep.equals({ [SCROLLBAR_HEIGHT]: SCROLLBAR_SIZE, [SCROLLBAR_WIDTH]: SCROLLBAR_SIZE });

        style.overflow = '';
    });
});
