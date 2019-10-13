describe("The public interface", () => {
    it("should expose lock method", done => {
        expect("lock" in window.bodyScroll).to.be.true;

        done();
    });

    it("should expose unlock method", done => {
        expect("unlock" in window.bodyScroll).to.be.true;

        done();
    });

    it("should expose isLocked method", done => {
        expect("isLocked" in window.bodyScroll).to.be.true;

        done();
    });

    it("should expose toggle method", done => {
        expect("toggle" in window.bodyScroll).to.be.true;

        done();
    });
});
