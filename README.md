# Body Scroll Lock

A css helper script based on **CSS variables** that lets you **lock the body scroll** with **iOS safari** "quirkness" and **scrollbar width** in mind.
Please note that this library does barely nothing under the hood, during its use it just writes and updates two global css variables and toggles a css class, this way you'll be able to lock the body scroll with the [css rules you prefer](#usage-pt1-css).

## The Backstory

The **proper way** to lock body scroll has always been putting `overflow: hidden;` **on body element**, but unfortunately this approach **just doesn't work on iOS safari**. 🙅<br>
The cleanest way to overcome this unfortunate situation would be [preventing `touchmove` events](https://github.com/willmcpo/body-scroll-lock), but you might still have **issues** with some **`viewport` configurations** along with **pinch to zoom** taking place or **iOS navigation bars** covering your elements.<br>
Since **this script** is more of a tool to programmatically assign some css rules, I always considered this approach the most convenient solution: no event listeners to register/unregister; no scrollable inner-elements to keep in mind, no problems. ✌<br>
An halfway solution would be using the css `touch-action` property, but, again, [**safari doesn't** seem to **support it**](https://bugs.webkit.org/show_bug.cgi?id=133112) any time soon 🙄, so...

## Usage Pt.1: CSS

When [locking](#usage-pt2-javascript), two css variables, `--body-scroll-lock-top-rect` and `--body-scroll-lock-scrollbar-gap`, are programmatically set at `:root` level, making the css aware of the **window scroll position** and the **browser scrollbar width**, while a `body-scroll-lock` css class is assigned to the `html` element.

These interventions alone are enough to ensure a cross-browser body scroll lock as it follows:

```css
html.body-scroll-lock {
    /* position fixed hack, locks iOS too */
    position: fixed;
    width: 100%;

    /* avoids scroll to top */
    top: var(--body-scroll-lock-top-rect);

    /* reserves space for scrollbar */
    padding-right: var(--body-scroll-lock-scrollbar-gap);
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
    padding-right: var(--body-scroll-lock-scrollbar-gap);
}
```

## Usage Pt.2: JavaScript

The inclusion of **body-scroll.js** sets a global **bodyScroll** variable, which is basically an `Object` with some `methods` in it.

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

## Positioned elements

If you are experiencing issues with positioned elements remember you can overcome them with the same css variable you used to reserve the scrollbar with on body...

```css
/* a right positioned sidebar */
aside {
    position: fixed;
    top: 0;
    width: 240px;
    height: 100%;

    /* takes care of scrollbar presence */
    right: var(--body-scroll-lock-scrollbar-gap);
}
```

...just remember to include a default value as it follows:

```css
:root {
    --body-scroll-lock-scrollbar-gap: 0px;
}
```

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested; if you want to listen to the library [events](#events) in _Internet Explorer 11_ you'll need to include a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) polyfill.
A css variables polyfill is not mandatory, it depends on how graceful you want to degrade your application on [old browsers](https://caniuse.com/#feat=css-variables)... 🙄

## Demo

Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demo/) to check if this is what you're looking for. 🤞
