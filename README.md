# ScrollPadlock

![Node.js CI](https://github.com/memob0x/scroll-padlock/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/scroll-padlock/latest.svg)](https://www.npmjs.com/package/scroll-padlock)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/scroll-padlock.svg)](https://www.npmjs.com/package/scroll-padlock)
![license](https://img.shields.io/npm/l/scroll-padlock)

A small (~4K gzipped) unobtrusive script aimed to encourage a CSS-first approach when locking HTML elements scroll. The source code is entirely written in vanilla JavaScript with no dependencies.

Without:

![without scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/assets/without.gif?raw=true)

With:

![with scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/assets/with.gif?raw=true)

## Examples

The HTML files in the "e2e" folder of the project can be used as demos to showcase how the library can be integrated with different approaches in various applications.

## Inclusion

### Node

```shell
npm install scroll-padlock
```

```javascript
import { setScrollPadlockStyle } from "scroll-padlock";

setScrollPadlockStyle();
```

### Browser modules

```html
<script type="importmap">
  {
    "imports": {
      "scroll-padlock": "https://cdn.jsdelivr.net/npm/scroll-padlock@latest/+esm"
    }
  }
</script>

<script type="module">
  import { setScrollPadlockStyle } from "scroll-padlock";

  setScrollPadlockStyle();
</script>
```

### Browser globals

```html
<script src="https://cdn.jsdelivr.net/npm/scroll-padlock@latest/dist/scroll-padlock.umd.min.js"></script>

<script>
  window.scrollPadlock.setScrollPadlockStyle();
</script>
```

## Usage

The library exports a `setScrollPadlockStyle` function which appends CSS styles addressing a default `.scroll-padlock` selector using the page default [scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement) and the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object to retrieve the values which would correspond to the following CSS variables:

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

These CSS variables can be used to implement the preferred approach to prevent the element scroll or to add the scrollbar gap componsation, see the following basic example:

```css
.scroll-padlock {
  overflow: hidden;

  padding-right: var(--scrollbar-width);
}
```

Since each function call updates the CSS variables, a good time to call it is immediately before adding the CSS class that would lock the element scroll.

```javascript
setScrollPadlockStyle();

document.scrollingElement.classList.add('scroll-padlock');
```

## Options

The `setScrollPadlockStyle` function accepts an options object which customizes its behavior. Here are the available options:

- `element`: the DOM element that will be used to retrieve the CSS variables values.
- `selector`: the CSS selector string that identifies the target element.
- `formatter`: a function that allows to customize the the CSS styles to be added.

```javascript
setScrollPadlockStyle({
  element: document.querySelector('#custom-scrolling-element'),

  selector: '.custom-element-scroll-padlock',

  formatter: ({ clientWidth }) => `--width-without-scrollbar: ${clientWidth}px;`
});
```

## Development

Node version 20.11.0 or higher is required in order to execute the tests.

```shell
npm test
```

To generate the unit tests coverage in a readable format, [lcov](https://github.com/linux-test-project/lcov) can be used.

```shell
genhtml --branch-coverage lcov.info -o coverage
```

The locally built library is imported in the end-to-end tests, so a build is required.

```shell
npm run build
```

To run the end-to-end tests, use the following command:

```shell
npm run test:e2e
```
