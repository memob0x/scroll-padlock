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

        setStyle(`
            html,
            body
            ${settings.incubator ? ', #' + incubator.id : ''} {
                margin: 0!important;
                padding: 0!important;
                min-width: auto!important;
                min-height: auto!important;
                max-width: none!important;
                max-height: none!important;
            }

            html
            ${settings.incubator ? ', body' : ''} {
                width: ${state.html.width}px!important;
                height: ${state.html.height}px!important;
            }

            html {
                position: fixed!important;
                top: ${state.scroll.top * -1}px!important;
                left: ${state.scroll.left * -1}px!important;
            }

            html,
            body {              
                overflow: visible!important;
            }

            ${settings.incubator ? '#' + incubator.id : 'body'} {
                width: ${state.body.width}px!important;
                height: ${state.body.height}px!important;
            }
            
            ${getCorrections()}`);

        setStatus(true);
    }
};
