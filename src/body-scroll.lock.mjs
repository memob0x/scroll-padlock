import { settings } from './body-scroll.settings.mjs';
import { body, setStyle, incubator } from './body-scroll.client.mjs';
import { status, setStatus } from './body-scroll.status.mjs';
import { setState, state } from './body-scroll.state.mjs';
import { getCorrections } from './body-scroll.corrections.mjs';

export const lock = () => {
    if (!status) {
        // snapshot of current state
        setState();

        //
        if (settings.incubator) {
            incubator.innerHTML = '';
            while (body.firstChild) {
                incubator.append(body.firstChild);
            }
            body.append(incubator);
        }

        const imp = settings.important ? '!important' : '';

        setStyle(`
            html,
            body
            ${settings.incubator ? ', #' + incubator.id : ''} {
                margin: 0${imp};
                padding: 0${imp};
                min-width: auto${imp};
                min-height: auto${imp};
                max-width: none${imp};
                max-height: none${imp};
            }

            html
            ${settings.incubator ? ', body' : ''} {
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
                overflow: ${
                    settings.overflowHidden ? 'hidden' : 'visible'
                }${imp};
            }

            ${settings.incubator ? '#' + incubator.id : 'body'} {
                width: ${state.body.width}px${imp};
                height: ${state.body.height}px${imp};
                ${settings.incubator ? `position: relative${imp};` : ''}
            }
            
            ${getCorrections()}`);

        setStatus(true);
    }
};
