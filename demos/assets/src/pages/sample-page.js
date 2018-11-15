import bodyScroll from '../../../../src/body-scroll.mjs';
import { log } from '../main.js';

bodyScroll.registerSelectors([
    {
        selector: '#console',
        property: 'margin-right'
    },
    {
        selector: '#nav',
        property: 'margin-right'
    }
]);

document.querySelector('.toggle-body-scroll-lock').addEventListener('click', () => {
    if (bodyScroll.isLocked()) {
        log('unlocking');
        bodyScroll.unlock();
    } else {
        log('locking');
        bodyScroll.lock();
    }
});

document.querySelector('button.toggle-body-custom-scrollbar').addEventListener('click', () => {
    log('toggling custom scrollbars');
    document.documentElement.classList.toggle('custom-scrollbar');
});
