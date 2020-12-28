# ScrollPadlock

![Node.js CI](https://github.com/memob0x/scroll-padlock/workflows/Node.js%20CI/badge.svg)
[![scroll-padlock (latest)](https://img.shields.io/npm/v/scroll-padlock/latest.svg)](https://www.npmjs.com/package/scroll-padlock)
[![scroll-padlock (downloads)](https://img.shields.io/npm/dy/scroll-padlock.svg)](https://www.npmjs.com/package/scroll-padlock)

A small script (~4K gzipped) which allows developers to implement their own way to **lock html elements scroll** avoiding "contents jump", preferably through CSS.

🙅 Without this library:

![without scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/docs/without-gap-compensation.gif?raw=true)

💁 With this library:

![with scrollbar gap compensation](https://github.com/memob0x/scroll-padlock/blob/master/docs/with-gap-compensation.gif?raw=true)

## TL;TR: a body scroll overview

🙅 `body { overflow: hidden; }` is the most common way to lock the scroll position on every browsers, unfortunately, unless user's browser has overlay scrollbars, that would cause the scrollbar to disappear, the body to expand and the contents to jump to the right;<br>
to make things worse that technique just **doesn't work** on **iOS safari**: when set the user can still somehow scroll the page.

🙅 `body { touch-action: none; }` can't help since Safari [doesn't seem to support it](https://bugs.webkit.org/show_bug.cgi?id=133112) anytime soon.

🤷 Some libraries propose to solve this preventing `touchmove` events, which might work out very well in many cases; unfortunately some **issues** with some **`viewport` configurations** or **pinch to zoom** might still be encountered, also **iOS navigation bars** might end up covering some layout elements.

🙅 `body { position: fixed; }` alone can force iOS to lock the scroll, but when applied the scroll position would eventually jump to the top of the page.

💁 This library sets some **css variables** and **css classes** in order to allow the developer to choose their preferred [CSS-only approach](#usage-pt1-css), while the class instance exposes a quite granular API in order to implement some JS strategies too.

## Usage, part 1: inclusion

This library is downloadable via **npm**:

```console
$ npm install scroll-padlock
```

The source code is entirely written in [standard ECMAScript](https://tc39.es/), the **src/padlock.mjs** module can be safely imported in an es6 project; otherwise the following transpiled bundles are available:

-   **dist/iife/scroll-padlock.js**: [immediately invoked function expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) syntax. This bundle sets a global variable, thus is indicated for projects which don't use any module loading strategy.
-   **dist/amd/scroll-padlock.js**: [asynchronous module definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) syntax.
-   **dist/cjs/scroll-padlock.js**: [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules syntax.
-   **dist/es/scroll-padlock.js**: [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntax.
-   **dist/system/scroll-padlock.js**: [SystemJS](https://github.com/systemjs/systemjs) modules syntax.

## Usage, part 2: CSS rules

As an instance is created, some CSS variables are programmatically set at the given element level (the element provided to the constructor as a parameter), making CSS "aware" of its **scroll position** and its **scrollbar width**, while some CSS classes are toggled to that same element in order to reflect its instance state.

### The CSS variables:
* `--scroll-padlock-top-rect`: the scroll distance from top.
* `--scroll-padlock-left-rect`: the scroll distance from left.
* `--scroll-padlock-vertical-scrollbar-gap`: the vertical scrollbar width.
* `--scroll-padlock-horizontal-scrollbar-gap`: the horizontal scrollbar width.

### The CSS classes:
* `scroll-padlock`: the class instance has been initialized and attached to the given element.
* `scroll-padlock--locked`: the instance state is **locked**.

The following ruleset alone is enough to ensure a cross-browser body scroll lock:

```css
html.scroll-padlock--locked {
    /* position fixed hack, locks iOS too */
    position: fixed;
    width: 100%;

    /* avoids scroll to top */
    top: var(--scroll-padlock-top-rect);

    /* reserves space for scrollbar */
    padding-right: var(--scroll-padlock-vertical-scrollbar-gap);
}
```

Please note that some [browser recognition logic](https://gist.github.com/memob0x/0869e759887441b1349fdfe6bf5a188d) can be applied in order to address iOS more specifically, keeping the standard overflow approach for standard browsers:

```css
/* iOS only */
html.scroll-padlock--locked.ios {
    /* iOS fixed position hack */
    position: fixed;
    width: 100%;

    /* Avoids scroll to top */
    top: var(--scroll-padlock-top-rect);
}

/* Standard browsers only */
html.scroll-padlock--locked.not-ios,
html.scroll-padlock--locked.not-ios body {
    /* Standard way to lock scroll */
    overflow: hidden;
}

html.scroll-padlock--locked.not-ios body {
    /* Reserves space for scrollbar (iOS has overlay scrollbars, this rule would have no effect there)*/
    padding-right: var(--scroll-padlock-vertical-scrollbar-gap);
}
```

## Usage, part 3: class instance

A padlock **instance** must be created first.

```javascript
// The element which scroll needs to be controlled
// NOTE: document.documentElement is the default parameter
const target = document.documentElement;

// Creates the instance
const instance = new ScrollPadlock(target);
```

To **lock** or **unlock** an instance simply use the property `state` accessor as a _setter_.

```javascript
// Locks the scroll
instance.state = true;

// Unlocks the scroll
instance.state = false;
```

Used as a _getter_, the property `state` gets the current instance state.

```javascript
// Gets the current state: true when locked, false when unlocked
const isLocked = instance.state;
```

Both accessors combined would make an instance state **toggler**...

```javascript
// Toggles the instance state
instance.state = !instance.state;
```

The `destroy` method is particularly important when using **reactive frameworks** (such as React, Vue, Angular, etc...) which components lifecycle combined with external libraries might generate memory leaks: **call this method when the components in which scroll-padlock is used get unmounted**.

```javascript
// Detaches instances events, removes styles, etc...
instance.destroy();
```

Some **other methods or accessors** can be useful when custom DOM-manipulation logic takes place.

```javascript
// Updates current instance computed styles (CSS variables, etc...)
instance.update();

// Gets the the current scroll position
const { top, left } = instance.scroll;

// Sets a new scroll position;
// if the instance state is locked, the given position is saved for a future restoration
instance.scroll = { top, left };

// Gets the current scrollbars width
const { vertical, horizontal } = instance.scrollbar;

// Gets the instance element;
// the same element provided to the class constructor (document.documentElement is the default one)
const target = instance.element;
```

## Events

Get notified whenever the instance **state changes** by listening to `scrollpadlocklock` and `scrollpadlockunlock` **events**.

```javascript
// Listens to any lock events
target.addEventListener("scrollpadlocklock", () =>
    console.log("The body scroll has been locked.")
);

// Linstens to any unlock events
target.addEventListener("scrollpadlockunlock", () =>
    console.log("Body scroll has been unlocked.")
);
```

There's a further `scrollpadlockresize` event dispatched during browser window resize on a lock state which can be useful in some [edge cases](#iOS-Bars).

## Positioned elements

If positioned elements "jumps" during an instance state change, the same CSS variables that are used to reserve the scrollbar width can be used to overcome this problem as well.

```css
/* Sidebar container */
.scrollable-sidebar-container {
    position: relative;
}

/* A right-positioned sidebar */
.scrollable-sidebar-container .sidebar {
    position: absolute;
    right: 0;
}

/* The same right-positioned sidebar, not affected by its own container scrollbars disappearance */
.scrollable-sidebar-container.scroll-padlock--locked .sidebar {
    right: var(--scroll-padlock-vertical-scrollbar-gap);
}
```

## iOS Bars

There are some edge cases in which iOS doesn't play nice: when the page is scrolled the **system bars** become smaller, at that point when the keyboard tray is triggered they become larger again; that can cause the following visual artifacts.

![ios bug](https://github.com/memob0x/scroll-padlock/blob/master/docs/ios-bug.gif?raw=true)

That's because the element on focus is an input element and iOS forces a scroll to that element (to enhance the accessibility) on an area which would be shortly resized because of the system bars getting bigger. Pretty weird, huh?

To overcome this problem the event `scrollpadlockresize` event can be used to programmatically scroll to top that ios-sub-window-thing.

```javascript
target.addEventListener("scrollpadlockresize", () => {
    if ( someWayToDetectAppleIOS() ) {
        window.scrollTo(0, 0);
    }
});
```
The problem should be solved at this point.

![ios bug](https://github.com/memob0x/scroll-padlock/blob/master/docs/ios-fix.gif?raw=true)

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested, but here's a list of dependencies that might be needed in order to support older ones:
* 💥 DOM API "[matches](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill)" method ([polyfill](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill))
* 💥 [WeakMap](https://caniuse.com/mdn-javascript_builtins_weakmap)
* [CustomEvent](https://caniuse.com/customevent) ([polyfill](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill)), only if library [events](#events) are being used
* [CSS variables](https://caniuse.com/css-variables), only for scrollbar gaps compensation (since old browsers support _overflow: hidden_), still the JS API and events can be used to reach a workaround

## Try it out!

[Here](https://memob0x.github.io/scroll-padlock/demo/)'s a demo page.
