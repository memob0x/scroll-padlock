import { html } from "./client.mjs";

import { lock, unlock, isLocked } from "./state.mjs";

import {
    updateCssVariables,
    getScrollbarsGaps,
    addBaseCssClass,
    removeBaseCssClass,
    clearStyle
} from "./style.mjs";

import {
    restoreScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition
} from "./scroll.mjs";

import {
    addResizeEventListener,
    removeResizeEventListener
} from "./resize.mjs";

export default class {
    /**
     * Creates the scroll padlock class instance on a given scrollable element
     * @param {HTMLElement} element The given scrollable element whose scroll needs to be controlled
     * @returns {void} Nothing
     */
    constructor(element = html){
        // if the given scrollable element is not a valid html element, there's not much to do
        if( !(element instanceof HTMLElement) ){
            throw new TypeError('The scrollable element must be a valid html element');
        }

        // stores the scrollable element reference
        this.#element = element;

        // adds a base css class to imprint that the library has been initialized
        addBaseCssClass(this.#element);

        // sets the initial state (css variables, etc...) through update method call
        this.update();

        // attaches resize event listener
        addResizeEventListener(this.#element);
    }

    /**
     * The scrollable element reference
     */
    #element;

    /**
     * Returns the current lock state as a boolean
     * @returns {Boolean} True if body scroll is locked, false if not
     */
    get state(){
        return isLocked(this.#element);
    }

    /**
     * Returns the currently saved scroll position object
     * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
     */
    get scroll(){
        return getSavedScrollPosition(this.#element);
    }

    /**
     * Gets the current vertical scrollbar width size in px unit
     * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
     */
    get scrollbar(){
        return getScrollbarsGaps(this.#element);
    }
    
    /**
     * Effectively destroy the instance, detaching event listeners, removing styles, etc...
     * @returns {Boolean} True if the destruction has been presumably effective
     */
    destroy(){
        // unlocks a possible locked state
        this.unlock();

        // removes the instance initialization css class
        removeBaseCssClass(this.#element);

        // removes the css variables and stylers
        clearStyle(this.#element);

        // detaches the resize event listener
        removeResizeEventListener(this.#element);

        // caches the element reference availability in order to return it later (acts as a success/error state)
        const validElement = !!this.#element;

        // removes the scrollable element reference
        this.#element = null;
        
        // if the element was set (true) then the destruction has been successful
        return validElement;
    }

    /**
     * Locks the body scroll
     * @returns {Boolean} True if the lock has been successfully done, false if not
     */
    lock(){
        return lock(this.#element);
    }

    /**
     * Unlocks the body scroll
     * @returns {Boolean} True if the unlock has been successfully done, false if not
     */
    unlock(){
        return unlock(this.#element);
    }

    /**
     * Updates css variables to the current state
     * @returns {void} Nothing
     */
    update(){
        return updateCssVariables(this.#element);
    }

    /**
     * Saves a given valid scroll position object, if not passed saves the current body scroll position
     * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
     */
    save(){
        return saveScrollPosition(this.#element);
    }

    /**
     * Restores a given valid scroll position object, if not passed possibly restores a previously saved scroll position object
     * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
     */
    restore(){
        return restoreScrollPosition(this.#element);
    }
};
