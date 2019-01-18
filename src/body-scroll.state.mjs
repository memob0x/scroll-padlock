// TODO: cleanup!
import { html, isSafariIOS } from './body-scroll.client.mjs';

export let state = {
    scroll: {
        top: 0,
        left: 0
    },
    html: {
        height: 'auto'
    },
    body: {
        height: 'auto',
        paddingRight: 0
    },
    bars: {
        x: 0,
        y: 0
    }
};

export const setState = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = html.clientWidth;
    const height = html.clientHeight;

    let _state = {
        ...state,
        ...{
            scroll: {
                top: html.scrollTop,
                left: html.scrollLeft
            },
            bars: {
                y: vw > width ? vw - width : 0,
                x: vh > height ? vh - height : 0
            }
        }
    };

    if (isSafariIOS) {
        _state.html.height = vh + _state.scroll.top;
        _state.body.height = html.scrollHeight;
    }

    _state.body.paddingRight = _state.bars.y;

    state = _state;
};
