import { html } from "./body-scroll.client.mjs";
import { lock, unlock, isLocked } from "./body-scroll.state.mjs";
import {
    updateCssVariables,
    getScrollbarsGaps,
    clearStyle
} from "./body-scroll.style.mjs";
import {
    restoreScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition
} from "./body-scroll.scroll.mjs";
import {
    addResizeEventListener,
    removeResizeEventListener
} from "./body-scroll.resize.mjs";

export default class {
    /**
     * 
     * @param element 
     */
    constructor(element = html){
        this.#element = element;

        this.update();

        addResizeEventListener(this.#element);
    }

    #element;

    /**
     * 
     */
    get state(){
        return isLocked(this.#element);
    }

    /**
     * 
     */
    get scroll(){
        return getSavedScrollPosition(this.#element);
    }

    /**
     * 
     */
    get scrollbar(){
        return getScrollbarsGaps(this.#element);
    }
    
    /**
     * 
     */
    destroy(){
        this.unlock();

        clearStyle(this.#element);

        removeResizeEventListener(this.#element);

        const validElement = !!this.#element;

        this.#element = null;
        
        return validElement;
    }

    /**
     * 
     */
    lock(){
        return lock(this.#element);
    }

    /**
     * 
     */
    unlock(){
        return unlock(this.#element);
    }

    /**
     * 
     */
    update(){
        return updateCssVariables(this.#element);
    }

    /**
     * 
     */
    save(){
        return saveScrollPosition(this.#element);
    }

    /**
     * 
     */
    restore(){
        return restoreScrollPosition(this.#element);
    }
};
