import { getStatus } from './body-scroll.state.mjs';
import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { addEventListener } from './toolbox/src/toolbox.events.mjs';
import { debounce } from './toolbox/src/toolbox.debounce.mjs';

addEventListener(
    window,
    'resize.body-scroll-lock',
    debounce(() => {
        if (getStatus()) {
            unlock();
            lock();
        }
    }, 500)
);
