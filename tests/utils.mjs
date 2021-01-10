import { throttle, debounce } from '../src/utils.mjs';

describe('utils', () => {
    const throttleDelayMs = 500;

    it('should be able to make a throttled function off a given function', done => {
        let calls = 0;

        const fn = throttle(() => (calls++), throttleDelayMs);

        // detected
        fn();

        expect(calls).to.equals(1);

        // not detected
        fn();

        expect(calls).to.equals(1);

        setTimeout(() => {
            // detected
            fn();

            expect(calls).to.equals(2);

            // not detected
            fn();

            expect(calls).to.equals(2);

            done();
        }, throttleDelayMs);
    });
    
    const debounceIntervalMs = 500;

    it('should be able to make a debounced function off a given function', done => {
        let calls = 0;

        const fn = debounce(() => (calls++), debounceIntervalMs);

        // will be detected
        fn();

        // not detected
        fn();

        expect(calls).to.equals(0);

        setTimeout(() => {
            expect(calls).to.equals(1);

            // will be detected
            fn();

            // not detected
            fn();

            setTimeout(() => {
                expect(calls).to.equals(2);

                done();
            }, throttleDelayMs);
        }, throttleDelayMs);
    });
});
