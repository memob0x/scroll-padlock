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

export { Mocha, mocha, expect };
