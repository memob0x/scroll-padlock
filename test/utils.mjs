import { isNumber } from "../src/utils.mjs";

describe("body-scroll.utils", () => {
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
});
