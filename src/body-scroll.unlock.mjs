import { settings } from './body-scroll.settings.mjs';
import { setStyle, incubator, BodyScrollEvent } from './body-scroll.client.mjs';
import { status, setStatus } from './body-scroll.status.mjs';
import { state } from './body-scroll.state.mjs';
import { getCorrections } from './body-scroll.corrections.mjs';

export const unlock = () => {
    if (status) {
        setStyle(getCorrections(true));

        if (settings.incubator) {
            while (incubator.firstChild) {
                incubator.before(incubator.firstChild);
            }
            incubator.remove();
        }

        window.scrollTo(state.scroll);

        setStatus(false);

        window.dispatchEvent(new BodyScrollEvent('bodyScrollUnlock'));
    }
};
