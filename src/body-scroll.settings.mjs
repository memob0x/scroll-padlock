import { status } from './body-scroll.status.mjs';

export let settings = {
    incubator: false // experimental feature
};

export const setOptions = (options = {}) => {
    if (!status) {
        settings = { ...settings, ...options };
    }
};
