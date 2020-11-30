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
     * 
     * @param element 
     */
    constructor(element = html){
        this.#element = element;

        addBaseCssClass(this.#element);

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

        removeBaseCssClass(this.#element);

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
