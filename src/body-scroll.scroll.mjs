/**
 *
 */
let _x = 0;
let _y = 0;

/**
 *
 */
export const save = () => {
    _x = window.pageXOffset;
    _y = window.pageYOffset;
};

/**
 *
 */
export const restore = () => window.scrollTo(_x, _y);
