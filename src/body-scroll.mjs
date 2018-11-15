import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { status } from './body-scroll.state.mjs';
import { registerScrollbarGapSelectors } from './body-scroll.register-selectors.mjs';

import './body-scroll.resize';

export default {
    lock: lock,
    unlock: unlock,
    registerScrollbarGapSelectors: registerScrollbarGapSelectors,
    isLocked: () => status
};
