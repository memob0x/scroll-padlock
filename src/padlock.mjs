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
     * Creates the ScrollPadlock class
     * @param {HTMLElement} element The given scrollable element whose scroll needs to be controlled
     * @returns {void} Nothing
     */
    constructor(element = html){
        if( !(element instanceof HTMLElement) ){
            throw new Error('ScrollPadlock element must be an instance of HTMLElement');
        }

        this.#element = element;

        addBaseCssClass(this.#element);

        this.update();

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
        this.unlock();

        removeBaseCssClass(this.#element);

        clearStyle(this.#element);

        removeResizeEventListener(this.#element);

        const validElement = !!this.#element;

        this.#element = null;
        
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
