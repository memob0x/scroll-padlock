/**
 * Debounces a given function to a given interval in milliseconds
 * @param {Function} fn The function to be debounced
 * @param {Number} interval The debounce time
 * @returns {Function} The wrapped function
 */
// Thanks to https://www.collegestash.com/debounce/
export const debounce = (fn, interval) => {
    let timeout;

    return (...rest) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => fn.apply(window, rest), interval);
    };
};


/**
 * Gets the number of ancestors of a given element
 * @param {HTMLElement} element The given element to be checked
 * @returns {Number} The number of ancestors of the given element
 */
export const getElementParentsLength = element => {
    let count = -1;

    while (element) {
        count++;

        element = element?.parentElement;
    }

    return count;
};

/**
 * Gets a given element position (index) in the DOM tree (where 0 is first-child, 1 is second etc...)
 * @param {HTMLElement} element The given element to be checked
 * @returns {Number} The position of the given element in the DOM tree
 */
export const getElementIndex = element => {
    const siblings = element?.parentElement?.children ?? [];

    let count = 0;

    for (let i = 0, j = siblings.length; i < j; i++) {
        const sibling = siblings[i];

        if (sibling === element) {
            return count;
        }

        count++;
    }

    return count;
};
