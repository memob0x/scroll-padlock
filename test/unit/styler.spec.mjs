import 'jsdom-global/register.js';

import chai from 'chai';

import { DOM_DATA_ATTRIBUTE_NAME, ADD, REMOVE } from '../../src/constants.mjs';

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

        expect(styler(ADD, div, style, document.head, {}, {})).to.equals(style);
        expect(document.head.contains(style)).to.be.true;
        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.true;

        let attrValue = div.getAttribute(DOM_DATA_ATTRIBUTE_NAME);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);

        let rules = style.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DOM_DATA_ATTRIBUTE_NAME}="${attrValue}"]`);

        expect(styler(REMOVE, div, style)).to.equals(style);
        expect(document.head.contains(style)).to.be.false;
        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.false;

        const indexShifterDummyEl = document.createElement('div');

        holder.prepend(indexShifterDummyEl);

        styler(ADD, div, style, document.head, {}, {});

        let oldAttrValue = attrValue;
        attrValue = div.getAttribute(DOM_DATA_ATTRIBUTE_NAME);
        expect(attrValue).not.to.equals(oldAttrValue);
        expect(attrValue).to.equals(`${getElementParentsLength(div)}-${getElementIndex(div)}`);
        
        rules = style.sheet.cssRules[0];
        expect(rules.selectorText).equals(`[${DOM_DATA_ATTRIBUTE_NAME}="${attrValue}"]`);

        styler(REMOVE, div, style);

        indexShifterDummyEl.remove();
        div.remove();
    });
});
