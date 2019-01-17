import { html, isSafariIOS } from './body-scroll.client.mjs';

export let state = {
    scroll: {
        top: 0,
        left: 0,
        behavior: 'auto'
    },
    html: {
        width: 'auto',
        height: 'auto'
    },
    body: {
        width: 'auto',
        height: 'auto',
        paddingRight: 0,
        paddingBottom: 0 // not useful // TODO: check
    },
    scrollbars: {
        y: 0,
        x: 0
    }
};

export const setState = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let _state = {
        ...state,
        ...{
            scroll: {
                top: html.scrollTop,
                left: html.scrollLeft
            }
        }
    };

    if (isSafariIOS) {
        _state.html = {
            width: vw + _state.scroll.left, // - _state.scrollbars.y, // ios doesn't have scrollbars anyway...
            height: vh + _state.scroll.top // - _state.scrollbars.x
        };

        _state.body = {
            width: html.scrollWidth,
            height: html.scrollHeight
        };
    } else {
        const width = html.clientWidth;
        const height = html.clientHeight;

        _state.scrollbars = {
            y: vw > width ? vw - width : 0,
            x: vh > height ? vh - height : 0
        };

        _state.body.paddingRight = _state.scrollbars.y;
        // _state.body.paddingBottom = _state.scrollbars.x; // not useful // TODO: check
    }

    state = _state;
};
