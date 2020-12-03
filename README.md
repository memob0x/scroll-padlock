# ScrollPadlock

![Node.js CI](https://github.com/memob0x/body-scroll-lock/workflows/Node.js%20CI/badge.svg)

A "CSS helper" script which relies on **CSS variables** in order to programmatically **prevent the ability to scroll** for any scrollable element avoiding "contents jump".

🙅 Without ScrollPadlock:

![without scrollbar gap compensation](docs/without-gap-compensation.gif?raw=true)

💁 With ScrollPadlock:

![with scrollbar gap compensation](docs/with-gap-compensation.gif?raw=true)

## TL;TR: a body scroll overview

🙅 `body { overflow: hidden; }` is the most common way to lock the scroll position on every browsers, unfortunately, unless user's browser has overlay scrollbars, that would cause the scrollbar to disappear, the body to expand and the contents to jump to the right;<br>
to make things worse that technique just **doesn't work** on **iOS safari**: when set the user can still somehow scroll the page.

🙅 `body { touch-action: none; }` can't help since Safari [doesn't seem to support it](https://bugs.webkit.org/show_bug.cgi?id=133112) anytime soon.

🤷 Some libraries propose to solve this preventing `touchmove` events, which might work out very well in many cases; unfortunately some **issues** with some **`viewport` configurations** or **pinch to zoom** might still be encountered, also **iOS navigation bars** might end up covering some layout elements.

🙅 `body { position: fixed; }` alone can force iOS to lock the scroll, but when applied the scroll position would eventually jump to the top of the page.

💁 This library sets some **css variables** and **css classes** in order to allow the developer to choose their preferred [CSS-only approach](#usage-pt1-css), while the class instance exposes a quite granular API in order to implement some JS strategies too.

## Usage, part 1: inclusion

This library is downloadable via **npm**, which means you can enter the following command directly in your terminal:

```console
$ npm install @memob0x/body-scroll-lock
```

This library is entirely written in [standard ECMAScript](https://tc39.es/), this means that you can safely include **src/padlock.mjs** module in your es6 project without affecting your final bundle size.

If older browsers support is needed, if a third party module loader is used or if there's no module loading strategy implemented, the following boundles might be preferred:

-   **dist/iife/scroll-padlock.js**: [immediately invoked function expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) syntax. This boundle sets a global variable, thus is indicated for projects which don't use any module loading strategy.
-   **dist/amd/scroll-padlock.js**: [asynchronous module definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) syntax.
-   **dist/cjs/scroll-padlock.js**: [CommonJS](https://en.wikipedia.org/wiki/CommonJS) modules syntax.
-   **dist/es/scroll-padlock.js**: [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) syntax.
-   **dist/system/scroll-padlock.js**: [SystemJS](https://github.com/systemjs/systemjs) modules syntax.

## Usage, part 2: CSS rules

When [locking](#usage-pt2-javascript), some css variables are programmatically set at the given element level  (provided to class constructor), making the css aware of its **scroll position** and its **scrollbar width**, while some css classes toggled to that very element reflect the instance state.

```css
/* scroll distance from top */
--scroll-padlock-top-rect: 1234px;

/* scroll distance from left */
--scroll-padlock-left-rect: 1234px;

/* the vertical scrollbar size */
--scroll-padlock-vertical-scrollbar-gap: 15px;

/* the horizontal scrollbar size */
--scroll-padlock-horizontal-scrollbar-gap: 15px;
```

These interventions alone are enough to ensure a cross-browser body scroll lock as it follows:

```css
html.scroll-padlock {
    /* library initialized... */
}

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
    /* position fixed hack */
    position: fixed;
    width: 100%;

    /* avoids scroll to top */
    top: var(--scroll-padlock-top-rect);
}

/* standard browsers only */
html.scroll-padlock--locked.standard body {
    /* standard way to lock body scroll */
    overflow: hidden;
}

/* both iOS and standard browsers */
html.scroll-padlock--locked {
    /* reserves space for scrollbar */
    padding-right: var(--scroll-padlock--locked-vertical-scrollbar-gap);
}
```

## Usage, part 3: instance methods call

First, a padlock **instance** must be created.

```javascript
const bodyScroll = new ScrollPadlock(document.documentElement); // NOTE: document.documentElement is the default parameter
```

To **lock** the body scroll simply call the `lock` method.

```javascript
bodyScroll.lock(); // freeze!
```

To **unlock** it, call the `unlock` one.

```javascript
bodyScroll.unlock(); // scroll free, little bird.
```

A **state** method can retrieve the actual body scroll lock status.

```javascript
const status = bodyScroll.state(); // true when locked...
```

## Events

Get notified when scroll **state changes** listening to `scrollpadlocklock` and `scrollpadlockunlock` **events**.

```javascript
document.documentElement.addEventListener("scrollpadlocklock", () =>
    console.log("The body scroll has been locked by someone, somewhere...")
);

document.documentElement.addEventListener("scrollpadlockunlock", () =>
    console.log("Body scroll has been unlocked by someone, somewhere...")
);
```

There's a further `scrollpadlockresize` event dispatched during browser window resize on a lock state which can be useful in some [edge cases](#iOS-Bars).

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
html.scroll-padlock--locked aside {
    right: var(--scroll-padlock-vertical-scrollbar-gap);
}
```

## iOS Bars

There are some edge cases in which iOS doesn't play nice: when the page is scrolled the **system bars** become smaller, at that point when the keyboard tray is triggered they become larger again; that can cause visual artifacts as you can see the following gif.

![ios bug](docs/ios-bug.gif?raw=true)

That's because the element on focus is an input element and iOS forces a scroll to that element (to enhance the accessibility) on an area which would be shortly resized because of the system bars getting bigger. Pretty weird, huh?

To overcome this problem you can use `scrollpadlockresize` event to programmatically scroll to top that ios-sub-window-thing.

```javascript
window.addEventListener("scrollpadlockresize", () => {
    if (someRecognizer.isIOS()) {
        window.scrollTo(0, 0);
    }
});
```

As you can see in the following gif, things are finally back in place.

![ios bug](docs/ios-fix.gif?raw=true)

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested; [WeakMap](https://caniuse.com/mdn-javascript_builtins_weakmap) object is used, so if you plan to support very old browsers (_Internet Explorer 10_ and such...) a polyfill might be mandatory.

If you want to listen to the library [events](#events) in _Internet Explorer 11_ you'll need to include a [CustomEvent](https://caniuse.com/customevent) [polyfill](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) too.

A css variables polyfill is not mandatory, it depends on how graceful you want to degrade your application on [old browsers](https://caniuse.com/css-variables)... 🙄

## Demo

Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demo/) to check if this is what you're looking for. 🤞
