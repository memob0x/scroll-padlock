# ScrollPadlock

![Node.js CI](https://github.com/memob0x/scroll-padlock/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/scroll-padlock/latest.svg)](https://www.npmjs.com/package/scroll-padlock)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/scroll-padlock.svg)](https://www.npmjs.com/package/scroll-padlock)
![license](https://img.shields.io/npm/l/scroll-padlock)

A small unobtrusive script aimed to encourage a CSS-first approach when locking HTML elements scroll. It is entirely written in vanilla JavaScript with no dependencies.

Without scrollbar gap compensation:

![without scrollbar gap compensation](/assets/without-scrollbar-gap-compensation.gif?raw=true)

With scrollbar gap compensation:

![with scrollbar gap compensation](/assets/with-scrollbar-gap-compensation.gif?raw=true)

## Installation

It can be installed via npm:

```shell
npm install scroll-padlock
```

```javascript
import { setStyle } from "scroll-padlock";

setStyle();
```

The library also builds to a UMD format, so it can be consumed in multiple environments (browser, AMD, or CommonJS) from the same bundle.

## Usage

The library exports a `setStyle` function that appends CSS styles targeting the default `.scroll-padlock` selector. By default, it uses the page's [scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement) and the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object to retrieve values, which are then assigned to CSS variables for use as preferred.

The appended CSS variables can be used to implement the preferred approach to prevent the element scroll or to add the scrollbar gap componsation, see the following basic example:

```css
.scroll-padlock {
  overflow: hidden;
  padding-right: calc(var(--offset-width, 0) - var(--client-width, 0));
}
```

Since each function call updates the CSS variables, a good time to call it is immediately before adding the CSS class that would lock the element scroll.

```javascript
setStyle();

document.scrollingElement.classList.add('scroll-padlock');
```

## CSS Variables

After calling `setStyle`, the following default CSS variables become available:

- `--scroll-top`: the number of pixels the element's content is scrolled vertically.
- `--scroll-left`: the number of pixels the element's content is scrolled horizontally.
- `--scroll-width`: the total width of the element's scrollable content, including the non-visible part.
- `--scroll-height`: the total height of the element's scrollable content, including the non-visible part.
- `--offset-width`: the total visible width of the element, including the scrollbar.
- `--offset-height`: the total visible height of the element, including the scrollbar.
- `--client-width`: the visible width of the element, excluding the scrollbar.
- `--client-height`: the visible height of the element, excluding the scrollbar.

## Options

The `setStyle` function accepts an options object which customizes its behavior. Here are the available options:

- `element`: the DOM element that will be used to retrieve the CSS variables values.
- `selector`: the CSS selector string that identifies the target element.
- `formatter`: a function that allows to customize the the CSS styles to be added.

```javascript
setStyle({
  element: document.querySelector('#custom-scrolling-element'),
  selector: '.custom-element-scroll-padlock',
  formatter: ({ offsetWidth, clientWidth }) => `--scrollbar-width: ${offsetWidth - clientWidth}px;`
});
```

## Contributing

Node version 22.16.0 or higher is required in order to execute the tests.

```shell
npm test
```

The locally built library is imported in the end-to-end tests, so a build is required.

```shell
npm run build
```

To run the end-to-end tests, use the following command:

```shell
npm run test:e2e
```
