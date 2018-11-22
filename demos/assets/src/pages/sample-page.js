import bodyScroll from '../../../../src/body-scroll.mjs';
import { log } from '../main.js';

bodyScroll.setCorrections([
    {
        selector: '#nav',
        property: 'right'
    },
    '#console'
]);

document
    .querySelector('.toggle-body-scroll-lock')
    .addEventListener('click', () => bodyScroll.toggle());

document
    .querySelector('button.toggle-body-custom-scrollbar')
    .addEventListener('click', () => {
        log('toggling custom scrollbars');
        document.documentElement.classList.toggle('custom-scrollbar');
    });

window.bodyScroll = bodyScroll;
