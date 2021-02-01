import {
    LAYOUT_SCROLLBAR_HEIGHT,
    LAYOUT_SCROLLBAR_WIDTH,
    LAYOUT_WIDTH_INNER,
    LAYOUT_HEIGHT_INNER,
    LAYOUT_HEIGHT_OUTER,
    LAYOUT_WIDTH_SCROLL,
    LAYOUT_HEIGHT_SCROLL,
    LAYOUT_WIDTH_OUTER
} from '../src/layout.mjs';

import { SCROLL_TOP, SCROLL_LEFT } from '../src/scroll.mjs';

import {
    DATA_ATTR_NAME,
    CSS_VAR_NAME_POSITION_LEFT,
    CSS_VAR_NAME_SCROLLBAR_HEIGHT,
    CSS_VAR_NAME_SCROLLBAR_WIDTH,
    CSS_VAR_NAME_POSITION_TOP,
    setStyles,
    unsetStyles
} from '../src/style.mjs';

import { getElementParentsLength, getElementIndex } from '../src/utils.mjs';

import { head, body, createElement, createDiv, getCSSVariableValue } from './_test-utils.mjs';

describe('style', () => {
    const styler = createElement('style');
    const div = createDiv();

    it('should be able to append a style tag with css variables for given values targeting a given element', () => {
        // NOTE: prepending because of karma scripts at the end of body (they would affect index detection)
        body.prepend(div);

        let scroll = { [SCROLL_TOP]: 0, [SCROLL_LEFT]: 0 };

        let layout = {
            [LAYOUT_SCROLLBAR_WIDTH]: 0,
            [LAYOUT_SCROLLBAR_HEIGHT]: 0,
            [LAYOUT_WIDTH_OUTER]: 0,
            [LAYOUT_HEIGHT_OUTER]: 0,
            [LAYOUT_WIDTH_INNER]: 0,
            [LAYOUT_HEIGHT_INNER]: 0,
            [LAYOUT_WIDTH_SCROLL]: 0,
            [LAYOUT_HEIGHT_SCROLL]: 0
        };

        expect(setStyles(div, styler, layout, scroll)).to.equals(styler);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll[SCROLL_TOP]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll[SCROLL_LEFT]}px`);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_SCROLLBAR_WIDTH)).to.equals(`${layout[LAYOUT_SCROLLBAR_WIDTH]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_SCROLLBAR_HEIGHT)).to.equals(`${layout[LAYOUT_SCROLLBAR_HEIGHT]}px`);

        expect(head.contains(styler)).to.be.true;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        let attrValue = div.getAttribute(DATA_ATTR_NAME);

        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        expect(unsetStyles(div, styler)).to.equals(styler);

        expect(head.contains(styler)).to.be.false;

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        scroll = { [SCROLL_TOP]: 123, [SCROLL_LEFT]: 345 };

        layout = {
            [LAYOUT_WIDTH_OUTER]: 1234,
            [LAYOUT_HEIGHT_OUTER]: 4325,
            [LAYOUT_WIDTH_INNER]: 6542,
            [LAYOUT_HEIGHT_INNER]: 5364,
            [LAYOUT_WIDTH_SCROLL]: 3464,
            [LAYOUT_HEIGHT_SCROLL]: 5675,
            [LAYOUT_SCROLLBAR_HEIGHT]: 22,
            [LAYOUT_SCROLLBAR_WIDTH]: 33
        };

        const indexShifterDummyEl = createDiv();

        // NOTE: prepending because of karma scripts at the end of body (they would affect index detection)
        body.prepend(indexShifterDummyEl);

        setStyles(div, styler, layout, scroll);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_TOP)).to.equals(`${scroll[SCROLL_TOP]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_POSITION_LEFT)).to.equals(`${scroll[SCROLL_LEFT]}px`);

        expect(getCSSVariableValue(div, CSS_VAR_NAME_SCROLLBAR_WIDTH)).to.equals(`${layout[LAYOUT_SCROLLBAR_WIDTH]}px`);
        expect(getCSSVariableValue(div, CSS_VAR_NAME_SCROLLBAR_HEIGHT)).to.equals(`${layout[LAYOUT_SCROLLBAR_HEIGHT]}px`);

        let oldAttrValue = attrValue;
        attrValue = div.getAttribute(DATA_ATTR_NAME);

        expect(attrValue).not.to.equals(oldAttrValue);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        unsetStyles(div, styler);

        indexShifterDummyEl.remove();
        div.remove();
    });
});
