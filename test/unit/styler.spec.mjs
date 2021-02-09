import 'jsdom-global/register.js';

import chai from 'chai';

import { DATA_ATTR_NAME, STYLER_METHOD_ADD, STYLER_METHOD_REMOVE } from '../../src/constants.mjs';

import styler from '../../src/styler.mjs';

import getElementParentsLength from '../../src/get-element-parents-length.mjs';
import getElementIndex from '../../src/get-element-index.mjs';

const { expect } = chai;

describe('styler', () => {
    it('should be able to append a style tag with css variables for given values targeting a given element', () => {
        const style = document.createElement('style');
        const div = document.createElement('div');
        const holder = document.createElement('div');

        holder.prepend(div);

        expect(styler(STYLER_METHOD_ADD, div, style, document.head, {}, {})).to.equals(style);
        expect(document.head.contains(style)).to.be.true;
        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        let attrValue = div.getAttribute(DATA_ATTR_NAME);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        let rules = style.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DATA_ATTR_NAME}="${attrValue}"]`);

        expect(styler(STYLER_METHOD_REMOVE, div, style)).to.equals(style);
        expect(document.head.contains(style)).to.be.false;
        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        const indexShifterDummyEl = document.createElement('div');

        holder.prepend(indexShifterDummyEl);

        styler(STYLER_METHOD_ADD, div, style, document.head, {}, {});

        let oldAttrValue = attrValue;
        attrValue = div.getAttribute(DATA_ATTR_NAME);
        expect(attrValue).not.to.equals(oldAttrValue);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);
        
        rules = style.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DATA_ATTR_NAME}="${attrValue}"]`);

        styler(STYLER_METHOD_REMOVE, div, style);

        indexShifterDummyEl.remove();
        div.remove();
    });
});
