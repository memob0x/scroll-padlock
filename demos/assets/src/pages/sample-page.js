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

document
    .querySelector('button.toggle-body-min-width')
    .addEventListener('click', () => {
        log('toggling horizontal scrollbar');
        document.documentElement.classList.toggle('min-width');
    });

let incubator = false;
bodyScroll.setOptions({
    incubator: incubator
});
document
    .querySelector('button.toggle-incubator')
    .addEventListener('click', () => {
        log('toggling incubator mode');
        if (!bodyScroll.isLocked()) {
            incubator = !incubator;
            bodyScroll.setOptions({
                incubator: incubator
            });
        }
    });
