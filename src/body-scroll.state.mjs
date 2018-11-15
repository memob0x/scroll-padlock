export let status = false;
export const setStatus = (bool = true) => (status = bool);

export let scrollState = {
    top: 0,
    left: 0,
    behavior: 'auto'
};
export const setScrollState = (obj = {}) =>
    (scrollState = {
        ...scrollState,
        ...obj
    });
