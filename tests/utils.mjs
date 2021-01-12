import { debounce, getElementParentsLength, getElementIndex, joinHyphen } from '../src/utils.mjs';

describe('utils', () => {
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
            }, debounceIntervalMs);
        }, debounceIntervalMs);
    });
    
    const doc = document;
    const html = doc.documentElement;
    const body = doc.body;
    
    const createDummy = () => doc.createElement('div');

    it('should be able to count a given element parents', () => {
        const div1 = createDummy();
        const div2 = createDummy();

        expect(getElementParentsLength(html)).to.equals(0);
        expect(getElementParentsLength(body)).to.equals(1);

        div1.append(div2);

        body.append(div1);

        expect(getElementParentsLength(div1)).to.equals(2);
        expect(getElementParentsLength(div2)).to.equals(3);

        div1.remove();
        div2.remove();
    });

    it('should be able to get a given element index in DOM tree', () => {
        const div1 = createDummy();
        const div2 = createDummy();
        const div3 = createDummy();

        expect(getElementIndex(html)).to.equals(0);

        // NOTE: there's head before body
        expect(getElementIndex(body)).to.equals(1);

        // NOTE: prepending because of karma scripts at the end of body (they would affect index detection)
        body.prepend(div3);
        body.prepend(div2);
        body.prepend(div1);

        expect(getElementIndex(div1)).to.equals(0);
        expect(getElementIndex(div2)).to.equals(1);
        expect(getElementIndex(div3)).to.equals(2);

        div1.remove();
        div2.remove();
        div3.remove();
    });

    it('should be able to join string fragments with hyphens', () => expect(joinHyphen('foo', 'barr', 1234)).to.equals('foo-barr-1234'));
});
