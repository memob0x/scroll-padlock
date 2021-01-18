import Padlock from '../src/padlock.mjs';

import { EVENT_NAME_SCROLL, EVENT_NAME_RESIZE, RESIZE_DEBOUNCE_INTERVAL_MS, SCROLL_DEBOUNCE_INTERVAL_MS } from '../src/client.mjs';

import { createDiv, documentElement, body, isPadlockElement, dispatchCustomEvent } from './_tests.mjs';

describe('padlock', () => {    
    let expander;
    let scroller;

    beforeEach(() => {
        expander = createDiv();

        const expanderStyle = expander.style;

        expanderStyle.width = expanderStyle.height = '2000px';
        
        scroller = createDiv();

        const scrollerStyle = scroller.style;

        scrollerStyle.width = scrollerStyle.height = '100px';

        scrollerStyle.overflow = 'auto';
    });

    afterEach(() => expander.remove());

    it('should be able to create an instance and throw if incorrect arguments are passed', () => {
        // invalid element
        expect(() => void new Padlock(null)).to.throw(TypeError);

        // invalid class
        expect(() => void new Padlock(createDiv(), '')).to.throw(TypeError);
        expect(() => void new Padlock(createDiv(), null)).to.throw(TypeError);

        // same el instance throws
        expect(() => {
            const div = createDiv();
            
            void new Padlock(div);
            void new Padlock(div);
        }).to.throw(Error);

        // same el instance doesn't throw if instance is destroyed
        expect(() => {
            const div = createDiv();
            
            let instance = new Padlock(div);

            instance.destroy();

            instance = new Padlock(div);

            instance.destroy();
        }).to.not.throw(Error);

        expect(() => {            
            // no element given = global scroller = <html> element
            let instance = new Padlock();

            expect(isPadlockElement(documentElement));

            instance.destroy();

            // <body> given = global scroller = <html> element
            instance = new Padlock(body);

            expect(isPadlockElement(documentElement));

            instance.destroy();
        }).to.not.throw(Error);
    });

    it('should update page layout values on resize', done => {
        const instance = new Padlock();
        
        const { layout } = instance;
        
        expect(layout).to.deep.equals(instance.layout);

        body.append(expander);

        dispatchCustomEvent(window, 'resize');

        setTimeout(() => {
            expect(layout).to.not.deep.equals(instance.layout);

            instance.destroy();

            expander.remove();

            done();
        }, RESIZE_DEBOUNCE_INTERVAL_MS);
    });

    it('should update elements layout values on resize', done => {
        const _scroller = scroller.cloneNode();

        const { style } = scroller;

        style.width = '100%';
        style.position = 'absolute';
        style.top = style.left = '0px';

        body.append(scroller);

        const instance = new Padlock(scroller);
        
        const { layout } = instance;

        scroller.append(expander);
        
        expect(layout).to.deep.equals(instance.layout);

        dispatchCustomEvent(window, 'resize');

        setTimeout(() => {
            expect(layout).to.not.deep.equals(instance.layout);

            expander.remove();
            scroller.remove();

            scroller = _scroller;

            done();
        }, RESIZE_DEBOUNCE_INTERVAL_MS);
    });

    it('should update elements scroll values on scroll', done => {
        scroller.scrollTo(0, 0);

        scroller.append(expander);
        body.append(scroller);

        const instance = new Padlock(scroller);
        
        const { scroll } = instance;
        
        expect(scroll).to.deep.equals(instance.scroll);

        scroller.scrollTo(345, 123);

        setTimeout(() => {
            expect(scroll).to.not.deep.equals(instance.scroll);

            expander.remove();
            scroller.remove();

            scroller.scrollTo(0, 0);

            done();
        }, SCROLL_DEBOUNCE_INTERVAL_MS + 20); // TODO: check why extra ms is needed here
    });

    it('should update page scroll values on scroll', done => {
        window.scrollTo(0, 0);

        body.append(expander);

        const instance = new Padlock();
        
        const { scroll } = instance;
        
        expect(scroll).to.deep.equals(instance.scroll);

        window.scrollTo(123, 345);

        setTimeout(() => {
            expect(scroll).to.not.deep.equals(instance.scroll);

            instance.destroy();

            expander.remove();

            window.scrollTo(0, 0);

            done();
        }, SCROLL_DEBOUNCE_INTERVAL_MS + 20); // TODO: check why extra ms is needed here
    });

    xit('should set new scroll on elements instance', () => {
        // TODO: ...
    });

    xit('should set new scroll on page instance', () => {
        // TODO: ...
    });

    it('destroy method should avoid further computations or DOM changes', () => {
        const div = createDiv();

        const instance = new Padlock(div);

        expect(isPadlockElement(div)).to.be.true;

        instance.destroy();

        expect(isPadlockElement(div)).to.be.false;

        dispatchCustomEvent(div, EVENT_NAME_SCROLL);

        expect(isPadlockElement(div)).to.be.false;

        dispatchCustomEvent(div, EVENT_NAME_RESIZE);

        expect(isPadlockElement(div)).to.be.false;

        instance.update();

        expect(isPadlockElement(div)).to.be.false;
    });

    it('should update values through update method elements padlock', () => {
        body.append(scroller);

        const instance = new Padlock(scroller);
        
        const { layout } = instance;

        scroller.append(expander);
        
        expect(layout).to.deep.equals(instance.layout);

        instance.update();
        
        expect(layout).to.not.deep.equals(instance.layout);

        expander.remove();
        scroller.remove();
    });

    it('should update values through update method on page padlock', () => {
        const instance = new Padlock();
        
        const { layout } = instance;

        body.append(expander);
        
        expect(layout).to.deep.equals(instance.layout);

        instance.update();
        
        expect(layout).to.not.deep.equals(instance.layout);

        instance.destroy();

        expander.remove();
    });
});
