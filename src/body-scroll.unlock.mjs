import { styler } from './body-scroll.client.mjs';
import { scrollState, status, setStatus } from './body-scroll.state.mjs';

export const unlock = () => {
    if (status) {
        styler.remove();
        window.scrollTo(scrollState);
        setStatus(false);
    }
};
