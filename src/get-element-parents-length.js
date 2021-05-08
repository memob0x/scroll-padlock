import getElementParent from './get-element-parent.js';

/**
 * Gets the number of ancestors of a given element
 * @param {HTMLElement} element The given element to be checked
 * @returns {Number} The number of ancestors of the given element
 */
export default element => {
    let count = -1;

    while (element) {
        count++;

        element = getElementParent(element);
    }

    return count;
};
