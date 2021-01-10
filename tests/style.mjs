import {
    DATA_ATTR_NAME,
    CSS_VAR_NAME_POSITION_LEFT,
    CSS_VAR_NAME_GAP_HORIZONTAL,
    CSS_VAR_NAME_GAP_VERTICAL,
    CSS_VAR_NAME_POSITION_TOP,
    setStyles,
    unsetStyles
} from '../src/style.mjs';

describe('style', () => {
    const doc = document;
    const head = doc.head;

    const getCSSVariableValue = (element, variableName) => window.getComputedStyle(element).getPropertyValue(variableName).trim();

    const createElement = tag => doc.createElement(tag);

    const styler = createElement('style');
    const div = createElement('div');

    it('should be able to append a style tag with css variables for given values targeting a given element', async () => {
        document.body.append(div);

        let scroll = { top: 0, left: 0 };
        let scrollbar = { vertical: 0, horizontal: 0 };

        expect(setStyles(div, styler, scroll, scrollbar)).to.equals(styler);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll.top}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll.top}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_VERTICAL)).to.equals(`${scrollbar.vertical}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_HORIZONTAL)).to.equals(`${scrollbar.horizontal}px`);

        expect(head.contains(styler)).to.be.true;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        const attrVal = div.getAttribute(DATA_ATTR_NAME);

        expect(unsetStyles(div, styler)).to.equals(styler);

        expect(head.contains(styler)).to.be.false;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        await new Promise(resolve => setTimeout(resolve, 1000));

        scroll = { top: 123, left: 345 };
        scrollbar = { vertical: 567, horizontal: 789 };

        setStyles(div, styler, scroll, scrollbar);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll.top}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll.left}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_VERTICAL)).to.equals(`${scrollbar.vertical}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_HORIZONTAL)).to.equals(`${scrollbar.horizontal}px`);

        expect(attrVal).to.not.equals(div.getAttribute(DATA_ATTR_NAME));

        unsetStyles(div, styler);

        div.remove();
    });
});
