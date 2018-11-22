import { html } from './body-scroll.client.mjs';

export let state = {
    scroll: {
        top: 0,
        left: 0,
        behavior: 'auto'
    },
    dimensions: {
        width: 0,
        height: 0
    },
    scrollbar: {
        y: 0,
        x: 0
    }
};

export const setState = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = html.clientWidth;
    const height = html.clientHeight;
    const scroll = {
        top: html.scrollTop,
        left: html.scrollLeft
    };
    const scrollbars = {
        y: vw > width ? vw - width : 0,
        x: vh > height ? vh - height : 0
    };

    state = {
        ...state,
        ...{
            scroll: scroll,
            html: {
                width: vw + scroll.left - scrollbars.y,
                height: vh + scroll.top - scrollbars.x
            },
            body: {
                width: html.scrollWidth,
                height: html.scrollHeight
            },
            scrollbars: scrollbars
        }
    };
};
