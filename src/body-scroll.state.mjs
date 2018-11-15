import { html, body } from './toolbox/src/toolbox.client.mjs';

let status = false;
export const setStatus = bool => (status = bool);
export const getStatus = () => status;

let scrollTo = {
    top: 0,
    left: 0,
    behavior: 'auto'
};
export const setScrollTo = () => {
    scrollTo = {
        top: body.scrollTop || html.scrollTop,
        left: body.scrollLeft || html.scrollLeft
    };
};
export const getScrollTo = () => scrollTo;
