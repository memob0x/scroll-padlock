import { EVENT_NAME_SCROLL, EVENT_NAME_RESIZE, doc, html, addListener, removeListener, getClassNameObserver } from './client.mjs';

import { getScrollPosition, scrollTo } from './scroll.mjs';

import { getScrollbarsGaps } from './scrollbar.mjs';

import { setStyles, unsetStyles } from './style.mjs';

import { debounce, throttle } from './utils.mjs';

// instances collection closure
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

export default class ScrollPadlock {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {HTMLElement} [element=document.document.Element] The given scrollable element whose scroll needs to be controlled
     * @returns {void} Nothing
     */
    constructor(element = html, className){
        // if the given scrollable element is not a valid html element, there's not much to do
        if( !(element instanceof HTMLElement) ){
            throw new TypeError('The scrollable element must be a valid html element');
        }

        // stores the scrollable element reference
        this.#element = element;

        // no class name, nothing to do
        if( !className ){
            throw new TypeError('Invalid locked-state className provided');
        }

        // stores the scrollable element reference
        this.#className = className;

        // if an instance has already been initialized on this very element, there could be conflicts in events handling
        if( instances.has(this.element) ){
            throw new Error('An instance has already been initialized on the given element');
        }

        // adds this instance to the instances collection
        instances.set(this.element, this);

        // sets the initial state (css variables, etc...) through update method call
        this.update();

        //
        this.#observeCssClass();

        // attaches resize event listener
        addListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // attaches scroll event listener
        addListener(this.element, EVENT_NAME_SCROLL, this.#scrollHandler);
    }

    /**
     * The scrollable element
     */
    #element;

    /**
     * The lock state class name
     */
    #className;

    /**
     * The lock state
     */
    #state;

    /**
     * The class name mutation observer
     */
    #cssClassObserver = getClassNameObserver(this.className, state => (this.#state = state));
    
    /**
     * The scroll position saving
     */
    #savedScrollPosition;

    /**
     * The current scroll position
     */
    #currentScrollPosition;

    /**
     * The scrollbars size
     */
    #scrollbar;

    /**
     * The styler, css variables holder
     */
    #styler = doc.createElement('style');

    /**
     * 
     */
    #resizeHandler = debounce(() => {
        this.#setScrollbarValue();

        this.#updateStyles();
    });

    /**
     * 
     */
    #scrollHandler = throttle(() => {
        this.#setCurrentScrollPositionValue();

        this.#updateStyles();
    });

    /**
     * 
     */
    #performUnlockedActionWithoutObservation = action => {
        //
        this.#unobserveCssClass();

        //
        const cl = this.element.classList;

        //
        const wasLocked = cl.contains(this.className);

        //
        cl.remove(this.className);

        //
        action();

        //
        if( wasLocked ){
            cl.add(this.className);
        }

        //
        this.#observeCssClass();
    };

    /**
     * 
     */
    #setScrollbarValue = () => this.#performUnlockedActionWithoutObservation(() => (this.#scrollbar = getScrollbarsGaps(this.element)));

    /**
     * 
     */
    #setCurrentScrollPositionValue = () => this.#performUnlockedActionWithoutObservation(() => (this.#currentScrollPosition = getScrollPosition(this.element)));

    /**
     * 
     */
    #updateStyles = () => setStyles(this.element, this.styler, this.scroll, this.scrollbar);

    /**
     * 
     * @returns {void} Nothing
     */
    #observeCssClass = () => this.#cssClassObserver?.observe(this.element, {});

    /**
     * 
     * @returns {void} Nothing
     */
    #unobserveCssClass = () => this.#cssClassObserver?.disconnect();

    /**
     * Returns the scrollable element reference
     * @returns {HTMLElement} The scrollable element reference
     */
    get element(){
        return this.#element;
    }

    /**
     * 
     */
    get className(){
        return this.#className;
    }

    /**
     * Returns the current lock state as a boolean
     * @returns {Boolean} True if element scroll is locked, false if element scroll is not locked
     */
    get state(){
        return this.#state;
    }

    /**
     * Returns the current scroll position, if on a locked state it returns the currently saved scroll position object
     * @returns {Object} The current scroll position object or the scroll position previously saved if on a locked state
     */
    get scroll(){
        return this.state ? this.#savedScrollPosition : this.#currentScrollPosition;
    }

    /**
     * Sets a new scroll position, if on a locked state it saves that given scroll position for a future scroll restoration
     * @param {Object} position The scroll position to be set or saved if on a locked state
     */
    set scroll(position){
        if( this.state ){
            this.#savedScrollPosition = position;

            return;
        }
        
        scrollTo(this.element, position);
    }

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar(){
        return this.#scrollbar;
    }

    /**
     * Gets the given scrollable element (associated) styler
     * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
     * @returns {HTMLStyleElement|null} Styler element, null if not inserted to head
     */
    get styler(){
        return this.#styler;
    }
    
    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {void} Nothing
     */
    destroy(){
        // removes the css variables, styler, styler selector...
        unsetStyles(this.element, this.styler);

        // detaches the scroll event listener
        removeListener(this.element, EVENT_NAME_SCROLL, this.#scrollHandler);
        
        // detaches the resize event listener
        removeListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        //
        this.#unobserveCssClass();

        //
        this.#cssClassObserver = null;
        
        // removing the instance from the instances collection
        instances.delete(this.element);

        // removes the scrollable element reference
        this.#element = null;
    }

    /**
     * Updates css variables to the current state
     * @returns {void} Nothing
     */
    update(){
        //
        this.#setCurrentScrollPositionValue();

        //
        this.#setScrollbarValue();

        //
        this.#updateStyles();
    }
}
