import { html } from './client.mjs';

import { lock, unlock, isLocked } from './state.mjs';

import {
    updateCssVariables,
    getScrollbarsGaps,
    addBaseCssClass,
    removeBaseCssClass,
    clearStyle,
    getStyler
} from './style.mjs';

import {
    restoreScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition,
    getScrollPosition
} from './scroll.mjs';

import {
    addResizeEventListener,
    removeResizeEventListener
} from './resize.mjs';

// instances collection closure
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

export default class ScrollPadlock {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {HTMLElement} [element=document.document.Element] The given scrollable element whose scroll needs to be controlled
     * @returns {void} Nothing
     */
    constructor(element = html){
        // if the given scrollable element is not a valid html element, there's not much to do
        if( !(element instanceof HTMLElement) ){
            throw new TypeError('The scrollable element must be a valid html element');
        }

        // stores the scrollable element reference
        this.#element = element;

        // if an instance has already been initialized on this very element, there could be conflicts in events handling
        if( instances.has(this.element) ){
            throw new Error('An instance has already been initialized on the given element');
        }

        // adds this instance to the instances collection
        instances.set(this.element, this);

        // adds a base css class to imprint that the library has been initialized
        addBaseCssClass(this.element);

        // sets the initial state (css variables, etc...) through update method call
        this.update();

        // attaches resize event listener
        addResizeEventListener(this.element);
    }

    /**
     * The scrollable element reference
     */
    #element;

    /**
     * Returns the scrollable element reference
     * @returns {HTMLElement} The scrollable element reference
     */
    get element(){
        return this.#element;
    }

    /**
     * Returns the current lock state as a boolean
     * @returns {Boolean} True if element scroll is locked, false if element scroll is not locked
     */
    get state(){
        return isLocked(this.element);
    }

    /**
     * Sets the given state
     * @param {Boolean} True if element scroll is going to be locked, false if it is going to be set free
     */
    set state(state){
        if( state ){
            lock(this.element);

            return;
        }

        unlock(this.element);
    }

    /**
     * Returns the current scroll position, if on a locked state it returns the currently saved scroll position object
     * @returns {Object} The current scroll position object or the scroll position previously saved if on a locked state
     */
    get scroll(){
        return this.state ? getSavedScrollPosition(this.element) : getScrollPosition(this.element);
    }

    /**
     * Sets a new scroll position, if on a locked state it saves that given scroll position for a future scroll restoration
     * @param {Object} position The scroll position to be set or saved if on a locked state
     */
    set scroll(position){
        if( this.state ){
            saveScrollPosition(this.element, position);

            return;
        }
        
        restoreScrollPosition(this.element, position);
    }

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar(){
        return getScrollbarsGaps(this.element);
    }

    /**
     * Gets the given scrollable element (associated) styler
     * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
     * @returns {HTMLStyleElement|null} Styler element, null if not inserted to head
     */
    get styler(){
        return getStyler(this.element);
    }
    
    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {Boolean} True if the destruction has been presumably effective
     */
    destroy(){
        // unlocks a possible locked state
        this.state = false;

        // removes the instance initialization css class
        removeBaseCssClass(this.element);

        // removes the css variables and stylers
        clearStyle(this.element);

        // detaches the resize event listener
        removeResizeEventListener(this.element);
        
        // removing the instance from the instances collection
        instances.delete(this.element);

        // caches the element reference availability in order to return it later (acts as a success/error state)
        const validElement = !!this.element;

        // removes the scrollable element reference
        this.#element = null;
        
        // if the element was set (true) then the destruction has been successful
        return validElement;
    }

    /**
     * Updates css variables to the current state
     * @returns {HTMLStyleElement} Styler element
     */
    update(){
        return updateCssVariables(this.element);
    }
}
