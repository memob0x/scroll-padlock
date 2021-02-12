import { win, doc, documentElement, body, head } from './client.mjs';

import {
    SCROLL_LEFT,
    SCROLL_TOP,
    DEFAULT_CSS_CLASS_NAME,
    LISTENER_METHOD_ADD,
    LISTENER_METHOD_REMOVE,
    EVENT_NAME_RESIZE,
    EVENT_NAME_SCROLL,
    RESIZE_DEBOUNCE_INTERVAL_MS,
    SCROLL_DEBOUNCE_INTERVAL_MS,
    STYLER_METHOD_ADD,
    STYLER_METHOD_REMOVE
} from './constants.mjs';

import listener from './listener.mjs';

import debounce from './debounce.mjs';

import getLayout from './get-layout-dimensions.mjs';

import getScroll from './get-scroll-position.mjs';

import styler from './styler.mjs';

// Instances collection closure,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

//
const defaultElement = documentElement;

export default class ScrollPadlock {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {Window|HTMLElement} [element] The given scrollable element whose scroll needs to be controlled
     * @param {String} [cssClassName] The given scrollable element whose scroll needs to be controlled
     */
    constructor(element = defaultElement, cssClassName = DEFAULT_CSS_CLASS_NAME) {
        // Window as element argument support
        const elementIsWindow = element === win;

        // Scrollable html elements support
        const elementIsHtmlElement = element instanceof HTMLElement;

        // If the given scrollable element is not supported (valid html element or page)
        // there's nothing to do, but throwing an exception
        if (!elementIsWindow && !elementIsHtmlElement) {
            throw new TypeError('Invalid element provided to constructor');
        }

        // If the given element is a valid html element, then its reference is set to an instance member
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

        // Stores the given element class list reference
        this.#classList = this.#target.classList;

        // Lock state css class validity check, must be a string and a valid one
        const classNameIsValid = typeof cssClassName === 'string' && !!cssClassName.length;

        // No class name, nothing to do, but throwing an exception
        if (!classNameIsValid) {
            throw new TypeError('Invalid CSS class name provided to constructor');
        }

        // Stores the class name as a private member
        this.#cssClassName = cssClassName;

        // Fires the public update method to initialize everything;
        // computes scroll position, scrollbars sizes and writes css variables
        this.update();

        // Observes the given element CSS class list for given CSS class name changes
        this.#observeCssClass();

        // Attaches resize event listener
        listener(LISTENER_METHOD_ADD, win, EVENT_NAME_RESIZE, this.#resizeHandler);

        // Attaches scroll event listener
        listener(LISTENER_METHOD_ADD, this.#scroller, EVENT_NAME_SCROLL, this.#scrollHandler);
    }

    /**
     * The lock state element target, usually the scrollable element
     */
    #element = defaultElement;

    /**
     * The original given element (the one provided to the class constructor)
     */
    #target = body;

    /**
     * The actual scrollable element (the element that can perform and listen to scroll event)
     * Usually coincides with "element", but when "element" is document.documentElement, "scroller" is window
     */
    #scroller = window;

    /**
     * The original given element CSS class list
     */
    #classList;

    /**
     * The lock state CSS class name
     */
    #cssClassName = DEFAULT_CSS_CLASS_NAME;

    /**
     * The scroll lock state
     */
    #state;

    /**
     * The current scroll position
     */
    #scrollCurrent;

    /**
     * The scroll position saving, the scroll position stored for later use
     */
    #scrollSaving;

    /**
     * Returns the current scroll position, if on a locked state it returns the currently saved scroll position object
     * @returns {Object} The current scroll position object or the scroll position previously saved if on a locked state
     */
    get scroll() {
        // If the state is locked, the saved scroll position is returned, otherwise the current scroll position is returned
        return this.#state ? this.#scrollSaving : this.#scrollCurrent;
    }

    /**
     * Sets a new scroll position, if on a locked state it saves that given scroll position for a future scroll restoration
     * @param {Object} position The scroll position to be set or saved if on a locked state
     */
    set scroll(position) {
        // The scroll is locked...
        if (this.#state) {
            // ...the given scroll position is saved for later use...
            this.#scrollSaving = position;

            // ...then exits early
            return;
        }

        // The scroll is not locked, then a scrollTo native DOM api is triggered
        // (current scroll position will be retrieve through "scroll" event listener)
        this.#scrollTo(position);
    }

    /**
     * The layout dimensions
     */
    #layout;

    /**
     * Gets the layout dimensions, such as widths, heights, scrollbars etc...
     * @returns {Object} The layout object
     */
    get layout() {
        return this.#layout;
    }

    /**
     * The current css class observer state
     * True if observing, false if not
     */
    #observerState = false;

    /**
     * State MutationObserver object,
     * registers the callback fired on CSS class change
     */
    #observer = (implementationName => implementationName in win ? new win[implementationName](() => {
        // Caches the current scroll lock state before updating it
        const state = this.#state;

        // Updates lock state member
        this.#updateState();

        // No state change...
        if (this.#state === state) {
            // ...exits early
            return;
        }

        // State changed to true...
        if (this.#state) {
            // ...copies the current scroll position to another private member (saves current scroll position)
            this.#scrollSaving = { ...this.#scrollCurrent };

            // ...and exits early
            return;
        }

        // State changed to false, restoring scroll position
        this.#scrollTo(this.#scrollSaving);
    }) : null)('MutationObserver');

    /**
     * The styler, css variables holder
     */
    #styler = doc.createElement('style');

    /**
     * Window resize event handler
     */
    #resizeHandler = debounce(() => {
        // Refresh layout
        this.#performUnlockedAction(this.#updateLayout);

        // Rewrites css variables
        this.#applyStyles();
    }, RESIZE_DEBOUNCE_INTERVAL_MS);

    /**
     * Element scroll event handler
     */
    #scrollHandler = debounce(() => {
        // Refresh scrollbars size
        this.#performUnlockedAction(this.#updateScrollCurrent);

        // Rewrites css variables
        this.#applyStyles();
    }, SCROLL_DEBOUNCE_INTERVAL_MS);

    /**
     * Scrolls the given element to a given scroll position
     * @param {Object} position The scroll position to be set
     * @returns {void} Nothing
     */
    #scrollTo = position => this.#scroller.scrollTo(position[SCROLL_LEFT], position[SCROLL_TOP]);

    /**
     * Updates the scroll state
     * @returns {Boolean} The scroll state
     */
    #updateState = () => (this.#state = !!this.#classList?.contains(this.#cssClassName));

    /**
     * Fires a given function at a unlocked scroll state
     * @param {Function} action The given function to be fired at unlocked scroll state
     * @returns {any} Anything the given function returns is returned
     */
    #performUnlockedAction = action => {
        // Caches the scroll lock state (true if css class is set, thus on a locked state)
        const wasLocked = this.#state;

        // Temporarily unobserves the CSS class change
        this.#unobserveCssClass();

        // Removes the css class temporarly
        this.#classList?.remove(this.#cssClassName);

        // Fires the given function and caches the return value
        const result = action();

        // Relocks the css class if was set before
        if (wasLocked) {
            this.#classList?.add(this.#cssClassName);
        }

        // Observes the given element CSS class list for given CSS class name changes
        this.#observeCssClass();

        // Returns what the given function returns
        return result;
    };

    /**
     * Updates the layout object
     * @returns {Object} The layout object
     */
    #updateLayout = () => (this.#layout = getLayout(this.#element, this.#scroller));

    /**
     * Refresh the scroll position at a (temporarly) unlocked state
     * @returns {Object} The current scroll position object
     */
    #updateScrollCurrent = () => (this.#scrollCurrent = getScroll(this.#scroller));

    /**
     * Rewrites the css variables with current data
     * @returns {HTMLStyleElement} Styler element
     */
    #applyStyles = () => styler(STYLER_METHOD_ADD, this.#target, this.#styler, head, this.layout, this.scroll);

    /**
     * Observes the element CSS class changes
     * @returns {Boolean} The css class observer state
     */
    #observeCssClass = () => {
        if( this.#observerState ){
            return this.#observerState;
        }

        this.#observer?.observe(this.#target, {
            attributes: true,
            attributeFilter: ['class'],
            childList: false,
            characterData: false
        });
        
        return this.#observerState = !!this.#observer;
    };

    /**
     * Unobserves the element CSS class changes
     * @returns {Boolean} The css class observer state
     */
    #unobserveCssClass = () => {
        if( !this.#observerState ){    
            return this.#observerState;
        }
        
        this.#observer?.disconnect();
        
        return this.#observerState = false;
    };

    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {void} Nothing
     */
    destroy() {
        // Unobserves the CSS class change
        this.#unobserveCssClass();

        // Removes the CSS variables, styler, styler selector...
        styler(STYLER_METHOD_REMOVE, this.#element, this.#styler);

        // Detaches the scroll event listener
        listener(LISTENER_METHOD_REMOVE, this.#scroller, EVENT_NAME_SCROLL, this.#scrollHandler);

        // Detaches the resize event listener
        listener(LISTENER_METHOD_REMOVE, win, EVENT_NAME_RESIZE, this.#resizeHandler);

        // Removes the instance from the instances collection
        instances.delete(this.#element);

        // Removes references
        this.#element = this.#target = this.#scroller = this.#observer = this.#styler = this.#classList = null;
    }

    /**
     * Re-evaluates dimensions and such, updates css variables to the current state...
     * @returns {void} Nothing
     */
    update() {
        // Refresh the css class state
        this.#updateState();

        // Perform layout an scroll position refresh at unlocked state
        this.#performUnlockedAction(() => {
            // Refresh layout
            this.#updateLayout();

            // Refresh scroll position
            this.#updateScrollCurrent();
        });

        // Rewrites css variables
        this.#applyStyles();
    }
}
