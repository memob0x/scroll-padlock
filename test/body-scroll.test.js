let lib;

before(() => {
    lib = window.bodyScroll;
});

after(() => {
    lib = null;
});

describe('The public interface', () => {
    it('should expose lock method', done => {
        expect('lock' in lib).to.be.true;

        done();
    });

    it('should expose unlock method', done => {
        expect('unlock' in lib).to.be.true;

        done();
    });

    it('should expose isLocked method', done => {
        expect('isLocked' in lib).to.be.true;

        done();
    });

    it('should expose toggle method', done => {
        expect('toggle' in lib).to.be.true;

        done();
    });

    it('should expose update method', done => {
        expect('update' in lib).to.be.true;

        done();
    });
});

describe('On standard browsers', () => {
    it('should print minimalistic css rules on lock', done => {
        // TODO:
        done();
    });

    it('should return locked state when locked', done => {
        // TODO:
        done();
    });

    it('should refresh the right css rules on resize', done => {
        // TODO:
        done();
    });

    it('should clean css rules on unlock', done => {
        // TODO:
        done();
    });

    it('should return unlocked state when unlocked', done => {
        // TODO:
        done();
    });
});

describe('Apple devices functionality', () => {
    it('should print different apple-specific rules', done => {
        // TODO:
        done();
    });

    it('should save and restore the scroll position', done => {
        // TODO:
        done();
    });
});

describe('An event', () => {
    it('should be dispatched on lock', done => {
        // TODO:
        done();
    });

    it('should be dispatched on unlock', done => {
        // TODO:
        done();
    });
});
