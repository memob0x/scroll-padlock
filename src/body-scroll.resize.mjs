import { status } from './body-scroll.status.mjs';
import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';

let timer = null;

window.addEventListener('resize', () => {
    clearTimeout(timer);
    
    timer = setTimeout(() => {
        if (status) {
            unlock();

            lock();
        }
    }, 500);
});
