import { settings } from './body-scroll.settings.mjs';
import { state } from './body-scroll.state.mjs';
import { status } from './body-scroll.status.mjs';
import { head, isSafariIOS } from './body-scroll.client.mjs';

const styler = id => {
    id = `body-scroll__${id}`;

    let element = head.querySelector(`style#${id}`);

    if (!element) {
        element = document.createElement('style');
        element.type = 'text/css';
        element.id = id;
        head.appendChild(element);
    }

    return element;
};

export const updateStyle = () => {
    const important = settings.important ? '!important' : '';

    const $base = styler('base');
    $base.disabled = !status;
    if (!$base.sheet.cssRules.length) {
        // prettier-ignore
        $base.sheet.insertRule(`
            html,
            body {
                margin: 0${important};
                min-width: auto${important};
                min-height: auto${important};
                max-width: none${important};
                max-height: none${important};
            }
        `, 0);
        // prettier-ignore
        $base.sheet.insertRule(`
            html {
                padding: 0${important};
            }
        `, 1);
    }

    const $scrollbar = styler('bar');
    $scrollbar.disabled = !status;
    if ($scrollbar.sheet.cssRules.length) {
        $scrollbar.sheet.deleteRule(1);
        $scrollbar.sheet.deleteRule(0);
    }
    // prettier-ignore
    $scrollbar.sheet.insertRule(`
        html {
            width: ${state.html.width}px${important};
            height: ${state.html.height}px${important};
        }
    `, 0);
    // prettier-ignore
    $scrollbar.sheet.insertRule(`
        body{
            width: ${state.body.width}px${important};
            height: ${state.body.height}px${important};
            padding: 0 ${state.body.paddingRight}px ${state.body.paddingBottom}px 0${important};
        }
    `, 1);

    const $lock = styler('lock');
    $lock.disabled = !status;
    if (isSafariIOS) {
        if (!$lock.sheet.cssRules.length) {
            // prettier-ignore
            $lock.sheet.insertRule(`
                html,
                body {
                    overflow: visible${important};
                }
            `, 0);
            // prettier-ignore
            $lock.sheet.insertRule(`
                html {
                    position: fixed${important};
                }
            `, 1);
        } else {
            $lock.sheet.deleteRule(2);
        }

        // prettier-ignore
        $lock.sheet.insertRule(`
            html {
                top: ${state.scroll.top * -1}px${important};
                left: ${state.scroll.left * -1}px${important};
            }
        `, 2);
    } else {
        if (!$lock.sheet.cssRules.length) {
            // prettier-ignore
            $lock.sheet.insertRule(`
                body {
                    overflow: hidden${important};
                }
            `, 0);
        }
    }

    const corrections = settings.corrections;
    const $corrections = styler('corrections');

    // prettier-ignore
    for (let i = $corrections.sheet.cssRules.length - 1; i >= 0; i--) {
        $corrections.sheet.deleteRule(i);
    }

    corrections.forEach(entry => {
        const gap =
            state.scrollbars[entry.property.indexOf('right') > -1 ? 'y' : 'x'];

        if (gap > 0) {
            let factor = 1;

            if (!status) {
                factor = entry.inverted ? -1 : 0;
            }

            // prettier-ignore
            $corrections.sheet.insertRule(`
                ${entry.selector} {
                    ${entry.property}: ${gap * factor}px${settings.important ? '!important' : ''};
                }
            `);
        }
    });
};
