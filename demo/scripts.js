const $log = document.querySelector('#console');
const log = (...message) => {
    console.log(...message);

    if (!$log.hasChildNodes()) {
        const ol = document.createElement('ol');
        $log.append(ol);
    }

    const $ol = $log.querySelector('ol');
    const $li = document.createElement('li');
    $li.innerHTML = message;
    $ol.append($li);

    $log.scrollTop = $ol.offsetHeight;
};

const $html = document.documentElement;

document
    .querySelector('.toggle-scroll-lock')
    .addEventListener('click', () => bodyScroll.toggle());

document
    .querySelector('button.toggle-custom-scrollbar')
    .addEventListener('click', () => {
        log('toggling custom scrollbars');
        $html.classList.toggle('custom-scrollbar');
    });

document
    .querySelector('button.toggle-horizontal-orientation')
    .addEventListener('click', () => {
        log('toggling page orientation');
        $html.classList.toggle('horizontal');
    });

window.addEventListener('bodyScrollLock', () => log('body scroll locked'));
window.addEventListener('bodyScrollUnlock', () => log('body scroll unlocked'));
