import { eventNamePrefix } from '../src/client.mjs';

import { lock, isLocked } from '../src/state.mjs';

import {
    debounceTime,
    addResizeEventListener,
    removeResizeEventListener
} from '../src/resize.mjs';

const eventName = 'resize';

const triggerWindowResize = () => window.dispatchEvent(new Event(eventName));

describe('resize', () => {
    it('should dispatch a custom (debounced) resize event only at locked state and only when handler is attached', done => {
        const div = document.createElement('div');

        let calls = 0;

        const handler = () => calls++;
        
        div.addEventListener(`${eventNamePrefix}-${eventName}`, handler);

        addResizeEventListener(div);

        // this is not detected since event is dispatched only when locked, 0
        triggerWindowResize();
        
        setTimeout(() => {
            expect(calls).to.equal(0);
            
            lock(div);

            // this is detected once, because of debounce, 1
            for( let i = 0, j = 20; i < j; i++){
                triggerWindowResize();
            }
            
            setTimeout(() => {
                expect(calls).to.equal(1);

                // should have stayed locked
                expect(isLocked(div)).to.be.true;

                removeResizeEventListener(div);

                // this should not be detected since event listener has been detached, 1
                triggerWindowResize();
            
                setTimeout(() => {
                    expect(calls).to.equal(1);
            
                    // test cleanup
                    div.removeEventListener(`${eventNamePrefix}-${eventName}`, handler);

                    done();
                }, debounceTime);
            }, debounceTime);
        }, debounceTime);
    });
});
