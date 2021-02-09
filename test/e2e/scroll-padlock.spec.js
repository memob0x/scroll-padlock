const { ScrollPadlock: Padlock, chai } = window;

const { expect } = chai;

const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const DEBOUNCE_TIMEOUT = 500;

const scrollbarSize = 20;

let styler;

before(() => {
    styler = document.createElement('style');

    // TODO: Use CSSSTyleSheet methods instead
    styler.innerHTML = '::-webkit-scrollbar { width: ' + scrollbarSize + 'px; height: ' + scrollbarSize + 'px; }';

    document.head.append(styler);
});

after(() => styler.remove());

describe('ScrollPadlock instance on page scroll', () => {
    xit('should be able to get current scroll position', () => {
        const instance = new Padlock();

        instance.destroy();
    });

    xit('should be able to set current scroll position', () => {
        const instance = new Padlock();

        instance.destroy();
    });

    xit('should be able to get current layout dimensions', () => {
        const instance = new Padlock();

        instance.destroy();
    });
});

describe('ScrollPadlock instance on a scrollable element', () => {
    let element;

    const elementSize = 100;
    const scrollerSize = 500;

    const getElementCurrentScrollPosition = () => ({
        top: element.scrollTop,
        left: element.scrollLeft
    });

    beforeEach(() => {
        element = document.createElement('div');

        const { style: elementStyle } = element;

        const expander = element.cloneNode();

        elementStyle.position = 'fixed';
        elementStyle.width = elementStyle.height = elementSize + 'px';
        elementStyle.overflow = 'auto';

        const { style: expanderStyle } = expander;

        expanderStyle.width = expanderStyle.height = scrollerSize + 'px';

        element.append(expander);

        document.body.append(element);
    });

    afterEach(() => element.remove());

    it('should be able to get current scroll position', async () => {
        const instance = new Padlock(element);

        // Lcroll getter on initialization
        let currentScrollPosition = getElementCurrentScrollPosition();
        expect(instance.scroll.top).to.be.above(currentScrollPosition.top - 1).to.be.below(currentScrollPosition.top + 1);
        expect(instance.scroll.left).to.be.above(currentScrollPosition.left - 1).to.be.below(currentScrollPosition.left + 1);

        const newPosition = {
            top: 10,
            left: 20
        };

        element.scrollTo(newPosition);

        await sleep(DEBOUNCE_TIMEOUT);

        // Lcroll getter after scrollTo call
        expect(instance.scroll.top).to.be.above(newPosition.top - 1).to.be.below(newPosition.top + 1);
        expect(instance.scroll.left).to.be.above(newPosition.left - 1).to.be.below(newPosition.left + 1);

        currentScrollPosition = getElementCurrentScrollPosition();
        expect(instance.scroll.top).to.be.above(currentScrollPosition.top - 1).to.be.below(currentScrollPosition.top + 1);
        expect(instance.scroll.left).to.be.above(currentScrollPosition.left - 1).to.be.below(currentScrollPosition.left + 1);

        instance.destroy();
    });

    it('should be able to set current scroll position', async () => {
        element.scrollTo(999, 999);

        const lockStateCSSClassName = 'lockeeeed';
        const instance = new Padlock(element, lockStateCSSClassName);

        element.classList.add(lockStateCSSClassName);

        await sleep(1);

        // Locked scenario scroll setter test
        let newPosition = {
            top: Math.round(scrollerSize / 2),
            left: Math.round(scrollerSize / 2)
        };

        instance.scroll = newPosition;

        // Locked scenario scroll getter Test
        expect(instance.scroll.top).to.be.above(newPosition.top - 1).to.be.below(newPosition.top + 1);
        expect(instance.scroll.left).to.be.above(newPosition.left - 1).to.be.below(newPosition.left + 1);

        let currentScrollPosition = getElementCurrentScrollPosition();
        expect(instance.scroll.top).to.be.below(currentScrollPosition.top - 1);
        expect(instance.scroll.left).to.be.below(currentScrollPosition.left - 1);

        element.classList.remove(lockStateCSSClassName);

        await sleep(DEBOUNCE_TIMEOUT);

        expect(instance.scroll.top).to.be.above(newPosition.top - 1).to.be.below(newPosition.top + 1);
        expect(instance.scroll.left).to.be.above(newPosition.left - 1).to.be.below(newPosition.left + 1);

        currentScrollPosition = getElementCurrentScrollPosition();
        expect(instance.scroll.top).to.be.above(currentScrollPosition.top - 1).to.be.below(currentScrollPosition.top + 1);
        expect(instance.scroll.left).to.be.above(currentScrollPosition.left - 1).to.be.below(currentScrollPosition.left + 1);

        // Unlocked scenario scroll setter test
        newPosition = {
            top: Math.round(scrollerSize / 3),
            left: Math.round(scrollerSize / 3)
        };

        instance.scroll = newPosition;

        await sleep(DEBOUNCE_TIMEOUT);

        expect(instance.scroll.top).to.be.above(newPosition.top - 1).to.be.below(newPosition.top + 1);
        expect(instance.scroll.left).to.be.above(newPosition.left - 1).to.be.below(newPosition.left + 1);

        currentScrollPosition = getElementCurrentScrollPosition();
        expect(instance.scroll.top).to.be.above(currentScrollPosition.top - 1).to.be.below(currentScrollPosition.top + 1);
        expect(instance.scroll.left).to.be.above(currentScrollPosition.left - 1).to.be.below(currentScrollPosition.left + 1);

        instance.destroy();
    });

    it('should be able to get current layout dimensions', async () => {
        element.style.overflow = 'hidden';

        const instance = new Padlock(element);

        expect(instance.layout).to.deep.equals({
            innerHeight: elementSize,
            innerWidth: elementSize,
            outerHeight: elementSize,
            outerWidth: elementSize,
            scrollHeight: scrollerSize,
            scrollWidth: scrollerSize,
            scrollbarHeight: 0,
            scrollbarWidth: 0
        });

        element.style.overflow = 'scroll';

        expect(instance.layout).to.deep.equals({
            innerHeight: elementSize,
            innerWidth: elementSize,
            outerHeight: elementSize,
            outerWidth: elementSize,
            scrollHeight: scrollerSize,
            scrollWidth: scrollerSize,
            scrollbarHeight: 0,
            scrollbarWidth: 0
        });

        instance.update();

        expect(instance.layout).to.deep.equals({
            innerHeight: elementSize - scrollbarSize,
            innerWidth: elementSize - scrollbarSize,
            outerHeight: elementSize,
            outerWidth: elementSize,
            scrollHeight: scrollerSize,
            scrollWidth: scrollerSize,
            scrollbarHeight: scrollbarSize,
            scrollbarWidth: scrollbarSize
        });

        instance.destroy();
    });
});
