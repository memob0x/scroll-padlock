import { status } from './body-scroll.status.mjs';

export let settings = {
    incubator: false, // experimental feature
    important: true,
    overflowHidden: false
};

export const setOptions = (options = {}) => {
    if (!status) {
        settings = { ...settings, ...options };
    }
};
