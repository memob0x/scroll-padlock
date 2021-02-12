import 'jsdom-global/register.js';

import chai from 'chai';

import {
    METHOD_ADD,
    METHOD_REMOVE
} from '../../src/constants.mjs';

import listener from '../../src/listener.mjs';

const { expect } = chai;

describe('listener', () => {
    const customEventName = 'foobar';
    
    const div = document.createElement('div');
    
    it('should be able to dispatch and remove events through shortcut functions', () => {
        let customEventDispatchCount = 0;

        const customEventHandler = () => (customEventDispatchCount++);

        listener(METHOD_ADD, div, customEventName, customEventHandler);

        // This event is listened, from 0 to 1
        div.dispatchEvent(new CustomEvent(customEventName));

        expect(customEventDispatchCount).to.equals(1);

        listener(METHOD_REMOVE, div, customEventName, customEventHandler);

        // This event is not listened, still 1
        div.dispatchEvent(new CustomEvent(customEventName));

        expect(customEventDispatchCount).to.equals(1);
    });
});
