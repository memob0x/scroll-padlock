import { DOM_BASE_NAME, EVENT_NAME_SCROLL, EVENT_NAME_RESIZE, doc, documentElement, body, addListener, removeListener } from './client.mjs';

import { debounce } from './utils.mjs';

import { SCROLL_TOP, SCROLL_LEFT, getScroll } from './scroll.mjs';

import { getDimensions } from './dimensions.mjs';

import { getScrollbars } from './scrollbars.mjs';

import { setStyles, unsetStyles } from './style.mjs';

// Default class members values
const DEFAULT_ELEMENT = documentElement;
const DEFAULT_TARGET = body;
const DEFAULT_SCROLLER = window;
const DEFAULT_CSS_CLASS_NAME = `${DOM_BASE_NAME}-locked`;

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
     * @param {String} [cssClassName] The given scrollable element whose scroll needs to be controlled
     */
    constructor(element = DEFAULT_ELEMENT, cssClassName = DEFAULT_CSS_CLASS_NAME) {
        // Window as element argument support
        const elementIsWindow = element === window;

        // Scrollable html elements support
        const elementIsHtmlElement = element instanceof HTMLElement;

        // If the given scrollable element is not supported (valid html element or page)
        // there's nothing to do, but throwing an exception
        if (!elementIsWindow && !elementIsHtmlElement) {
            throw new TypeError('Invalid element provided to constructor');
        }

        //
        if (elementIsHtmlElement) {
            this.#target = element;
        }

        // Global page (window, html or body as element argument)
        const elementIsGlobal = elementIsWindow || element === documentElement || element === body;

        // Custom scrollable element case:
        // if the given element is not global (page scroll)
        // then replace "element" and "scroller" private members with that element
        if (!elementIsGlobal) {
            this.#element = this.#target = this.#scroller = element;
        }

        // If an instance has already been initialized on this very element, there could be conflicts in events handling etc,
        // throws an exception in this case
        if (instances.has(this.#element)) {
            throw new Error(`An instance has already been initialized on ${elementIsGlobal ? 'page scroll' : 'the given element'}`);
        }

        // Instance is not registered ad this point,
        // so this one is added to the instances collection
        instances.set(this.#element, this);

        //
        this.#classList = this.#target.classList;

        // Lock state css class validity check, must be a string and a valid one
        const classNameIsValid = typeof cssClassName === 'string' && !!cssClassName.length;

        // No class name, nothing to do, but throwing an exception
        if (!classNameIsValid) {
            throw new TypeError('Invalid CSS class name provided to constructor');
        }

        // Stores the class name as a private member
        this.#cssClassName = cssClassName;

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
    #element = DEFAULT_ELEMENT;

    /**
     * 
     */
    #target = DEFAULT_TARGET;

    /**
     * The actual scroll element target, the element that can perform and listen to scroll event
     * Usually coincides with "element", but when "element" is document.documentElement, "scroller" is window
     */
    #scroller = DEFAULT_SCROLLER;

    /**
     * 
     */
    #classList;

    /**
     * The lock state class name
     */
    #cssClassName = DEFAULT_CSS_CLASS_NAME;

    /**
     * 
     */
    #state;

    /**
     * The scroll position
     */
    #scrollCurrent;

    /**
     * 
     */
    #scrollSaving;

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
        //
        if (this.#state) {
            this.#scrollSaving = position;

            return;
        }

        //
        this.#scrollTo(position);
    }

    /**
     * 
     */
    #observer = new MutationObserver(() => {
        //
        const state = this.#state;

        //
        this.#updateState();

        // No state change, exiting early
        if (this.#state === state) {
            return;
        }

        // State changed to true
        if (this.#state) {
            this.#scrollSaving = { ...this.#scrollCurrent };

            return;
        }

        // State changed to false, restoring scroll position
        this.#scrollTo(this.#scrollSaving);
    });

    /**
     * 
     */
    #dimensions;

    /**
     * 
     * @returns {Object}
     */
    get dimensions() {
        return this.#dimensions;
    }

    /**
     * The scrollbars size
     */
    #scrollbar;

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar() {
        return this.#scrollbar;
    }

    /**
     * The styler, css variables holder
     */
    #styler = doc.createElement('style');

    /**
     * Window resize event handler
     */
    #resizeHandler = debounce(() => {
        //
        this.#performUnlockedAction(() => {
            // 
            this.#updateDimensions();

            // 
            this.#updateScrollbar();
        });

        // Rewrites css variables
        this.#applyStyles();
    }, RESIZE_DEBOUNCE_INTERVAL_MS);

    /**
     * Element scroll event handler
     */
    #scrollHandler = debounce(() => {
        // Refresh scrollbars size
        this.#performUnlockedAction(this.#updateScroll);

        // Rewrites css variables
        this.#applyStyles();
    }, SCROLL_DEBOUNCE_INTERVAL_MS);

    /**
     * 
     * @param {Object} position
     * @returns {Object}
     */
    #scrollTo = position => this.#scroller.scrollTo(position[SCROLL_LEFT], position[SCROLL_TOP]);

    /**
     * 
     * @returns {Boolean}
     */
    #updateState = () => (this.#state = this.#classList.contains(this.#cssClassName));

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
        this.#classList.remove(this.#cssClassName);

        // Fires the given function and caches the return value
        const result = action();

        // Relocks the css class if was set before
        if (wasLocked) {
            this.#classList.add(this.#cssClassName);
        }

        //
        this.#observeCssClass();

        // Returns what the given function returns
        return result;
    };

    /**
     * 
     * @returns {Object}
     */
    #updateDimensions = () => (this.#dimensions = getDimensions(this.#element, this.#scroller));

    /**
     * Refresh the scrollbars size at a (temporarly) unlocked state
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    #updateScrollbar = () => (this.#scrollbar = getScrollbars(this.#dimensions));

    /**
     * Refresh the scroll position at a (temporarly) unlocked state
     * @returns {Object} The current scroll position object
     */
    #updateScroll = () => (this.#scrollCurrent = getScroll(this.#scroller));

    /**
     * Rewrites the css variables with current data
     * @returns {HTMLStyleElement} Styler element
     */
    #applyStyles = () => setStyles(this.#target, this.#styler, this.#dimensions, this.scroll, this.scrollbar);

    /**
     * 
     * @returns {void} Nothing
     */
    #observeCssClass = () => this.#observer.observe(this.#target, {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
    });

    /**
     * 
     * @returns {void} Nothing
     */
    #unobserveCssClass = () => this.#observer.disconnect();

    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {void} Nothing
     */
    destroy() {
        //
        this.#unobserveCssClass();

        // Removes the css variables, styler, styler selector...
        unsetStyles(this.#element, this.#styler);

        // Detaches the scroll event listener
        removeListener(this.#scroller, EVENT_NAME_SCROLL, this.#scrollHandler);

        // Detaches the resize event listener
        removeListener(window, EVENT_NAME_RESIZE, this.#resizeHandler);

        // Removes the instance from the instances collection
        instances.delete(this.#element);

        // Removes the element reference
        this.#element = null;

        // Removes the scroller reference
        this.#scroller = null;
    }

    /**
     * Re-evaluates dimensions and such, updates css variables to the current state...
     * @returns {void} Nothing
     */
    update() {
        // Refresh the css class state
        this.#updateState();

        //
        this.#performUnlockedAction(() => {
            //
            this.#updateDimensions();

            // Refresh scrollbars size
            this.#updateScrollbar();

            // Refresh scroll position
            this.#updateScroll();
        });

        // Rewrites css variables
        this.#applyStyles();
    }
}
