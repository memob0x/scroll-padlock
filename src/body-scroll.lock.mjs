import { html, body, head, styler } from './body-scroll.client.mjs';
import { setScrollState, status, setStatus } from './body-scroll.state.mjs';
import { scrollbarGapSelectors } from './body-scroll.register-selectors.mjs';

export const lock = () => {
    if (!status) {
        let vw = 0;
        let vh = 0;
        let hw = 0;
        let hh = 0;
        let scrollbars = {};

        const hasScrollbarsGapSelectors = scrollbarGapSelectors.length;

        const scrollState = setScrollState({
            top: html.scrollTop,
            left: html.scrollLeft
        });
        let bw = body.clientWidth;
        let bh = body.clientHeight;
        bw -= bw - body.offsetWidth;
        bh -= bh - body.offsetHeight;
        if (hasScrollbarsGapSelectors) {
            vw = window.innerWidth;
            vh = window.innerHeight;
            hw = html.clientWidth;
            hh = html.clientHeight;
            scrollbars = {
                y: vw > hw ? vw - hw : 0,
                x: vh > hh ? vh - hh : 0
            };
        }

        /*
        p.fixed: freezes scroll on all devices
        top/left: the scroll position
        margin/padding: resets purpuses (other libs overwrite)
        width/height: freeze document width/height and reserve scrollbars gap
        */
        let css = `
        html {
            position: fixed!important;
            top: ${scrollState.top * -1}px!important;
            left: ${scrollState.left * -1}px!important;
            right: auto!important;
            bottom: auto!important;
        }
        html,
        body {
            margin: 0!important;
            padding: 0!important;
            min-width: ${bw}px!important;
            width: ${bw}px!important;
            max-width: ${bw}px!important;
            min-height: ${bh}px!important;
            height: ${bh}px!important;
            max-height: ${bh}px!important;
            overflow: visible!important;
        }`;

        if (hasScrollbarsGapSelectors) {
            scrollbarGapSelectors.forEach(entry => {
                const gap =
                    scrollbars[
                        entry.property.indexOf('right') > -1 ? 'y' : 'x'
                    ];
                if (gap > 0) {
                    css += `
                    ${entry.selector} {
                        ${entry.property}: ${gap}px!important;
                    }`;
                }
            });
        }

        if (styler.styleSheet) {
            styler.styleSheet.cssText = css;
        } else {
            styler.innerHTML = '';
            styler.appendChild(document.createTextNode(css));
        }

        head.appendChild(styler);

        setStatus(true);
    }
};
