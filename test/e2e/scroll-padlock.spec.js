const { ScrollPadlock: Padlock } = window;

describe('Padlock instance on page scroll', () => {
    it('should do stuff', async () => {
        const instance = new Padlock();

        instance.destroy();
    });
});

describe('Padlock instance on a scrollable element', () => {
    let element;

    beforeEach(() => {
        element = document.createElement('div');

        document.body.append(element);
    });

    afterEach(() => {
        element.remove();
    });
    
    it('should do stuff', async () => {
        const instance = new Padlock(element);

        instance.destroy();
    });
});
