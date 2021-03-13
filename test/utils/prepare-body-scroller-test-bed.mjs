export default () => {
    window.LOCKED_CLASS_NAME = 'locked';

    const { head, body } = document;

    for( let i = 0; i < 10000; i++ ){
        body.append('hello, hello! Lorem ipsum. How r u today?');
    }

    const styler = document.createElement('style');

    head.append(styler);

    const { sheet } = styler;

    sheet.insertRule(`
        ::-webkit-scrollbar {
            width: 100px;
            display: block;
        }
    `, 0);

    sheet.insertRule(`
        body {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
        }
    `, 1);

    sheet.insertRule(`
        body.${window.LOCKED_CLASS_NAME} {
            position: fixed;
            width: 100%;
            top: calc(var(--scroll-padlock-scroll-top) * -1);
            padding-right: var(--scroll-padlock-scrollbar-width);
        }
    `, 2);

    body.scrollTo(0, 999999);
};
