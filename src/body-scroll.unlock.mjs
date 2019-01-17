import { html, BodyScrollEvent } from './body-scroll.client.mjs';
import { status, setStatus } from './body-scroll.status.mjs';
import { state } from './body-scroll.state.mjs';
import { updateStyle } from './body-scroll.style.mjs';

export const unlock = () => {
    if (status) {
        setStatus(false);

        updateStyle();

        html.scrollTop = state.scroll.top;
        html.scrollLeft = state.scroll.left;

        window.dispatchEvent(new BodyScrollEvent('bodyScrollUnlock'));
    }
};
