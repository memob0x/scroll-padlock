import { getScrollTo, getStatus, setStatus } from './body-scroll.state.mjs';
import { head } from './toolbox/src/toolbox.client.mjs';

export const unlock = () => {
    if (getStatus()) {
        head.querySelector('#body-scroll-lock').remove();
        window.scrollTo(getScrollTo());
        setStatus(false);
    }
};
