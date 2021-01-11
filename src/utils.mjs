/**
 * 
 * @param {Function} fn 
 * @param {Number} interval 
 * @returns {Function} 
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
 * 
 * @param {HTMLElement} element 
 * @returns {Number}
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
 * 
 * @param {HTMLElement} element 
 * @returns {Number}
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
