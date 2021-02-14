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
        const doc = document;

        const createDiv = () => doc.createElement('div');
        
        const { body } = doc;

        const expander = createDiv();

        const { style: expanderStyle } = expander;

        expanderStyle.width = expanderStyle.height = '9999px';

        body.append(expander);
        
        window.div = createDiv();

        const { style: divStyle } = window.div;

        divStyle.width = divStyle.height = '100px';
        divStyle.overflow = 'scroll';

        window.div.append(expander.cloneNode());

        body.append(window.div);
    });

    await page.evaluate(() => window.expect = window.chai.expect);
});

afterEach(async () => await page.close());

after(async () => {
    await browser.close();

    server.close();
});

describe('ScrollPadlock instance on page scroll', () => {
    it('should be able to get current scroll position', async () => await page.evaluate(async () => {
        const constants = await window.constants();

        let position = { top: 0, left: 0 };

        window.scrollTo(position);

        const instance = new window.ScrollPadlock();

        expect(instance.scroll).to.deep.equals(position);

        position = { top: 100, left: 200 };

        window.scrollTo(position);

        await window.sleep(constants.TIME_MS_DEBOUNCE_SCROLL + 10);

        expect(instance.scroll).to.deep.equals(position);

        instance.destroy();
    }));

    xit('should be able to set current scroll position', () => {
        /*const instance = new Padlock();

        instance.destroy();*/
    });

    xit('should be able to get current layout dimensions', () => {
        /*const instance = new Padlock();

        instance.destroy();*/
    });
});

describe('ScrollPadlock instance on a scrollable element', () => {
    it('should be able to get current scroll position', async () => await page.evaluate(async () => {
        const constants = await window.constants();

        let position = { top: 0, left: 0 };

        window.div.scrollTo(position);

        const instance = new window.ScrollPadlock(window.div);

        expect(instance.scroll).to.deep.equals(position);

        position = { top: 100, left: 200 };

        window.div.scrollTo(position);

        await window.sleep(constants.TIME_MS_DEBOUNCE_SCROLL + 10);

        expect(instance.scroll).to.deep.equals(position);

        instance.destroy();
    }));

    xit('should be able to set current scroll position', async () => { /*
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

        instance.destroy();*/
    });

    xit('should be able to get current layout dimensions', async () => { /*
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

        instance.destroy(); */
    });
});
