import 'jsdom-global/register.js';

import chai from 'chai';

import { addListener, removeListener } from '../../src/client.mjs';

const { expect } = chai;

describe('client', () => {
    const customEventName = 'foobar';
    
    const div = document.createElement('div');
    
    it('should be able to dispatch and remove events through shortcut functions', () => {
        let customEventDispatchCount = 0;

        const customEventHandler = () => (customEventDispatchCount++);

        addListener(div, customEventName, customEventHandler);

        // This event is listened, from 0 to 1
        div.dispatchEvent(new CustomEvent(customEventName));

        expect(customEventDispatchCount).to.equals(1);

        removeListener(div, customEventName, customEventHandler);

        // This event is not listened, still 1
        div.dispatchEvent(new CustomEvent(customEventName));

        expect(customEventDispatchCount).to.equals(1);
    });
});
