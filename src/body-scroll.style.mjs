import { settings } from './body-scroll.settings.mjs';
import { state } from './body-scroll.state.mjs';
import { status } from './body-scroll.status.mjs';
import { head } from './body-scroll.client.mjs';

const stylerID = 'body-scroll';
const styler = document.createElement('style');
styler.type = 'text/css';
styler.id = stylerID;

const setStyle = (css = '') => {
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

    if (!head.querySelector(`style#${stylerID}`)) {
        head.appendChild(styler);
    }
};

const getStyle = () => {
    const imp = settings.important ? '!important' : '';

    let css = '';

    if (!status) {
        css += `html,
            body {
            margin: 0${imp};
            padding: 0${imp};
            min-width: auto${imp};
            min-height: auto${imp};
            max-width: none${imp};
            max-height: none${imp};
        }

        html {
            width: ${state.html.width}px${imp};
            height: ${state.html.height}px${imp};
        }

        html {
            position: fixed${imp};
            top: ${state.scroll.top * -1}px${imp};
            left: ${state.scroll.left * -1}px${imp};
        }

        html,
            body {
            overflow: visible${imp};
        }

        body{
            width: ${state.body.width}px${imp};
            height: ${state.body.height}px${imp};
        }`;
    }

    const corrections = settings.corrections;

    if (corrections.length) {
        corrections.forEach(entry => {
            const gap =
                state.scrollbars[
                    entry.property.indexOf('right') > -1 ? 'y' : 'x'
                ];

            if (gap > 0) {
                let factor = 1;

                if (status) {
                    factor = entry.inverted ? -1 : 0;
                }

                css += `
                ${entry.selector} {
                    ${entry.property}: ${gap * factor}px${
                    settings.important ? '!important' : ''
                };
                }`;
            }
        });
    }

    return css;
};

export const updateStyle = () => setStyle(getStyle());
