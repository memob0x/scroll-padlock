export default () => {
    window.LOCKED_CLASS_NAME = 'locked';

    const doc = document;

    const createEl = (tag = 'div') => doc.createElement(tag);

    const { body, head } = doc;

    const expander = createEl();

    const { style: expanderStyle } = expander;

    expanderStyle.width = expanderStyle.height = '9999px';

    body.append(expander);

    window.div = createEl();

    div.classList.add('div')

    const { style: divStyle } = window.div;

    divStyle.width = divStyle.height = '100px';
    divStyle.overflow = 'scroll';
    divStyle.position = 'absolute';

    window.div.append(expander.cloneNode());

    body.append(window.div);

    const styler = createEl('style');

    head.append(styler);

    styler.sheet.insertRule(`
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
    `, 0);

    styler.sheet.insertRule(`
        body.${LOCKED_CLASS_NAME} {
            position: fixed;
            top: calc(var(--scroll-padlock-scroll-top) * -1);
            left: calc(var(--scroll-padlock-scroll-left) * -1);
            padding-bottom: var(--scroll-padlock-scrollbar-height);
            padding-right: var(--scroll-padlock-scrollbar-width);
            width: var(--scroll-padlock-inner-width);
            height: var(--scroll-padlock-scroll-height);
        }
    `, 1);

    styler.sheet.insertRule(`
        .div.${LOCKED_CLASS_NAME} {
            overflow: hidden;
            max-height: calc(100% - var(--scroll-padlock-scrollbar-height));
            max-width: calc(100% - var(--scroll-padlock-scrollbar-width));
        }
    `, 2);

    styler.sheet.insertRule(`
        body:before,
        .div:before {
            content: 'hellooo';
            font-weight: bold;
            font-size: 80px;
        }
    `, 3);

    styler.sheet.insertRule(`
        .div {
            position: absolute;
            left: 50%;
            top: 0;
        }
    `, 3);
};
