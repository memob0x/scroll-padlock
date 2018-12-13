import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { toggle } from './body-scroll.toggle.mjs';
import { status } from './body-scroll.status.mjs';
import { setOptions } from './body-scroll.settings.mjs';

import './body-scroll.resize';

export default {
    lock: lock,
    unlock: unlock,
    toggle: toggle,
    isLocked: () => status,
    setOptions: setOptions
};
