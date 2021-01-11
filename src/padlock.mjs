import { EVENT_NAME_SCROLL, EVENT_NAME_RESIZE, doc, html, body, addListener, removeListener } from './client.mjs';

import { getScrollPosition, scrollTo } from './scroll.mjs';

import { getScrollbarsGaps } from './scrollbar.mjs';

import { setStyles, unsetStyles } from './style.mjs';

import { debounce } from './utils.mjs';

// Default class members values
const DEFAULT_ELEMENT = html;
const DEFAULT_TARGET = body;
const DEFAULT_SCROLLER = window;
const DEFAULT_CLASSNAME = 'scroll-padlock-locked';

// Static settings
const RESIZE_DEBOUNCE_INTERVAL_MS = 250;
const SCROLL_DEBOUNCE_INTERVAL_MS = 125;

// Instances collection closure,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

export default class ScrollPadlock {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {Window|HTMLElement} [element] The given scrollable element whose scroll needs to be controlled
     * @param {String} [className] The given scrollable element whose scroll needs to be controlled
     */
    constructor(element = DEFAULT_ELEMENT, className = DEFAULT_CLASSNAME) {
        // Window as element argument support
        const elementIsWindow = element === window;

        // Scrollable html elements support
        const elementIsHtmlElement = element instanceof HTMLElement;

        // If the given scrollable element is not supported (valid html element or page)
        // there's nothing to do, but throwing an exception
        if (!elementIsWindow && !elementIsHtmlElement) {
            throw new TypeError('The scrollable element must be a valid html element');
        }

        //
        if( elementIsHtmlElement ){
            this.#target = element;
        }

        // Global page (window, html or body as element argument)
        const elementIsGlobal = elementIsWindow || element === html || element === body;

        // Custom scrollable element case:
        // if the given element is not global (page scroll)
        // then replace "element" and "scroller" private members with that element
        if( !elementIsGlobal ){
            this.#container = this.#target = this.#scroller = element;
        }

        // If an instance has already been initialized on this very element, there could be conflicts in events handling etc,
        // throws an exception in this case
        if (instances.has(this.#container)) {
            throw new Error('An instance has already been initialized on the given element');
        }

        // Instance is not registered ad this point,
        // so this one is added to the instances collection
        instances.set(this.#container, this);

        // Lock state css class validity check, must be a string and a valid one
        const classNameIsValid = typeof className === 'string' && !!className.length;

        // No class name, nothing to do, but throwing an exception
        if (!classNameIsValid) {
            throw new TypeError('Invalid locked-state className provided');
        }

        // Stores the class name as a private member
        this.#className = className;

        //
        this.#classList = this.#target.classList;

        //
        this.#setStateValue();

        // Firing the public update method to initialize everything
        // computes scroll position, scrollbars sizes and writes css variables
        this.update();

        //
        this.#observeCssClass();

        // Attaches resize event listener
        addListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // Attaches scroll event listener
        addListener(this.#scroller, EVENT_NAME_SCROLL, this.#scrollHandler);
    }

    /**
     * The lock state element target, usually the scrollable element
     */
    #container = DEFAULT_ELEMENT;

    /**
     * 
     */
    #target = DEFAULT_TARGET;

    /**
     * 
     */
    #classList = null;

    /**
     * The actual scroll element target, the element that can perform and listen to scroll event
     * Usually coincides with "element", but when "element" is document.documentElement, "scroller" is window
     */
    #scroller = DEFAULT_SCROLLER;

    /**
     * The lock state class name
     */
    #className = DEFAULT_CLASSNAME;

    /**
     * 
     */
    #state = false;

    /**
     * The scroll position
     */
    #scrollCurrent = { top: 0, left: 0 };

    /**
     * 
     */
    #scrollSaving = { top: 0, left: 0 };

    /**
     * Returns the current scroll position, if on a locked state it returns the currently saved scroll position object
     * @returns {Object} The current scroll position object or the scroll position previously saved if on a locked state
     */
    get scroll() {
        return this.#state ? this.#scrollSaving : this.#scrollCurrent;
    }

    /**
     * Sets a new scroll position, if on a locked state it saves that given scroll position for a future scroll restoration
     * @param {Object} position The scroll position to be set or saved if on a locked state
     */
    set scroll(position) {
        if( this.#state ){
            this.#scrollSaving = position;
            
            return;
        }

        scrollTo(this.#scroller, position);
    }

    /**
     * 
     */
    #observer = new MutationObserver(() => {
        //
        const oldState = this.#state;
        
        //
        this.#setStateValue();

        // No state change, exiting early
        if( this.#state === oldState ){
            return;
        }

        // State changed to true
        if( this.#state ){
            this.#scrollSaving = { ...this.#scrollCurrent };

            return;
        }

        // State changed to false

        //
        this.scroll = this.#scrollSaving;
    });

    /**
     * The scrollbars size
     */
    #scrollbar = { vertical: 0, horizontal: 0 };

    /**
     * The styler, css variables holder
     */
    #styler = doc.createElement('style');

    /**
     * Window resize event handler
     */
    #resizeHandler = debounce(() => {
        // Refresh scroll position
        this.#setScrollbarValue();

        // Rewrites css variables
        this.#updateStyles();
    }, RESIZE_DEBOUNCE_INTERVAL_MS);

