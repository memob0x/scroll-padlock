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

- React ([Preview](https://vouoz.csb.app/) - [Browse](https://codesandbox.io/s/scroll-padlock-react-vouoz))
- Angular ([Preview](https://xuudg.csb.app/) - [Browse](https://codesandbox.io/s/scroll-padlock-angular-xuudg))
- Vue ([Preview](https://6ewti.csb.app/) - [Browse](https://codesandbox.io/s/scroll-padlock-vue-6ewti))
- Vanilla ([Preview](https://rgzrb.csb.app/) - [Browse](https://codesandbox.io/s/scroll-padlock-vanilla-rgzrb))

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

const scrollPadlock = new ScrollPadlock();
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

  const scrollPadlock = new ScrollPadlock();
</script>
```

### Browser (globals)

```html
<script src="https://cdn.jsdelivr.net/npm/scroll-padlock/dist/iife/scroll-padlock.min.js"></script>

<script>
  var scrollPadlock = new ScrollPadlock();
</script>
```

## Under the Hood

Some [CSS variables](#css-variables), addressing a given html element **data attribute** (dinamically set), are set through a `style` appended in `head`, a given **CSS class** is **[observed](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)** to determine current state while **[window resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event) and [scroll](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event) events** are listened in order to update CSS variables; no other DOM modifications besides that.

## Usage (basic)

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

## Usage (advanced)

A custom scrolling element and a custom css class name are both supported.

```javascript
const scrollingElement = document.querySelector('#scrolling-element');

const instance = new ScrollPadlock(scrollingElement "scroll-locked");

scrollingElement.classList.add("scroll-locked");

scrollingElement.classList.remove("scroll-locked");
```

The first constructor argument can be a single object of options, allowing more parameters to be used.

```javascript
const instance = new ScrollPadlock({
  // the html element which scrolls
  scrollingElement: document.scrollingElement,

  // the element which trigger scroll event
  scrollEventElement: window,

  cssClassName: 'scroll-locked',

  // useful in order to debounce the original resize handler execution, etc...
  resizeHandlerWrapper: handler => handler,

  // useful in order to throttle the original scroll handler execution, etc...
  scrollHandlerWrapper: handler => handler,

  // useful in test environment scenarios
  client: window,
});
```

The following ruleset alone is enough to ensure a cross-browser page scroll lock for a standard vertical-scroll page:

```css
.scroll-padlock-locked {
  /* non-iOS browsers scroll lock */

  /* Standard way to lock scroll */
  overflow: hidden;

  /* Reserves space for scrollbar */
  padding-right: var(--scroll-padlock-scrollbar-width);

  /* iOS only page scroll lock */

  /* iOS page scroll lock hack */
  position: fixed;
  width: 100%;

  /* Avoids scroll to top for iOS page scroll lock hack */
  top: calc(var(--scroll-padlock-scroll-top) * -1);
}
```

## CSS Variables

This is the complete list of CSS variables set by this library on the given elements.

- `--scroll-padlock-scroll-top`: the number of pixels that the scrolling element is scrolled vertically.
- `--scroll-padlock-scroll-left`: the number of pixels that the scrolling element is scrolled horizontally.
- `--scroll-padlock-scrollbar-width`: the scrolling element's vertical scrollbar size.
- `--scroll-padlock-scrollbar-height`: the scrolling element's horizontal scrollbar size.
- `--scroll-padlock-outer-width`: the scrolling element's width including the scrollbar size.
- `--scroll-padlock-outer-height`: the scrolling element's height including the scrollbar size.
- `--scroll-padlock-inner-width`: the scrolling element's width without the scrollbar size.
- `--scroll-padlock-inner-height`: the scrolling element's height without the scrollbar size.
- `--scroll-padlock-scroll-width`: the scrolling element's content width.
- `--scroll-padlock-scroll-height`: the scrolling element's content height.

## API

The `destroy` method is particularly important when using **reactive frameworks** (such as React, Vue, Angular, etc...) which components lifecycle might generate memory leaks: **call `destroy` method when the component in which scroll-padlock is used gets unmounted**.

```javascript
// Detaches instance events, removes styles, etc...
instance.destroy();
```

Some **other methods or accessors** can be useful when custom DOM-manipulation logic takes place.

```javascript
// Updates current instance computed styles (CSS variables, etc...)
instance.update();

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

// Pauses the instance "resize" event listener
instance.unlisten('resize');

// Pauses the instance "scroll" event listener
instance.unlisten('scroll');

// Resumes the instance "resize" event listener
instance.listen('resize');

// Resumes the instance "scroll" event listener
instance.listen('scroll');
```

## Positioned Elements

If positioned elements "jumps" on a parent lock state change, the same CSS variables that are used to reserve the scrollbar width can be used to overcome this problem as well.

```css
/* A right-positioned child */
.positioned-element {
  position: fixed;
  right: 0;
}

/* The same right-positioned element, */
/* not affected by its own container scrollbars disappearance */
.scroll-padlock-locked .positioned-element {
  right: var(--scroll-padlock-scrollbar-width);
}
```

## iOS Bars and Keyboard Tray

There might still be an iOS edge case when locking page scroll with _position: fixed_ technique: when the page is scrolled the **system bars** become smaller; at that point, when focusing an input element programmatically, the keyboard tray is triggered and the bars become larger again; that, probably when some animations are taking place, can cause the following visual artifacts.

![ios bug](https://github.com/memob0x/scroll-padlock/blob/master/docs/ios-bug.gif?raw=true)

What happens here is iOS forcing a scroll to the focused element (still out of canvas) in an already "locked" area (limited by the OS itself) which would be also resized because of the system bars getting taller.

To overcome this problem the native `resize` event can be listened in order to programmatically scroll to top when the css class of that particular case is present.

```javascript
// Addressing the "ios-keyboard-sub-window-thing offset" bug:
// page scroll lock along with a programmatic focus
// on an a form field make the keyboard tray to show
// and that triggers, along with the visual artifact itself, a "resize" event
window.addEventListener("resize", () => {
  if (document.scrollingElement.contains("scroll-padlock-locked")) {
    // "Re-aligns" the iOS keyboard sub-window
    window.scrollTo(0, 0);
  }
});
```

The problem should be solved at this point.

![ios bug](https://github.com/memob0x/scroll-padlock/blob/master/docs/ios-fix.gif?raw=true)

## The case study

- `overflow: hidden` is the most common way to lock the scroll position on every browsers, unfortunately, unless user's browser has overlay scrollbars, that would cause the scrollbar to disappear, the body to expand and the contents to jump to the right ([CLS](https://web.dev/cls/));
to make things worse that technique just **doesn't work** on **iOS safari**: when set the user can still scroll the page.
- `touch-action: none` can't help since Safari [doesn't seem to support it](https://bugs.webkit.org/show_bug.cgi?id=133112) anytime soon.
- Some libraries propose to solve this preventing `touchmove` events, which might work out very well in many cases; unfortunately some **issues** with some **`viewport` configurations** or **pinch to zoom** might still be encountered, also **iOS navigation bars** might end up covering some layout elements.
- `position: fixed` alone can force iOS to lock the scroll, but when applied the scroll position would eventually jump to the top of the page.
- This library sets some **css variables** and **css classes** in order to allow the developer to choose their preferred CSS-only approach, while the class instance exposes a quite granular API in order to implement some JS strategies too.

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
