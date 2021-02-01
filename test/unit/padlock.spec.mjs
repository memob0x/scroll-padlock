import 'jsdom-global/register.js';

import chai from 'chai';

import Padlock from '../../src/padlock.mjs';

import { DATA_ATTR_NAME } from '../../src/style.mjs';

import {
    EVENT_NAME_SCROLL,
    EVENT_NAME_RESIZE
} from '../../src/client.mjs';

const { expect } = chai;

describe('padlock', () => {
    it('should be able to create an instance and throw if incorrect arguments are passed', () => {
        // invalid element
        expect(() => void new Padlock(null)).to.throw(TypeError);

        // invalid class
        expect(() => void new Padlock(document.createElement('div'), '')).to.throw(TypeError);
        expect(() => void new Padlock(document.createElement('div'), null)).to.throw(TypeError);

        // same el instance throws
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

        // same el instance doesn't throw if instance is destroyed
        expect(() => {
            const div = document.createElement('div');
            
            let instance = new Padlock(div);

            instance.destroy();

            instance = new Padlock(div);

            instance.destroy();
        }).to.not.throw(Error);

        expect(() => {            
            // no element given = global scroller = <html> element
            let instance = new Padlock();

            expect(document.documentElement.matches(`[${DATA_ATTR_NAME}]`));

            instance.destroy();

            // <body> given = global scroller = <html> element
            instance = new Padlock(document.body);

            expect(document.documentElement.matches(`[${DATA_ATTR_NAME}]`));

            instance.destroy();
        }).to.not.throw(Error);
    });

    xit('should update instance "layout" object on resize', () => {});

    xit('should update instance "scroll" object on scroll', () => {});

    xit('should update instance "scroll" object and "layout" object on "update" method call', () => {});

    xit('should trigger "scrollTo" native method when using "scroll" accessor as a setter when state is unlocked', () => {});

    xit('should not trigger "scrollTo" native method when using "scroll" accessor as a setter when locked, but should update "scroll" object instead', () => {});

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
                case EVENT_NAME_SCROLL:
                    scrollListened++;
                    break;

                case EVENT_NAME_RESIZE:
                    resizeListened++;
                    break;
            }
        };

        window.removeEventListener = div.removeEventListener = type => {
            switch(type){
                case EVENT_NAME_SCROLL:
                    scrollRemoved++;
                    break;

                case EVENT_NAME_RESIZE:
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

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.true;

        instance.destroy();

        expect(getStylesheetsCount()).to.equals(stylesheetsCountBeforeInit);

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        div.dispatchEvent(new CustomEvent(EVENT_NAME_SCROLL));

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        div.dispatchEvent(new CustomEvent(EVENT_NAME_RESIZE));

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

        instance.update();

        expect(div.matches(`[${DATA_ATTR_NAME}]`)).to.be.false;

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
