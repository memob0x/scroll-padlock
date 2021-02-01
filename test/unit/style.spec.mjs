import 'jsdom-global/register.js';

import chai from 'chai';

import {
    DATA_ATTR_NAME,
    CSS_VAR_NAME_POSITION_TOP,
    CSS_VAR_NAME_POSITION_LEFT,
    CSS_VAR_NAME_WIDTH_OUTER,
    CSS_VAR_NAME_HEIGHT_OUTER,
    CSS_VAR_NAME_WIDTH_INNER,
    CSS_VAR_NAME_HEIGHT_INNER,
    CSS_VAR_NAME_WIDTH_SCROLL,
    CSS_VAR_NAME_HEIGHT_SCROLL,
    CSS_VAR_NAME_SCROLLBAR_WIDTH,
    CSS_VAR_NAME_SCROLLBAR_HEIGHT,
    setStyles,
    unsetStyles
} from '../../src/style.mjs';

import {
    LAYOUT_WIDTH_SCROLL,
    LAYOUT_WIDTH_OUTER,
    LAYOUT_HEIGHT_OUTER,
    LAYOUT_WIDTH_INNER,
    LAYOUT_HEIGHT_INNER,
    LAYOUT_HEIGHT_SCROLL,
    LAYOUT_SCROLLBAR_WIDTH,
    LAYOUT_SCROLLBAR_HEIGHT
} from '../../src/layout.mjs';

import { getElementParentsLength, getElementIndex } from '../../src/utils.mjs';

import {
    SCROLL_TOP,
    SCROLL_LEFT
} from '../../src/scroll.mjs';

const { expect } = chai;

describe('style', () => {
    const styler = document.createElement('style');
    const div = document.createElement('div');

    it('should be able to append a style tag with css variables for given values targeting a given element', () => {
        document.body.prepend(div);

        let layout = {
            [LAYOUT_WIDTH_SCROLL]: 1,
            [LAYOUT_WIDTH_OUTER]: 2,
            [LAYOUT_HEIGHT_OUTER]: 3,
            [LAYOUT_WIDTH_INNER]: 4,
            [LAYOUT_HEIGHT_INNER]: 5,
            [LAYOUT_HEIGHT_SCROLL]: 6,
            [LAYOUT_SCROLLBAR_WIDTH]: 7,
            [LAYOUT_SCROLLBAR_HEIGHT]: 8
        };
        let scroll = {         
            [SCROLL_TOP]: 9,
            [SCROLL_LEFT]: 10
        };

        expect(setStyles(div, styler, layout, scroll)).to.equals(styler);
        expect(document.head.contains(styler)).to.be.true;
        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        let attrValue = div.getAttribute(DATA_ATTR_NAME);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        let rules = styler.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DATA_ATTR_NAME}="${attrValue}"]`);
        
        expect(rules.style).to.have.property(CSS_VAR_NAME_POSITION_TOP).that.is.equal(`${scroll[SCROLL_TOP]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_POSITION_LEFT).that.is.equal(`${scroll[SCROLL_LEFT]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_OUTER).that.is.equal(`${layout[LAYOUT_WIDTH_OUTER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_OUTER).that.is.equal(`${layout[LAYOUT_HEIGHT_OUTER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_INNER).that.is.equal(`${layout[LAYOUT_WIDTH_INNER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_INNER).that.is.equal(`${layout[LAYOUT_HEIGHT_INNER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_SCROLL).that.is.equal(`${layout[LAYOUT_WIDTH_SCROLL]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_SCROLL).that.is.equal(`${layout[LAYOUT_HEIGHT_SCROLL]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_SCROLLBAR_WIDTH).that.is.equal(`${layout[LAYOUT_SCROLLBAR_WIDTH]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_SCROLLBAR_HEIGHT).that.is.equal(`${layout[LAYOUT_SCROLLBAR_HEIGHT]}px`);

        expect(unsetStyles(div, styler)).to.equals(styler);
        expect(document.head.contains(styler)).to.be.false;
        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        const indexShifterDummyEl = document.createElement('div');

        document.body.prepend(indexShifterDummyEl);

        layout = {
            [LAYOUT_WIDTH_SCROLL]: 10,
            [LAYOUT_WIDTH_OUTER]: 20,
            [LAYOUT_HEIGHT_OUTER]: 30,
            [LAYOUT_WIDTH_INNER]: 40,
            [LAYOUT_HEIGHT_INNER]: 50,
            [LAYOUT_HEIGHT_SCROLL]: 60,
            [LAYOUT_SCROLLBAR_WIDTH]: 70,
            [LAYOUT_SCROLLBAR_HEIGHT]: 80
        };
        scroll = {         
            [SCROLL_TOP]: 90,
            [SCROLL_LEFT]: 100
        };

        setStyles(div, styler, layout, scroll);

        let oldAttrValue = attrValue;
        attrValue = div.getAttribute(DATA_ATTR_NAME);
        expect(attrValue).not.to.equals(oldAttrValue);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);
        
        rules = styler.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DATA_ATTR_NAME}="${attrValue}"]`);
        
        expect(rules.style).to.have.property(CSS_VAR_NAME_POSITION_TOP).that.is.equal(`${scroll[SCROLL_TOP]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_POSITION_LEFT).that.is.equal(`${scroll[SCROLL_LEFT]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_OUTER).that.is.equal(`${layout[LAYOUT_WIDTH_OUTER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_OUTER).that.is.equal(`${layout[LAYOUT_HEIGHT_OUTER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_INNER).that.is.equal(`${layout[LAYOUT_WIDTH_INNER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_INNER).that.is.equal(`${layout[LAYOUT_HEIGHT_INNER]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_WIDTH_SCROLL).that.is.equal(`${layout[LAYOUT_WIDTH_SCROLL]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_HEIGHT_SCROLL).that.is.equal(`${layout[LAYOUT_HEIGHT_SCROLL]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_SCROLLBAR_WIDTH).that.is.equal(`${layout[LAYOUT_SCROLLBAR_WIDTH]}px`);
        expect(rules.style).to.have.property(CSS_VAR_NAME_SCROLLBAR_HEIGHT).that.is.equal(`${layout[LAYOUT_SCROLLBAR_HEIGHT]}px`);

        unsetStyles(div, styler);

        indexShifterDummyEl.remove();
        div.remove();
    });
});
