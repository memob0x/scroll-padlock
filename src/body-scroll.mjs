import * as lock from './body-scroll.lock.mjs';
import * as unlock from './body-scroll.unlock.mjs';
import * as isLocked from './body-scroll.is-locked.mjs';
import * as registerSelectors from './body-scroll.register-selectors.mjs';

import './body-scroll.resize';

export default {
    ...lock,
    ...unlock,
    ...isLocked,
    ...registerSelectors
};
