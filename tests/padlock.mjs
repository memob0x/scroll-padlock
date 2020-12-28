import {
    html,
    body,

    setCSSRules,
    removeCSSRules,

    SCROLL_GAP_VALUE_DEFAULT,
    SCROLL_GAP_VALUE_LARGER,
    SCROLL_GAP_CSS_CLASS_NAME_LARGER,

    getCSSVariableValue,
    getScrollableElement
} from './_test-utils.mjs';

import { cssVarNameGapVertical } from '../src/style.mjs';

import Padlock from "../src/padlock.mjs";

describe("padlock", () => {
    let scroller;

    before(() => setCSSRules());

    after(() => removeCSSRules());

    beforeEach(() => {
        scroller = getScrollableElement();

        body.append(scroller);
    });

    afterEach(() => {
        scroller.remove();

        scroller = null;
    });

    it('should be able to be initialized on valid elements only', () => {
        const instance = new Padlock(document.createElement('div'));

        expect(instance).to.be.an.instanceOf(Padlock);

        instance.destroy();

        expect(() => new Padlock(window)).to.throw();
        
        expect(() => new Padlock(null)).to.throw();
    });
    
    it('should initialize instance on documentElement if no element argument is passed to constructor', () => {
        const global = new Padlock();

        const div = document.createElement('div');
        
        const local = new Padlock(div);

        expect(global).to.have.property('element');

        expect(global.element).to.equals(html);

        expect(local.element).to.equals(div);

        expect(global).to.respondTo('destroy');

        global.destroy();

        local.destroy();

        expect(global.element).to.equals(null);

        expect(local.element).to.equals(null);
    });
    
    it('should throw if an instance is attached to an element with a padlock instance already attached', () => {
        const div = document.createElement('div');
        
        let instance;
        
        instance = new Padlock(div);
        
        expect(() => new Padlock(div)).to.throw();

        instance.destroy();
        
        expect(() => (instance = new Padlock(div))).to.not.throw();

        instance.destroy();
    });

    it('should be able to access the padlock styler element through a getter accessor', () => {
        const instance = new Padlock();

        expect(instance.styler).to.be.an.instanceOf(HTMLStyleElement);

        const dummyString = 'whatever';

        // setter is not available
        expect.styler = dummyString;

        expect(instance.styler).to.not.equals(dummyString);

        instance.destroy();
    });

    it('should be able to access the scrollbar width through a getter accessor', () => {
        const instance = new Padlock(document.createElement('div'));

        let objectAssertion;
        
        objectAssertion = expect(instance.scrollbar).to.be.an('object');
        objectAssertion.that.has.property('vertical').that.is.an('number');
        objectAssertion.that.has.property('horizontal').that.is.an('number');

        const dummyScrollbar = { horizontal: 123, vertical: 456 };

        // setter is not available
        objectAssertion.scrollbar = dummyScrollbar;

        objectAssertion = expect(instance.scrollbar).to.be.an('object');
        objectAssertion.that.has.property('vertical').that.not.equals(dummyScrollbar.vertical);
        objectAssertion.that.has.property('horizontal').that.not.equals(dummyScrollbar.horizontal);

        instance.destroy();
    });

    it('should be able to access the padlock state and change it through accessors', () => {
        const element = document.createElement('div');

        const instance = new Padlock(element);
        
        let calls = 0;

        const handler = () => calls++;

        element.addEventListener('scrollpadlocklock', handler);
        element.addEventListener('scrollpadlockunlock', handler);

        expect(instance.state).to.be.false;

        instance.state = true; // 1
        
        expect(instance.state).to.be.true;

        instance.state = false; // 2

        expect(instance.state).to.be.false;

        expect(calls).to.equals(2);

        instance.destroy();
    });

    it('should be able to retrieve current scroll position through getter accessor', () => {
        const instance = new Padlock(scroller);

        expect(instance.scroll.top).to.equals(scroller.scrollTop);
        expect(instance.scroll.left).to.equals(scroller.scrollLeft);

        instance.destroy();
    });

    it('should be able to set scroll position through setter accessor when state is unlocked', () => {
        const instance = new Padlock(scroller);    

        const position = {
            top: 123,
            left: 345
        };

        instance.scroll = position;

        expect(scroller.scrollTop).to.equals(position.top);
        expect(scroller.scrollLeft).to.equals(position.left);

        expect(instance.scroll.top).to.equals(scroller.scrollTop);
        expect(instance.scroll.left).to.equals(scroller.scrollLeft);

        instance.destroy();
    });

    it('should be able to save scroll position through setter accessor when state i locked', () => {
        const instance = new Padlock(scroller);

        instance.state = true;

        const position = {
            top: 345,
            left: 678
        };

        expect(instance.scroll.top).to.equals(scroller.scrollTop);
        expect(instance.scroll.left).to.equals(scroller.scrollLeft);

        instance.scroll = position;

        expect(scroller.scrollTop).to.equals(0);
        expect(scroller.scrollLeft).to.equals(0);

        expect(instance.scroll.top).to.equals(position.top);
        expect(instance.scroll.left).to.equals(position.left);

        instance.state = false;

        expect(scroller.scrollTop).to.equals(position.top);
        expect(scroller.scrollLeft).to.equals(position.left);

        expect(instance.scroll.top).to.equals(scroller.scrollTop);
        expect(instance.scroll.left).to.equals(scroller.scrollLeft);

        instance.destroy();
    });

    it('should be able to update css variables through method', () => {
        const instance = new Padlock(scroller);

        instance.state = true;
        
        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_DEFAULT}px`);

        scroller.classList.add(SCROLL_GAP_CSS_CLASS_NAME_LARGER);

        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_DEFAULT}px`);

        instance.update();

        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_LARGER}px`);
        
        scroller.classList.remove(SCROLL_GAP_CSS_CLASS_NAME_LARGER);

        instance.destroy();
    });
});
