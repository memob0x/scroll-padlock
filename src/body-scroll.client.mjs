export const html = document.documentElement;
export const body = document.body || document.getElementsByTagName('body')[0];
export const head = document.head || document.getElementsByTagName('head')[0];

const stylerID = 'body-scroll';
const styler = document.createElement('style');
styler.type = 'text/css';
styler.id = stylerID;

export const setStyle = (css = '') => {
    if (!css) {
        styler.remove();

        return;
    }

    if (styler.styleSheet) {
        styler.styleSheet.cssText = css;
    } else {
        styler.innerHTML = '';
        styler.appendChild(document.createTextNode(css));
    }

    if (!head.querySelector('style#' + stylerID)) {
        head.appendChild(styler);
    }
};

export const incubator = (_incubator => {
    const s4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    _incubator.id = `body-scroll-lock-${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;

    return _incubator;
})(document.createElement('div'));
