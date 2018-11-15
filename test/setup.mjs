// import of all required dependencies
import Mocha from '../node_modules/mocha/lib/mocha.js';
import chai from '../node_modules/chai/chai.js';
import jsdom from '../node_modules/jsdom/lib/api.js';

// test initialization and assertions definition
const expect = chai.expect;
const mocha = new Mocha({
    reporter: 'spec'
});

// virtual DOM creation
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html>`);
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = global.window.HTMLElement;
global.NodeList = global.window.NodeList;
global.navigator = global.window.navigator;

const dummies = (() => {
    const urls = {
        images: ['http://placehold.it/1x1.jpg', 'http://placehold.it/1x2.jpg']
    };

    const appendImgs = () => {
        const container = document.createElement('div');
        urls.images.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            container.append(img);
        });
        container.classList.add('images');
        document.body.append(container);
    };

    const appendBackgroundElement = () => {
        const background = document.createElement('div');
        background.style.backgroundImage = 'url(' + urls.images[0] + ')';
        background.classList.add('background');
        document.body.append(background);
    };

    return {
        urls: urls,
        append: {
            imgs: appendImgs,
            background: appendBackgroundElement,
            pictures: () => {}, // TODO: ...
            audios: () => {}, // TODO: ...
            videos: () => {} // TODO: ...
        }
    };
})();

export { Mocha, mocha, expect, dummies };
