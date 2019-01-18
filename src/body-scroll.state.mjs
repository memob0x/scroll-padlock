import { html } from './body-scroll.client.mjs';

export let state = {
    scroll: {
        top: 0,
        left: 0
    },
    bars: {
        x: 0,
        y: 0
    },
    html: {
        width: null,
        height: null
    },
    body: {
        width: null,
        height: null,
    }
};

export const setState = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scroll = {
        top: html.scrollTop,
        left: html.scrollLeft
    };
    const bars = {
        y: vw - html.clientWidth,
        x: vh - html.clientHeight
    };

    state = {
        ...state,
        ...{
            scroll: scroll,
            bars: bars,
            html: {
                width: vw + scroll.left,
                height: vh + scroll.top
            },
            body: {
                width: html.scrollWidth,
                height: html.scrollHeight,
                paddingRight: bars.y,
                paddingBottom: bars.x
            }
        }
    };
};
