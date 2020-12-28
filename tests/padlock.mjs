import Padlock from "../src/padlock.mjs";

// TODO: test all class instance methods, setters, getters etc...

describe("padlock", () => {
    it('should be able to be initialized on valid elements only', () => {
        expect(new Padlock(document.createElement('div'))).to.be.an.instanceOf(Padlock);

        expect(() => new Padlock(window)).to.throw();
        
        expect(() => new Padlock(null)).to.throw();
    });
    
    it('should initialize instance on documentElement if no element argument is passed to constructor', () => {
        const global = new Padlock();

        expect(global.element).to.equals(document.documentElement);

        global.destroy();

        expect(global.element).to.equals(null);
    });
    
    it('should initialize instance on documentElement if no element argument is passed to constructor', () => {
        const div = document.createElement('div');
        
        const instance = new Padlock(div);
        
        expect(() => new Padlock(div)).to.throw();

        instance.destroy();
        
        expect(() => new Padlock(div)).to.not.throw();
    });
});
