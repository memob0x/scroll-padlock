let lib;

before(function() {
    lib = window.bodyScroll;
});

after(function() {
    lib = null;
});

describe('Basic interface', function() {
    it('Should expose lock method', function(done) {
        expect('lock' in lib).to.be.true;

        done();
    });

    it('Should expose unlock method', function(done) {
        expect('unlock' in lib).to.be.true;

        done();
    });

    it('Should expose isLocked method', function(done) {
        expect('isLocked' in lib).to.be.true;

        done();
    });

    it('Should expose toggle method', function(done) {
        expect('toggle' in lib).to.be.true;

        done();
    });

    it('Should expose update method', function(done) {
        expect('update' in lib).to.be.true;

        done();
    });
});
