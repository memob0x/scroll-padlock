# ScrollPadlock

![Node.js CI](https://github.com/memob0x/scroll-padlock/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/scroll-padlock/latest.svg)](https://www.npmjs.com/package/scroll-padlock)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/scroll-padlock.svg)](https://www.npmjs.com/package/scroll-padlock)
![license](https://img.shields.io/npm/l/scroll-padlock)

A small (~4K gzipped) unobtrusive script aimed to encourage a **CSS-first** approach when **locking html elements scroll** reducing [cumulative layout shift](https://web.dev/cls/) and iOS Safari quirkiness.

🙅 Without this library:

![without scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/assets/without.gif?raw=true)

💁 With this library:

![with scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/assets/with.gif?raw=true)

## Examples

The project "e2e" folder _html files_ can also be used as demos to showcase how the library can be integrated with various CSS rules and addressing various elements of various applications.

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

## Usage

The library adds a stylesheet using the `.scroll-locked` selector, setting CSS variables with values useful for locking the page scroll using only CSS.

```css
.scroll-locked {
  overflow: hidden;

  padding-right: var(--scrollbar-width);
}
```

The library uses the [default browser scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement) and the [window object](https://developer.mozilla.org/en-US/docs/Web/API/Window) to retrieve the values for the CSS variables.
The function returns an `HTMLStyleElement`. This element is created and added to the document's `head` if it doesn't already exist. If it does exist, the previously set style rules are replaced.

```javascript
const styleElement = setScrollPadlockStyle();
```

At this point, it is possible to remove or add the CSS class to determine the blocking of the page scroll.

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

The library function accepts an options object to customize its behavior. Here are the available options:

- `element`: The DOM element that will be used to retrieve the values for the CSS variables.
- `selector`: A string representing a CSS selector to identify the target element.
- `formatter`: A function that formats the CSS styles to be added.

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

## Support

The most common [modern browsers](https://browsersl.ist/#q=defaults) have been tested.

The library doesn't provide a fallback for those browsers which don't support [CSS variables](https://caniuse.com/css-variables).

## Development

Node version 20.11.0 or higher is required in order to compile source code or launch tests.

```shell
npm test
```

To generate the unit tests coverage in a readable format, [lcov](https://github.com/linux-test-project/lcov) can be used.

```shell
genhtml --branch-coverage lcov.info -o coverage
```

To run the e2e tests, use the following command:

```shell
npm run test:e2e
```

To build the project, use the following command:

```shell
npm run build
```
