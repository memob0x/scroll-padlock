import { EVENT_NAME_SCROLL, EVENT_NAME_RESIZE, doc, html, body, addListener, removeListener } from './client.mjs';

import { getScrollPosition, scrollTo } from './scroll.mjs';

import { getScrollbarsGaps } from './scrollbar.mjs';

import { setStyles, unsetStyles } from './style.mjs';

import { debounce } from './utils.mjs';

// defaults
const DEFAULT_ELEMENT = html;
const DEFAULT_SCROLLER = window;
const DEFAULT_CLASSNAME = 'scroll-padlock-locked';

// settings
const RESIZE_DEBOUNCE_INTERVAL_MS = 250;
const SCROLL_DEBOUNCE_INTERVAL_MS = 125;

// instances collection closure
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

export default class ScrollPadlock {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {Window|HTMLElement} [element] The given scrollable element whose scroll needs to be controlled
     * @param {String} [className] The given scrollable element whose scroll needs to be controlled
     */
    constructor(element = DEFAULT_ELEMENT, className = DEFAULT_CLASSNAME) {
        //
        const elementIsWindow = element === window;

        //
        const elementIsHtmlElement = element instanceof HTMLElement;

        // if the given scrollable element is not a valid html element, there's not much to do
        if (!elementIsWindow && !elementIsHtmlElement) {
            throw new TypeError('The scrollable element must be a valid html element');
        }

        //
        const elementIsGlobal = elementIsWindow || element === html || element === body;

        //
        if( !elementIsGlobal ){
            this.#element = this.#scroller = element;
        }

        //
        const classNameIsValid = typeof className === 'string' && !!className.length;

        // no class name, nothing to do
        if (!classNameIsValid) {
            throw new TypeError('Invalid locked-state className provided');
        }

        // stores the scrollable element reference
        this.#className = className;

        // if an instance has already been initialized on this very element, there could be conflicts in events handling
        if (instances.has(this.element)) {
            throw new Error('An instance has already been initialized on the given element');
        }

        // adds this instance to the instances collection
        instances.set(this.element, this);

        // sets the initial state (css variables, etc...) through update method call
        this.update();

        // attaches resize event listener
        addListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // attaches scroll event listener
        addListener(this.scroller, EVENT_NAME_SCROLL, this.#scrollHandler);
    }

    /**
     * The scrollable element target
     */
    #element = DEFAULT_ELEMENT;

    /**
     * The actual scroll element target (when targeting body or html, window is the listener target etc...)
     */
    #scroller = DEFAULT_SCROLLER;

    /**
     * The lock state class name
     */
    #className = DEFAULT_CLASSNAME;

    /**
     * The scroll position
     */
    #scroll = { top: 0, left: 0 };

    /**
     * The scrollbars size
     */
    #scrollbar = { vertical: 0, horizontal: 0 };

    /**
     * The styler, css variables holder
     */
    #styler = doc.createElement('style');

    /**
     * 
     */
    #resizeHandler = debounce(() => {
        //
        this.#setScrollbarValue();

        //
        this.#updateStyles();
    }, RESIZE_DEBOUNCE_INTERVAL_MS);

    /**
     * 
     */
    #scrollHandler = debounce(() => {
        //
        this.#setScrollValue();

        //
        this.#updateStyles();
    }, SCROLL_DEBOUNCE_INTERVAL_MS);

    /**
     * 
     */
    #performUnlockedAction = action => {
        //
        const { classList } = this.element;

        //
        const wasLocked = classList.contains(this.className);

        //
        classList.remove(this.className);

        //
        action();

        //
        if (wasLocked) {
            classList.add(this.className);
        }
    };

    /**
     * 
     */
    #setScrollbarValue = () => this.#performUnlockedAction(() => (this.#scrollbar = getScrollbarsGaps(this.element, this.scroller)));

    /**
     * 
     */
    #setScrollValue = () => this.#performUnlockedAction(() => (this.#scroll = getScrollPosition(this.scroller)));

    /**
     * 
     */
    #updateStyles = () => setStyles(this.element, this.styler, this.scroll, this.scrollbar);

    /**
     * Returns the scrollable element reference
     * @returns {HTMLElement} The scrollable element reference
     */
    get element() {
        return this.#element;
    }

    /**
     * 
     */
    get scroller(){
        return this.#scroller;
    }

    /**
     * 
     */
    get className() {
        return this.#className;
    }

    /**
     * Returns the current scroll position, if on a locked state it returns the currently saved scroll position object
     * @returns {Object} The current scroll position object or the scroll position previously saved if on a locked state
     */
    get scroll() {
        return this.#scroll;
    }

    /**
     * Sets a new scroll position, if on a locked state it saves that given scroll position for a future scroll restoration
     * @param {Object} position The scroll position to be set or saved if on a locked state
     */
    set scroll(position) {
        this.#performUnlockedAction(() => scrollTo(this.scroller, position));
    }

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar() {
        return this.#scrollbar;
    }

    /**
     * Gets the given scrollable element (associated) styler
     * @returns {HTMLStyleElement} Styler element
     */
    get styler() {
        return this.#styler;
    }

    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {void} Nothing
     */
    destroy() {
        // removes the css variables, styler, styler selector...
        unsetStyles(this.element, this.styler);

        // detaches the scroll event listener
        removeListener(this.scroller, EVENT_NAME_SCROLL, this.#scrollHandler);

        // detaches the resize event listener
        removeListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // removing the instance from the instances collection
        instances.delete(this.element);

        // removes the scrollable element reference
        this.#element = null;

        //
        this.#scroller = null;
    }

    /**
     * Updates css variables to the current state
     * @returns {void} Nothing
     */
    update() {
        //
        this.#setScrollValue();

        //
        this.#setScrollbarValue();

        //
        this.#updateStyles();
    }
}
