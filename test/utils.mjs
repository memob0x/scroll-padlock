import { isNumber, capitalizeWord } from "../src/utils.mjs";

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

    it('should capitalize a given word', () => {
        // not trimmed word is not supported
        expect(capitalizeWord(' asd')).to.equals(' asd');

        expect(capitalizeWord('asd')).to.equals('Asd');

        // multiple words are not supported
        expect(capitalizeWord('asd asd')).to.equals('Asd asd');

        // non-string arguments are not supported
        expect(() => capitalizeWord(0)).to.throw();
        expect(() => capitalizeWord(null)).to.throw();
        expect(() => capitalizeWord(undefined)).to.throw();
        expect(() => capitalizeWord([])).to.throw();
    });
});
