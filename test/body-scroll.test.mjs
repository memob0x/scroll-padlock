// TODO: include dist/body-scroll.js and test
// - lock exposure
// - unlock exposure
// - isLocked exposure
// - toggle exposure
// - update exposure

describe("Public Api surface", function() {
    it("should be defined globally", function(done) {
        expect("bodyScroll" in window).to.be.true;
        expect(typeof window.bodyScroll === "object").to.be.true;

        done();
    });

    it('should expose "isLocked" method', function(done) {
        expect("isLocked" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "update" method', function(done) {
        expect("update" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "lock" method', function(done) {
        expect("lock" in window.bodyScroll).to.be.true;

        done();
    });

    it('should expose "unlock" method', function(done) {
        expect("unlock" in window.bodyScroll).to.be.true;

        done();
    });
});