    /**
     * Element scroll event handler
     */
    #scrollHandler = debounce(() => {
        // Refresh scrollbars size
        this.#setScrollValue();

        // Rewrites css variables
        this.#updateStyles();
    }, SCROLL_DEBOUNCE_INTERVAL_MS);

    /**
     * 
     */
    #setStateValue = () => (this.#state = this.#classList.contains(this.#className));

    /**
     * Fires a given function at a unlocked scroll state
     * @param {Function} action The given function to be fired at unlocked scroll state
     * @returns {any} Anything the given function returns is returned
     */
    #performUnlockedAction = action => {
        // Caches the scroll lock state (true if css class is set, thus on a locked state)
        const wasLocked = this.#state;

        // 
        this.#unobserveCssClass();

        // Removes the css class temporarly
        this.#classList.remove(this.#className);

        // Fires the given function and caches the return value
        const result = action();

        // Relocks the css class if was set before
        if (wasLocked) {
            this.#classList.add(this.#className);
        }
        
        //
        this.#observeCssClass();

        // Returns what the given function returns
        return result;
    };

    /**
     * Refresh the scrollbars size at a (temporarly) unlocked state
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    #setScrollbarValue = () => this.#performUnlockedAction(() => (this.#scrollbar = getScrollbarsGaps(this.#container, this.#scroller)));

    /**
     * Refresh the scroll position at a (temporarly) unlocked state
     * @returns {Object} The current scroll position object
     */
    #setScrollValue = () => this.#performUnlockedAction(() => (this.#scrollCurrent = getScrollPosition(this.#scroller)));

    /**
     * Rewrites the css variables with current data
     * @returns {HTMLStyleElement} Styler element
     */
    #updateStyles = () => setStyles(this.#container, this.#styler, this.scroll, this.scrollbar);

    /**
     * 
     */
    #observeCssClass = () => this.#observer.observe(this.#target, {
        attributes: true, 
        attributeFilter: ['class'],
        childList: false, 
        characterData: false
    });

    /**
     * 
     */
    #unobserveCssClass = () => this.#observer.disconnect();

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar() {
        return this.#scrollbar;
    }

    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {void} Nothing
     */
    destroy() {
        //
        this.#unobserveCssClass();

        // Removes the css variables, styler, styler selector...
        unsetStyles(this.#container, this.#styler);

        // Detaches the scroll event listener
        removeListener(this.#scroller, EVENT_NAME_SCROLL, this.#scrollHandler);

        // Detaches the resize event listener
        removeListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // Removes  the instance from the instances collection
        instances.delete(this.#container);

        // Removes the element reference
        this.#container = null;

        // Removes the scroller reference
        this.#scroller = null;
    }

    /**
     * Re-evaluates dimensions and such, updates css variables to the current state...
     * @returns {void} Nothing
     */
    update() {
        // Refresh scroll position
        this.#setScrollValue();

        // Refresh scrollbars size
        this.#setScrollbarValue();

        // Rewrites css variables
        this.#updateStyles();
    }
}
