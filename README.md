# ScrollPadlock

![Node.js CI](https://github.com/memob0x/scroll-padlock/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/scroll-padlock/latest.svg)](https://www.npmjs.com/package/scroll-padlock)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/scroll-padlock.svg)](https://www.npmjs.com/package/scroll-padlock)
![license](https://img.shields.io/npm/l/scroll-padlock)

A small (~4K gzipped) unobtrusive script aimed to encourage a **CSS-first** approach when **locking html elements scroll** reducing [cumulative layout shift](https://web.dev/cls/) and iOS Safari quirkiness.

🙅 Without this library:

![without scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/docs/without-gap-compensation.gif?raw=true)

💁 With this library:

![with scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/docs/with-gap-compensation.gif?raw=true)

## Try it out

Here's some example projects for the most common setups:

- [React](https://vouoz.csb.app/)
- [Angular](https://xuudg.csb.app/)
- [Vue](https://6ewti.csb.app/)
- [Vanilla](https://rgzrb.csb.app/)

project "e2e" folder...

## Inclusion

This library is downloadable via **npm**:

```shell
npm install scroll-padlock
```

The source code is entirely written in [standard ECMAScript](https://tc39.es/) with no dependencies.
All major bundle formats are supported, including [umd](https://github.com/umdjs/umd), [iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), [amd](https://en.wikipedia.org/wiki/Asynchronous_module_definition), [cjs](https://en.wikipedia.org/wiki/CommonJS), [esm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [SystemJS](https://github.com/systemjs/systemjs); a minified gzipped version is also available for each bundle format.

### Node

```javascript
import setScrollPadlockStyle from "scroll-padlock";

setScrollPadlockStyle();
```

### Browser (modules)

```html
<script type="importmap">
  {
    "imports": {
      "scroll-padlock": "https://cdn.jsdelivr.net/npm/scroll-padlock/dist/es/scroll-padlock.min.js"
    }
  }
</script>

<script type="module">
  import setScrollPadlockStyle from "scroll-padlock";

  setScrollPadlockStyle();
</script>
```

### Browser (globals)

```html
<script src="https://cdn.jsdelivr.net/npm/scroll-padlock/dist/iife/scroll-padlock.min.js"></script>

<script>
  setScrollPadlockStyle();
</script>
```

## Under the Hood

...

## Usage

By default, a padlock instance addresses  the [default browser scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement) and a `scroll-locked` css class.

```css
.scroll-locked {
  overflow: hidden;

  padding-right: var(--scrollbar-width);
}
```

```javascript
setScrollPadlockStyle();
```

```javascript
document.scrollingElement.classList.add('scroll-locked');

document.scrollingElement.classList.remove('scroll-locked');
```

## CSS Variables

This is the complete list of **CSS variables** set by this library on the given elements.

- `--scroll-top`: the number of pixels the element's content is scrolled vertically.
- `--scroll-left`: the number of pixels the element's content is scrolled horizontally.
- `--scroll-width`: the total width of the element's scrollable content, including the non-visible part.
- `--scroll-height`: the total height of the element's scrollable content, including the non-visible part.
- `--scrollbar-width`: the width of the vertical scrollbar of the element.
- `--scrollbar-height`: the height of the horizontal scrollbar of the element.
- `--offset-width`: the total visible width of the element, including the scrollbar.
- `--offset-height`: the total visible height of the element, including the scrollbar.
- `--client-width`: the visible width of the element, excluding the scrollbar.
- `--client-height`: the visible height of the element, excluding the scrollbar.

## Options

```javascript
setScrollPadlockStyle({
  element: document.querySelector('#custom-scrolling-element'),

  selector: '#custom-scrolling-element.locked',

  formatter: ({ clientWidth, offsetWidth }) => `
    --custom-property: ${offsetWidth}px;
    width: ${clientWidth}px;
  `
});
```

## Return

```javascript
const style = setScrollPadlockStyle();

style.remove();
```

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested.

The library doesn't provide a fallback for those browsers which don't support [CSS variables](https://caniuse.com/css-variables) (mainly Internet Explorer 11).

## Development

Node version 20.11.0 or higher is required in order to compile source code or launch tests.

You can generate the unit tests coverage in human readable form with the following commands (having `lcov` installed is required).

```shell
npm test
```

```shell
genhtml --branch-coverage lcov.info -o coverage
```

```shell
npm run test:e2e
```

The library is compiled with the following command:

```shell
npm run build
```
