import bodyScroll from '../../../../src/body-scroll.mjs';
import { log } from '../main.js';

bodyScroll.setOptions({
    corrections: [
        {
            selector: '#nav',
            property: 'right'
        },
        '#console'
    ]
});

document
    .querySelector('.toggle-body-scroll-lock')
    .addEventListener('click', () => bodyScroll.toggle());

document
    .querySelector('button.toggle-body-custom-scrollbar')
    .addEventListener('click', () => {
        log('toggling custom scrollbars');
        document.documentElement.classList.toggle('custom-scrollbar');
    });

window.addEventListener('bodyScrollLock', () => log('body scroll locked'));
window.addEventListener('bodyScrollUnlock', () => log('body scroll unlocked'));

window.bodyScroll = bodyScroll;
