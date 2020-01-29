/**
 *
 */
let _x = 0;
let _y = 0;

/**
 *
 */
export const save = () => {
    _x = window.scrollX;
    _y = window.scrollY;
};

/**
 *
 */
export const restore = () => window.scrollTo(_x, _y);
