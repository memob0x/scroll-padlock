let lib;

before(() => {
    lib = window.bodyScroll;
});

after(() => {
    lib = null;
});

describe("On standard browsers", () => {
    it("should print minimalistic css rules on lock", done => {
        // TODO:
        done();
    });

    it("should return locked state when locked", done => {
        // TODO:
        done();
    });

    it("should refresh the right css rules on resize", done => {
        // TODO:
        done();
    });

    it("should clean css rules on unlock", done => {
        // TODO:
        done();
    });

    it("should return unlocked state when unlocked", done => {
        // TODO:
        done();
    });
});
