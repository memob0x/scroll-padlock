import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { status } from './body-scroll.status.mjs';
import { setSettings } from './body-scroll.settings.mjs';
import { updateStyle } from './body-scroll.style.mjs';

let resizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => updateStyle(), 500);
});

export default {
    lock: lock,
    unlock: unlock,
    toggle: () => (!status ? lock() : unlock()),
    isLocked: () => status,
    setOptions: (options = {}) => {
        setSettings(options);

        updateStyle();
    }
};
