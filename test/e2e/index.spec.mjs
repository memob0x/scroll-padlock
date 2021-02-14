import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';

import sleep from '../utils/sleep.mjs';
import { TIME_MS_DEBOUNCE_SCROLL } from '../../src/constants.mjs';

let server;
let browser;
let page;

const PROTOCOL = 'http';
const DOMAIN = 'localhost';
const PORT = 8080;

before(async () => {
    const app = express();

    app.use(express.static(path.resolve('.')));

    server = app.listen(PORT);

    browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-web-security'],
        ignoreDefaultArgs: ['--hide-scrollbars']
    });
});

beforeEach(async () => {
    page = await browser.newPage();

    page.on('console', c => console.log(c.text()));

    await page.setViewport({
        width: 1000,
        height: 1000
    });

    await page.addScriptTag({
        url: `${PROTOCOL}://${DOMAIN}:${PORT}/dist/iife/scroll-padlock.js`
    });

    await page.addScriptTag({
        url: `${PROTOCOL}://${DOMAIN}:${PORT}/node_modules/chai/chai.js`
    });

    await page.exposeFunction('sleep', sleep);

    await page.exposeFunction('constants', () => ({ TIME_MS_DEBOUNCE_SCROLL }));

    await page.evaluate(() => {
        window.expect = window.chai.expect;

        const doc = document;

        const createEl = (tag = 'div') => doc.createElement(tag);
        
        const { body, head } = doc;

        const expander = createEl();

        const { style: expanderStyle } = expander;
        
        expanderStyle.width = expanderStyle.height = '9999px';

        body.append(expander);
        
        window.div = createEl();

        const { style: divStyle } = window.div;

        divStyle.width = divStyle.height = '100px';
        divStyle.overflow = 'scroll';
        divStyle.position = 'absolute';

        window.div.append(expander.cloneNode());

        body.append(window.div);

        const styler = createEl('style');

        styler.innerHTML = '::-webkit-scrollbar { width: 10px; height: 10px; }';

        head.append(styler);
    });
});

afterEach(async () => await page.close());

after(async () => {
    await browser.close();

    server.close();
});

describe('ScrollPadlock instance on page scroll', () => {
    it('should be able to get current scroll position', async () => await page.evaluate(async () => {
        const { TIME_MS_DEBOUNCE_SCROLL } = await window.constants();

        let position = { top: 0, left: 0 };

        scrollTo(position);

        const instance = new window.ScrollPadlock();

        expect(instance.scroll).to.deep.equals(position);

        position = { top: 100, left: 200 };

        scrollTo(position);

        await sleep(TIME_MS_DEBOUNCE_SCROLL + 10);

        expect(instance.scroll).to.deep.equals(position);

        instance.destroy();
    }));

    xit('should be able to set current scroll position', () => {
        
    });

    it('should be able to get current layout dimensions', async () => await page.evaluate(async () => {
        document.body.style.overflow = 'hidden';

        const instance = new window.ScrollPadlock();

        expect(instance.layout).to.deep.include({
            outerWidth: window.innerWidth,
            outerHeight: window.innerHeight,
            innerWidth: Math.min(window.innerWidth, document.documentElement.clientWidth),
            innerHeight: Math.min(window.innerHeight, document.documentElement.clientHeight),
            scrollbarWidth: 0,
            scrollbarHeight: 0
        });

        document.body.style.overflow = 'scroll';

        expect(instance.layout).to.not.deep.include({
            outerWidth: window.innerWidth,
            outerHeight: window.innerHeight,
            innerWidth: Math.min(window.innerWidth, document.documentElement.clientWidth),
            innerHeight: Math.min(window.innerHeight, document.documentElement.clientHeight),
            scrollbarWidth: 0,
            scrollbarHeight: 0
        });

        instance.update();

        expect(instance.layout).to.deep.include({
            outerWidth: window.innerWidth,
            outerHeight: window.innerHeight,
            innerWidth: Math.min(window.innerWidth, document.documentElement.clientWidth),
            innerHeight: Math.min(window.innerHeight, document.documentElement.clientHeight),
            scrollbarWidth: window.innerWidth - Math.min(window.innerWidth, document.documentElement.clientWidth),
            scrollbarHeight: window.innerHeight - Math.min(window.innerHeight, document.documentElement.clientHeight)
        });

        document.body.style.overflow = '';

        instance.destroy();
    }));
});

describe('ScrollPadlock instance on a scrollable element', () => {
    it('should be able to get current scroll position', async () => await page.evaluate(async () => {
        const { TIME_MS_DEBOUNCE_SCROLL } = await window.constants();

        let position = { top: 0, left: 0 };

        window.div.scrollTo(position);

        const instance = new window.ScrollPadlock(window.div);

        expect(instance.scroll).to.deep.equals(position);

        position = { top: 100, left: 200 };

        window.div.scrollTo(position);

        await window.sleep(TIME_MS_DEBOUNCE_SCROLL + 10);

        expect(instance.scroll).to.deep.equals(position);

        instance.destroy();
    }));

    xit('should be able to set current scroll position', async () => { 

    });

    it('should be able to get current layout dimensions', async () => await page.evaluate(async () => {
        window.div.style.overflow = 'hidden';

        const instance = new window.ScrollPadlock(window.div);

        expect(instance.layout).to.deep.include({
            outerWidth: window.div.getBoundingClientRect().width,
            outerHeight: window.div.getBoundingClientRect().height,
            innerWidth: window.div.clientWidth,
            innerHeight: window.div.clientHeight,
            scrollbarWidth: 0,
            scrollbarHeight: 0
        });

        window.div.style.overflow = 'scroll';

        expect(instance.layout).to.not.deep.include({
            outerWidth: window.div.getBoundingClientRect().width,
            outerHeight: window.div.getBoundingClientRect().height,
            innerWidth: window.div.clientWidth,
            innerHeight: window.div.clientHeight,
            scrollbarWidth: 0,
            scrollbarHeight: 0
        });

        instance.update();

        expect(instance.layout).to.deep.include({
            outerWidth: window.div.getBoundingClientRect().width,
            outerHeight: window.div.getBoundingClientRect().height,
            innerWidth: window.div.clientWidth,
            innerHeight: window.div.clientHeight,
            scrollbarWidth: window.div.getBoundingClientRect().width - window.div.clientWidth,
            scrollbarHeight: window.div.getBoundingClientRect().height - window.div.clientHeight
        });

        instance.destroy();
    }));
});
