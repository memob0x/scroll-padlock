import { BodyScrollEvent } from './body-scroll.client.mjs';
import { status, setStatus } from './body-scroll.status.mjs';
import { state } from './body-scroll.state.mjs';
import { updateStyle } from './body-scroll.style.mjs';

export const unlock = () => {
    if (status) {
        updateStyle();

        window.scrollTo(state.scroll);

        setStatus(false);

        window.dispatchEvent(new BodyScrollEvent('bodyScrollUnlock'));
    }
};
