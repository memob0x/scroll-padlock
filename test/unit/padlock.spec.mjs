import 'jsdom-global/register.js';

import chai from 'chai';

import Padlock from '../../src/padlock.mjs';

import {
    DOM_DATA_ATTRIBUTE_NAME,
    SCROLL,
    OUTER_WIDTH,
    OUTER_HEIGHT,
    RESIZE,
    TOP,
    LEFT
} from '../../src/constants.mjs';

const { expect } = chai;

describe('padlock', () => {
    it('should be able to create an instance and throw if incorrect arguments are passed', () => {
        // This instance has an invalid element argument
        expect(() => void new Padlock(null)).to.throw(TypeError);

        // This instance has an invalid CSS class argument
        expect(() => void new Padlock(document.createElement('div'), '')).to.throw(TypeError);
        expect(() => void new Padlock(document.createElement('div'), null)).to.throw(TypeError);

        // These instances are created on the same element, an error has to be thrown
        expect(() => {
            const div = document.createElement('div');
            
            const instance = new Padlock(div);

            // Catches the error in order to clean former instance before rebinding it to make the test work properly
            try {
                void new Padlock(div);
            }catch(e){
                instance.destroy();

                throw e;
            }
        }).to.throw(Error);

        // These instances are created on the same element, but no error is thrown because the first one is destroyed before the second
        expect(() => {
            const div = document.createElement('div');
            
            let instance = new Padlock(div);

            instance.destroy();

            instance = new Padlock(div);

            instance.destroy();
        }).to.not.throw(Error);

        expect(() => {            
            // If no element is given as an argument, then the default one is page scroller (<html> element)
            let instance = new Padlock();

            expect(document.documentElement.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`));

            instance.destroy();

            // If <body> is given as an argument, then it's a global scroller (still <html> element)
            instance = new Padlock(document.body);

            expect(document.documentElement.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`));

            instance.destroy();
        }).to.not.throw(Error);
    });

    it('should update instance "layout" object only on resize and "scroll" object only on scroll', async () => {
        const div = document.createElement('div');

        let dimensions = {
            width: 100,
            height: 200
        };
        let scrollPosition = {
            top: 1000,
            left: 2000
        };

        div.getBoundingClientRect = () => dimensions;
        div.scrollTop = scrollPosition.top;
        div.scrollLeft = scrollPosition.left;

        const instance = new Padlock(div);

        expect(instance.layout).to.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        dimensions = {
            width: 300,
            height: 400
        };
        scrollPosition = {
            top: 2000,
            left: 3000
        };

        div.getBoundingClientRect = () => dimensions;
        div.scrollTop = scrollPosition.top;
        div.scrollLeft = scrollPosition.left;

        expect(instance.layout).to.not.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.not.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        window.dispatchEvent(new CustomEvent(RESIZE));
        
        await new Promise(window.setTimeout);
        
        expect(instance.layout).to.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.not.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        dimensions = {
            width: 400,
            height: 500
        };

        div.dispatchEvent(new CustomEvent(SCROLL));
        
        await new Promise(window.setTimeout);

        expect(instance.layout).not.to.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        instance.destroy();
    });

    it('should update instance "scroll" object and "layout" object on "update" method call', () => { 
        const div = document.createElement('div');

        let dimensions = {
            width: 100,
            height: 200
        };
        let scrollPosition = {
            top: 1000,
            left: 2000
        };

        div.getBoundingClientRect = () => dimensions;
        div.scrollTop = scrollPosition.top;
        div.scrollLeft = scrollPosition.left;

        const instance = new Padlock(div);

        expect(instance.layout).to.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        dimensions = {
            width: 300,
            height: 400
        };
        scrollPosition = {
            top: 2000,
            left: 3000
        };

        div.getBoundingClientRect = () => dimensions;
        div.scrollTop = scrollPosition.top;
        div.scrollLeft = scrollPosition.left;

        expect(instance.layout).to.not.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.not.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        instance.update();
        
        expect(instance.layout).to.include({
            [OUTER_WIDTH]: dimensions.width,
            [OUTER_HEIGHT]: dimensions.height
        });
        expect(instance.scroll).to.include({
            [TOP]: scrollPosition.top,
            [LEFT]: scrollPosition.left
        });

        instance.destroy();
    });

    it('should scroll the element through "scroll" setter when unlocked state, save it for later when locked, restore saved scroll on unlock', async () => {
        const div = document.createElement('div');

        const lockedStateCSSClassName = 'loooocked';

        let scrollToCalls = 0;

        div.scrollTo = arg => {
            scrollToCalls++;
            
            if( typeof arg === 'object' ){
                div.scrollTop = arg?.top;
            }

            if( typeof arg === 'number' ){
                div.scrollTop = arg;
            }
        };
        
        const instance = new Padlock(div, lockedStateCSSClassName);

        // Tests programmatic scroll change through instance
        let { scrollTop } = div;

        instance.scroll = { top: 100, left: 200 };

        expect(scrollTop).not.to.equals(div.scrollTop);
        expect(scrollToCalls).to.equals(1);

        scrollTop = instance.scroll.top;

        // Tests programmatic scroll change attempt through instance on locked state (given scroll object is saved for later)
        ({ scrollTop } = div);

        div.classList.add(lockedStateCSSClassName);

        await new Promise(window.setTimeout);

        instance.scroll = { top: 200, left: 300 };

        expect(scrollTop).to.equals(div.scrollTop);
        expect(scrollToCalls).to.equals(1);

        // Tests automatic scroll restore on previously given scroll object (through scroll change attempt)
        div.classList.remove(lockedStateCSSClassName);

        await new Promise(window.setTimeout);

        expect(scrollTop).not.to.equals(div.scrollTop);
        expect(scrollToCalls).to.equals(2);
    });

    it('should avoid further computations or DOM changes after "destroy" method call', () => {
        const div = document.createElement('div');

        const getStylesheetsCount = () => document.head.querySelectorAll('style').length;

        const stylesheetsCountBeforeInit = getStylesheetsCount();
        
        const {
            MutationObserver: windowMutationObserverBackup,
            addEventListener: windowAddEventListenerBackup,
            removeEventListener: windowRemoveEventListenerBackup
        } = window;

        let observed = 0;
        let unobserved = 0;
        let disconnect = 0;

        let resizeListened = 0;
        let scrollListened = 0;
        let scrollRemoved = 0;
        let resizeRemoved = 0;

        window.MutationObserver = class {
            observe = () => observed++;

            unobserve = () => unobserved++;

            disconnect = () => disconnect++;
        };

        window.addEventListener = div.addEventListener = type => {
            switch(type){
                case SCROLL:
                    scrollListened++;
                    break;

                case RESIZE:
                    resizeListened++;
                    break;
            }
        };

        window.removeEventListener = div.removeEventListener = type => {
            switch(type){
                case SCROLL:
                    scrollRemoved++;
                    break;

                case RESIZE:
                    resizeRemoved++;
                    break;
            }
        };

        expect(observed).to.equals(0);
        expect(unobserved).to.equals(0);
        expect(disconnect).to.equals(0);
        expect(resizeListened).to.equals(0);
        expect(scrollListened).to.equals(0);
        expect(resizeRemoved).to.equals(0);
        expect(scrollRemoved).to.equals(0);
        
        expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

        const instance = new Padlock(div);
        
        expect(getStylesheetsCount()).to.not.equals(stylesheetsCountBeforeInit);

        expect(observed).to.equals(1);
        expect(unobserved).to.equals(0);
        expect(disconnect).to.equals(0);
        expect(resizeListened).to.equals(1);
        expect(scrollListened).to.equals(1);
        expect(resizeRemoved).to.equals(0);
        expect(scrollRemoved).to.equals(0);

        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.true;

        instance.destroy();

        expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.false;

        div.dispatchEvent(new CustomEvent(SCROLL));

        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.false;

        div.dispatchEvent(new CustomEvent(RESIZE));

        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.false;

        instance.update();

        expect(div.matches(`[${DOM_DATA_ATTRIBUTE_NAME}]`)).to.be.false;

        expect(observed).to.equals(1);
        expect(unobserved).to.equals(0);
        expect(disconnect).to.equals(1);
        expect(resizeListened).to.equals(1);
        expect(scrollListened).to.equals(1);
        expect(resizeRemoved).to.equals(1);
        expect(scrollRemoved).to.equals(1);

        window.addEventListener = windowAddEventListenerBackup;
        window.removeEventListener = windowRemoveEventListenerBackup;
        window.MutationObserver = windowMutationObserverBackup;
    });
});
