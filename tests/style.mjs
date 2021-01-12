import { DIMENSIONS_WIDTH_INNER, DIMENSIONS_HEIGHT_INNER, DIMENSIONS_HEIGHT_OUTER, DIMENSIONS_WIDTH_SCROLL, DIMENSIONS_HEIGHT_SCROLL, DIMENSIONS_WIDTH_OUTER } from '../src/dimensions.mjs';

import { SCROLL_TOP, SCROLL_LEFT } from '../src/scroll.mjs';

import { SCROLLBAR_WIDTH, SCROLLBAR_HEIGHT } from '../src/scrollbars.mjs';

import {
    DATA_ATTR_NAME,
    CSS_VAR_NAME_POSITION_LEFT,
    CSS_VAR_NAME_GAP_HORIZONTAL,
    CSS_VAR_NAME_GAP_VERTICAL,
    CSS_VAR_NAME_POSITION_TOP,
    setStyles,
    unsetStyles
} from '../src/style.mjs';

import { getElementParentsLength, getElementIndex } from '../src/utils.mjs';

describe('style', () => {
    const doc = document;
    const { head, body } = doc;

    const getCSSVariableValue = (element, variableName) => window.getComputedStyle(element).getPropertyValue(variableName).trim();

    const createElement = (tag = 'div') => doc.createElement(tag);

    const styler = createElement('style');
    const div = createElement();

    it('should be able to append a style tag with css variables for given values targeting a given element', () => {
        // NOTE: prepending because of karma scripts at the end of body (they would affect index detection)
        body.prepend(div);

        let scroll = { [SCROLL_TOP]: 0, [SCROLL_LEFT]: 0 };
        let scrollbar = { [SCROLLBAR_WIDTH]: 0, [SCROLLBAR_HEIGHT]: 0 };
        let dimensions = { [DIMENSIONS_WIDTH_OUTER]: 0, [DIMENSIONS_HEIGHT_OUTER]: 0, [DIMENSIONS_WIDTH_INNER]: 0, [DIMENSIONS_HEIGHT_INNER]: 0, [DIMENSIONS_WIDTH_SCROLL]: 0, [DIMENSIONS_HEIGHT_SCROLL]: 0 };

        expect(setStyles(div, styler, dimensions, scroll, scrollbar)).to.equals(styler);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll[SCROLL_TOP]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll[SCROLL_LEFT]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_VERTICAL)).to.equals(`${scrollbar[SCROLLBAR_WIDTH]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_HORIZONTAL)).to.equals(`${scrollbar[SCROLLBAR_HEIGHT]}px`);

        expect(head.contains(styler)).to.be.true;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        let attrValue = div.getAttribute(DATA_ATTR_NAME);

        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        expect(unsetStyles(div, styler)).to.equals(styler);

        expect(head.contains(styler)).to.be.false;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        scroll = { [SCROLL_TOP]: 123, [SCROLL_LEFT]: 345 };
        scrollbar = { [SCROLLBAR_WIDTH]: 567, [SCROLLBAR_HEIGHT]: 789 };
        dimensions = { [DIMENSIONS_WIDTH_OUTER]: 1111, [DIMENSIONS_HEIGHT_OUTER]: 1111, [DIMENSIONS_WIDTH_INNER]: 1111, [DIMENSIONS_HEIGHT_INNER]: 1111, [DIMENSIONS_WIDTH_SCROLL]: 1111, [DIMENSIONS_HEIGHT_SCROLL]: 1111 };

        const indexShifterDummyEl = createElement();

        // NOTE: prepending because of karma scripts at the end of body (they would affect index detection)
        body.prepend(indexShifterDummyEl);

        setStyles(div, styler, dimensions, scroll, scrollbar);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll[SCROLL_TOP]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll[SCROLL_LEFT]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_VERTICAL)).to.equals(`${scrollbar[SCROLLBAR_WIDTH]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_GAP_HORIZONTAL)).to.equals(`${scrollbar[SCROLLBAR_HEIGHT]}px`);

        let oldAttrValue = attrValue;
        attrValue = div.getAttribute(DATA_ATTR_NAME);

        expect(attrValue).not.to.equals(oldAttrValue);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        unsetStyles(div, styler);

        indexShifterDummyEl.remove();
        div.remove();
    });
});
