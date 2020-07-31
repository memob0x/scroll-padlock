# Body Scroll Lock

![Node.js CI](https://github.com/memob0x/body-scroll-lock/workflows/Node.js%20CI/badge.svg)

A css helper script based on **CSS variables** that lets you **lock the body scroll** with **iOS safari** "quirkness" and **scrollbar width** in mind.
Please note that this library does barely nothing under the hood, during its use it just writes and updates two global css variables and toggles a css class, this way you'll be able to lock the body scroll with the [css rules you prefer](#usage-pt1-css).

## Library Inclusion

This library is entirely written in [standard ECMAScript](https://tc39.es/), this means that you can safely include **src/body-scroll.mjs** in your es6 project as a module.

If older browsers support is needed, a third party module loader is used or there's not a module loading strategy, the following boundles might be preferred:

-   **dist/iife/body-scroll.js**: [immediately invoked function expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) syntax. This boundle sets a global variable, thus is indicated for projects which don't use any module loading strategy.
-   **dist/amd/body-scroll.js**: [asynchronous module definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) syntax.
-   **dist/cjs/body-scroll.js**: [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules syntax.
-   **dist/es/body-scroll.js**: [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntax.
-   **dist/system/body-scroll.js**: [SystemJS](https://github.com/systemjs/systemjs) modules syntax.

## TL;TR: The iOS Backstory

The **proper way** to lock body scroll has always been putting `overflow: hidden;` **on body element**, but unfortunately this approach **just doesn't work on iOS safari**. 🙅<br>
The cleanest way to overcome this unfortunate situation would be [preventing `touchmove` events](https://github.com/willmcpo/body-scroll-lock), but you might still have **issues** with some **`viewport` configurations** along with **pinch to zoom** taking place or **iOS navigation bars** covering your elements.<br>
Since **this script** is more of a tool to programmatically assign some css rules, I always considered this approach the most convenient solution: no event listeners to register/unregister; no scrollable inner-elements to keep in mind, no problems. ✌<br>
An halfway solution would be using the css `touch-action` property, but, again, [**safari doesn't** seem to **support it**](https://bugs.webkit.org/show_bug.cgi?id=133112) any time soon 🙄, so...

## Usage Pt.1: CSS

When [locking](#usage-pt2-javascript), two css variables, `--body-scroll-lock-top-rect` and `--body-scroll-lock-vertical-scrollbar-gap`, are programmatically set at `:root` level, making the css aware of the **window scroll position** and the **browser scrollbar width**, while a `body-scroll-lock` css class is assigned to the `html` element.

These interventions alone are enough to ensure a cross-browser body scroll lock as it follows:

```css
html.body-scroll-lock {
    /* position fixed hack, locks iOS too */
    position: fixed;
    width: 100%;

    /* avoids scroll to top */
    top: var(--body-scroll-lock-top-rect);

    /* reserves space for scrollbar */
    padding-right: var(--body-scroll-lock-vertical-scrollbar-gap);
}
```

Please note that some [browser recognition logic](https://gist.github.com/memob0x/0869e759887441b1349fdfe6bf5a188d) can be applied in order to address iOS more specifically, keeping the standard overflow approach for standard browsers:

```css
/* iOS only */
html.body-scroll-lock.ios {
    /* position fixed hack */
    position: fixed;
    width: 100%;

    /* avoids scroll to top */
    top: var(--body-scroll-lock-top-rect);
}

/* standard browsers only */
html.body-scroll-lock.standard body {
    /* standard way to lock body scroll */
    overflow: hidden;
}

/* both iOS and standard browsers */
html.body-scroll-lock {
    /* reserves space for scrollbar */
    padding-right: var(--body-scroll-lock-vertical-scrollbar-gap);
}
```

## Usage Pt.2: JavaScript

The current distribution boundle (_dist/body-scroll.js_) is in [**umd**](https://github.com/umdjs/umd) format, so it can be consumed in multiple environments, its inclusion in the browser sets a global `bodyScroll` variable. A **public Api interface** is exported as an `object`.

To **lock** the body scroll simply call the `lock` method.

```javascript
window.bodyScroll.lock(); // freeze!
```

To **unlock** it, call the `unlock` one.

```javascript
window.bodyScroll.unlock(); // scroll free, little bird.
```

A **isLocked** method can retrieve the actual body scroll lock status.

```javascript
const status = window.bodyScroll.isLocked(); // true when locked...
```

## Events

Get notified when scroll **state changes** listening to `bodyscrolllock` and `bodyscrollunlock` **events**.

```javascript
window.addEventListener("bodyscrolllock", () =>
    console.log("The body scroll has been locked by someone, somewhere...")
);

window.addEventListener("bodyscrollunlock", () =>
    console.log("Body scroll has been unlocked by someone, somewhere...")
);
```

There's a further `bodyscrollresize` event dispatched during browser window resize on a lock state which can be useful in some [edge cases](#iOS-Bars).

## Positioned elements

If you are experiencing issues with positioned elements remember you can overcome them with the same css variable you used to reserve the scrollbar with on body...

```css
/* a right positioned sidebar */
aside {
    position: fixed;
    top: 0;
    width: 240px;
    height: 100%;
    right: 0;
}

/* the same right positioned sidebar not affected by the scrollbar presence / disappearance */
html.body-scroll-lock aside {
    right: var(--body-scroll-lock-vertical-scrollbar-gap);
}
```

## iOS Bars

There are some edge cases in which iOS doesn't play nice: when the page is scrolled the **system bars** become smaller, at that point when the keyboard tray is triggered they become larger again; that can cause visual artifacts as you can see the following gif.

![ios bug](docs/bug.gif?raw=true)

That's because the element on focus is an input element and iOS forces a scroll to that element (to enhance the accessibility) on an area which would be shortly resized because of the system bars getting bigger. Pretty weird, huh?

To overcome this problem you can use `bodyscrollresize` event to programmatically scroll to top that ios-sub-window-thing.

```javascript
window.addEventListener("bodyscrollresize", () => {
    if (yourWayToDetect.isIOS()) {
        window.scrollTo(0, 0);
    }
});
```

As you can see in the following gif, things are finally back in place.

![ios bug](docs/fix.gif?raw=true)

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested; if you want to listen to the library [events](#events) in _Internet Explorer 11_ you'll need to include a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) polyfill.
A css variables polyfill is not mandatory, it depends on how graceful you want to degrade your application on [old browsers](https://caniuse.com/#feat=css-variables)... 🙄

## Demo

Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demo/) to check if this is what you're looking for. 🤞
