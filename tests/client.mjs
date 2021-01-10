import { addListener, removeListener } from '../src/client.mjs';

describe('client', () => {
    const customEventName = 'foobar';
    
    const div = document.createElement('div');
    
    const dispatchCustomEvent = () => div.dispatchEvent(new CustomEvent(customEventName));

    it('should be able to dispatch and remove events thorugh shortcut functions', () => {
        let customEventDispatchCount = 0;

        const customEventHandler = () => (customEventDispatchCount++);

        addListener(div, customEventName, customEventHandler);

        // listened, from 0 to 1
        dispatchCustomEvent();

        expect(customEventDispatchCount).to.equals(1);

        removeListener(div, customEventName, customEventHandler);

        // not listened, still 1
        dispatchCustomEvent();

        expect(customEventDispatchCount).to.equals(1);
    });
});
