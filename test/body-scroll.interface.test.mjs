import bodyScroll from "../src/body-scroll.mjs";

describe("The public interface", () => {
    it("should expose lock method", done => {
        expect("lock" in bodyScroll).to.be.true;

        done();
    });

    it("should expose unlock method", done => {
        expect("unlock" in bodyScroll).to.be.true;

        done();
    });

    it("should expose isLocked method", done => {
        expect("isLocked" in bodyScroll).to.be.true;

        done();
    });

    it("should expose toggle method", done => {
        expect("toggle" in bodyScroll).to.be.true;

        done();
    });
});
