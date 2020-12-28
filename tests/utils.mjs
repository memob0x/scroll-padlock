import { html, body } from './_test-utils.mjs';

import { isNumber, isGlobalScroller } from "../src/utils.mjs";

describe("utils", () => {
    it("should recognize valid numbers", () => {
        expect(isNumber(0)).to.be.true;
        expect(isNumber(+10)).to.be.true;
        expect(isNumber(0xff)).to.be.true;

        expect(isNumber("-10")).to.be.false;
        expect(isNumber("0")).to.be.false;
        expect(isNumber("0xFF")).to.be.false;
        expect(isNumber("8e5")).to.be.false;
        expect(isNumber("3.1415")).to.be.false;
        expect(isNumber("-0x42")).to.be.false;
        expect(isNumber("7.2acdgs")).to.be.false;
        expect(isNumber("")).to.be.false;
        expect(isNumber({})).to.be.false;
        expect(isNumber(NaN)).to.be.false;
        expect(isNumber(null)).to.be.false;
        expect(isNumber(true)).to.be.false;
        expect(isNumber(Infinity)).to.be.false;
        expect(isNumber(undefined)).to.be.false;
    });

    it("should recognize global scroller", () => {
        expect(isGlobalScroller(0)).to.be.false;
        expect(isGlobalScroller('1')).to.be.false;
        expect(isGlobalScroller(window)).to.be.false;
        expect(isGlobalScroller(document)).to.be.false;
        expect(isGlobalScroller(document.createElement('div'))).to.be.false;

        expect(isGlobalScroller(document.createElement('body'))).to.be.false;
        expect(isGlobalScroller(document.createElement('html'))).to.be.false;
        
        expect(isGlobalScroller(html)).to.be.true;
        expect(isGlobalScroller(body)).to.be.true;
    });
});
