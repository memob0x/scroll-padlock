import { win } from './client.js';

const clear = win.clearImmediate || win.clearTimeout;
const set = win.setImmediate || win.setTimeout;

/**
 * Debounces a given function
 * @param {Function} fn The function to be debounced
 * @returns {Function} The wrapped function
 */
export default fn => {
    let timeout;

    return (...rest) => {
        clear(timeout);

        timeout = set(() => fn.apply(null, rest));
    };
};
