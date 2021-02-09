/**
 * Debounces a given function to a given interval in milliseconds
 * @param {Function} fn The function to be debounced
 * @param {Number} interval The debounce time
 * @returns {Function} The wrapped function
 */
// Thanks to https://www.collegestash.com/debounce/
export default (fn, interval) => {
    let timeout;

    return (...rest) => {
        clearTimeout(timeout);

        timeout = setTimeout(() => fn.apply(null, rest), interval);
    };
};
