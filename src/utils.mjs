/**
 * 
 * @param fn 
 * @param delay 
 */
export const throttle = (fn, delay) => {
    let timeout = false;

    return (...rest) => {
        if ( timeout ) {
            return;
        }

        timeout = true;

        fn.apply(window, rest);

        setTimeout(() => (timeout = false), delay);
    };
};

/**
 * 
 * @param fn 
 * @param interval 
 */
export const debounce = (fn, interval) => {
    let timeout;

    return (...rest) => {
        clearTimeout(timeout);
        
        timeout = setTimeout(() => fn.apply(window, rest), interval);
    };
};
