import "../dist/body-scroll.js";

describe("Public Api surface", () => {
    it("should be defined globally", done => {
        expect("bodyScroll" in window).to.be.true;
        expect(typeof window.bodyScroll === "object").to.be.true;

        done();
    });

    it('should expose "isLocked" method', done => {
        expect("isLocked" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "update" method', done => {
        expect("update" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "lock" method', done => {
        expect("lock" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "unlock" method', done => {
        expect("unlock" in window.bodyScroll).to.be.true;

        done();
    });
});
