import { createDiv, dispatchCustomEvent } from './_test-utils.mjs';

import { addListener, removeListener } from '../src/client.mjs';

describe('client', () => {
    const customEventName = 'foobar';
    
    const div = createDiv();
    
    it('should be able to dispatch and remove events thorugh shortcut functions', () => {
        let customEventDispatchCount = 0;

        const customEventHandler = () => (customEventDispatchCount++);

        addListener(div, customEventName, customEventHandler);

        // listened, from 0 to 1
        dispatchCustomEvent(div, customEventName);

        expect(customEventDispatchCount).to.equals(1);

        removeListener(div, customEventName, customEventHandler);

        // not listened, still 1
        dispatchCustomEvent(div, customEventName);

        expect(customEventDispatchCount).to.equals(1);
    });
});
