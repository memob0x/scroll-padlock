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

## Inclusion

This library is downloadable via **npm**:

```shell
npm install scroll-padlock
```

The source code is entirely written in [standard ECMAScript](https://tc39.es/) with no dependencies.
All major bundle formats are supported, including [umd](https://github.com/umdjs/umd), [iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), [amd](https://en.wikipedia.org/wiki/Asynchronous_module_definition), [cjs](https://en.wikipedia.org/wiki/CommonJS), [esm](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [SystemJS](https://github.com/systemjs/systemjs); a minified gzipped version is also available for each bundle format.

### Node

```javascript
import ScrollPadlock from "scroll-padlock";

const instance = new ScrollPadlock();
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
  import ScrollPadlock from "scroll-padlock";

  const instance = new ScrollPadlock();
</script>
```

### Browser (globals)

```html
<script src="https://cdn.jsdelivr.net/npm/scroll-padlock/dist/iife/scroll-padlock.min.js"></script>

<script>
  var instance = new ScrollPadlock();
</script>
```

## Under the Hood

Some [CSS variables](#css-variables), addressing a given html element **data attribute** (dinamically set), are set through a `style` appended in `head`, a given **CSS class** is **[observed](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)** to determine current state while **[window resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event) and [scroll](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event) events** are listened in order to update CSS variables; no other DOM modifications besides that.

## Usage

By default, a padlock instance addresses  the [default browser scrolling element](https://developer.mozilla.org/en-US/docs/Web/API/document/scrollingElement) and a `scroll-padlock-locked` css class.

```css
.scroll-padlock-locked {
  /* Standard way to lock scroll */
  overflow: hidden;

  /* Reserves space for scrollbar */
  padding-right: var(--scroll-padlock-scrollbar-width);
}
```

```javascript
const instance = new ScrollPadlock();
```

At this point, the lock state can be changed simply **toggling that CSS class**; since the CSS class change is internally observed, the class change itself can be done through native DOM API, a virtual DOM library, another DOM manipulation script, etc...

```javascript
document.scrollingElement.classList.add('scroll-padlock-locked');

document.scrollingElement.classList.remove('scroll-padlock-locked');
```

## CSS Variables

This is the complete list of **CSS variables** set by this library on the given elements.

- `--scroll-padlock-scroll-top`: the number of pixels that the scrolling element is scrolled vertically.
- `--scroll-padlock-scroll-left`: the number of pixels that the scrolling element is scrolled horizontally.
- `--scroll-padlock-scroll-width`: the scrolling element's content width.
- `--scroll-padlock-scroll-height`: the scrolling element's content height.
- `--scroll-padlock-scrollbar-width`: the scrolling element's vertical scrollbar size.
- `--scroll-padlock-scrollbar-height`: the scrolling element's horizontal scrollbar size.
- `--scroll-padlock-outer-width`: the scrolling element's width including the scrollbar size.
- `--scroll-padlock-outer-height`: the scrolling element's height including the scrollbar size.
- `--scroll-padlock-inner-width`: the scrolling element's width without the scrollbar size.
- `--scroll-padlock-inner-height`: the scrolling element's height without the scrollbar size.

## Options

The first constructor argument can be a single object of options, allowing more parameters to be used.

```javascript
const instance = new ScrollPadlock({
  // The html element which scrolls
  // The default value is document.scrollingElement
  scrollingElement: document.querySelector('#custom-scrolling-element'),

  // The element which trigger scroll event
  // When not provided (undefined) it is automatically determined
  // The default value is window
  scrollEventElement: undefined,

  // The css class which would determine the instance "locked" state
  // The default value is 'scroll-padlock-locked'
  cssClassName: 'custom-scroll-locked',
});
```

## API

The `destroy` method is particularly important when using **reactive frameworks** (such as React, Vue, Angular, etc...) which components lifecycle might generate memory leaks: **call `destroy` method when the component in which scroll-padlock is used gets unmounted**.

```javascript
// Detaches instance events, removes styles, etc...
instance.destroy();
```

The following **methods** can be used to programmatically update the instance state.

```javascript
// Updates the current instance locked/unlocked state (useful when MutationObserver is not supported)
instance.updateLockState();

// Updates the current instance scroll position and writes the relative CSS variables
instance.updateScrollPosition();

// Updates the current instance layout dimensions and writes the relative CSS variables
instance.updateLayoutDimensions();

// Does all of the above
instance.update();
```

The following **accessors** can be used to programmatically interact with the instance state.

```javascript
// Gets the the current scroll position
const { top, left } = instance.scroll;

// Sets a new scroll position;
// if the instance state is locked,
// the given position is saved for a future restoration;
// otherwise the instance element is directly scrolled to the given position
instance.scroll = { top, left };

// Gets the current instance element layout sizes
const {
  // The target's width and height including the scrollbar size
  outerWidth,
  outerHeight,

  // The target's width and height without the scrollbar size
  innerWidth,
  innerHeight,

  // The target's content width and height
  scrollWidth,
  scrollHeight,

  // The target's vertical and horizontal scrollbar size
  scrollbarWidth,
  scrollbarHeight,
} = instance.layout;

const {
  // The lock state CSS class name
  cssClassName,

  // The html element that can perform the scrolling action
  scrollingElement,

  // The element that can listen to scroll event
  scrollEventElement,
} = instance;
```

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested.

The library doesn't provide a fallback for those browsers which don't support [CSS variables](https://caniuse.com/css-variables) (mainly Internet Explorer 11); since these browsers tipically support _overflow: hidden_, the [JS API](#api) can be used to implement the scrollbars-gaps compensation normally achievable through CSS by standard browsers (a graceful degradation approach is highly suggested though).

## Development

Node version 20.11.0 or higher is required in order to compile source code or launch tests.

You can generate the unit tests coverage in human readable form with the following commands (having `lcov` installed is required).

```shell
npm test
```

```shell
genhtml lcov.info -o coverage
```

The library is compiled with the following command:

```shell
npm run build
```
