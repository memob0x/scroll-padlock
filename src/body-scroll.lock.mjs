import { setScrollTo, getScrollTo, getStatus, setStatus } from './body-scroll.state.mjs';
import { body, head } from './toolbox/src/toolbox.client.mjs';
import { stringContains } from './toolbox/src/toolbox.utils.mjs';
import { getWindowWidth, getWindowHeight } from './toolbox/src/toolbox.viewport.mjs';
import { scrollbarCompensations } from './body-scroll.register-selectors.mjs';

export const lock = () => {
    if (!getStatus()) {
        setScrollTo();
        const scrollTo = getScrollTo();

        const w = body.clientWidth - (body.clientWidth - body.offsetWidth);
        const h = body.clientHeight - (body.clientHeight - body.offsetHeight);

        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'body-scroll-lock';

        let css = `
        html,
        body {
            overflow: hidden!important;
        }
        body {
            position: fixed!important;
            top: 0!important;
            left: 0!important;
            right: auto!important;
            bottom: auto!important;
            margin: -${scrollTo.top}px 0 0 -${scrollTo.left}px!important;
            min-width: ${w}px!important;
            width: ${w}px!important;
            max-width: ${w}px!important;
            min-height: ${h}px!important;
            height: ${h}px!important;
            max-height: ${h}px!important;
        }`;

        if (scrollbarCompensations.length) {
            const vw = getWindowWidth();
            const vh = getWindowHeight();

            const scroll = { y: vw > w ? vw - w : 0, x: vh > h ? vh - h : 0 };

            scrollbarCompensations.forEach(x => (css += `${x.selector} { ${x.property}: ${scroll[stringContains(x.property, 'right') ? 'y' : 'x']}px!important; }`));
        }

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        setStatus(true);
    }
};
