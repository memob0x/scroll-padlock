import { BodyScrollEvent } from './body-scroll.client.mjs';
import { status, setStatus } from './body-scroll.status.mjs';
import { setState } from './body-scroll.state.mjs';
import { updateStyle } from './body-scroll.style.mjs';

export const lock = () => {
    if (!status) {
        setStatus(true);

        setState();

        updateStyle();

        window.dispatchEvent(new BodyScrollEvent('bodyScrollLock'));
    }
};
