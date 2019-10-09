const html = document.documentElement;

document
    .querySelector('.toggle-scroll-lock')
    .addEventListener('click', () => bodyScroll.toggle());

document
    .querySelector('button.toggle-custom-scrollbar')
    .addEventListener('click', () => {
        log('toggling custom scrollbars');
        html.classList.toggle('custom-scrollbar');
    });

document
    .querySelector('button.toggle-horizontal-orientation')
    .addEventListener('click', () => {
        log('toggling page orientation');
        html.classList.toggle('horizontal');
    });

window.addEventListener('bodyScrollLock', () => log('body scroll locked'));
window.addEventListener('bodyScrollUnlock', () => log('body scroll unlocked'));
