# Body Scroll Lock

A **CSS variables** based and **iOS safari compatible** technique to **lock body scroll**.
This library does barely nothing and no assumptions whatsoever under the hood, it just gives you everything you need to lock the body scroll efficiently keeping in mind iOS and the unfamous flickering effect you get when you put overflow: hidden; on the body element (causing the scrollbar to disappear, and the body itself to widen).

## The Backstory

The **proper way** to lock body scroll has always been putting `overflow: hidden;` **on body element**, but unfortunately this approach **just doesn't work on iOS safari**. 🙅<br>
The cleanest way to overcome this unfortunate situation would be [preventing `touchmove` events](https://github.com/willmcpo/body-scroll-lock), but you might still have **issues** with some **`viewport` configurations** along with **pinch to zoom** taking place or **iOS navigation bars** covering your elements.<br>
Since **this script** is more of a tool to programmatically **generate some CSS overrides rules** put in head element, I always considered this approach the most convenient solution: no event listeners to add/remove; no scrollable inner-elements to keep in mind, no problems. ✌<br>
An halfway solution would be using the css `touch-action` property, but, again, [**safari doesn't** seem to **support it**](https://bugs.webkit.org/show_bug.cgi?id=133112) any time soon 🙄, so...

## Usage Pt.1: CSS

Two css variables, `--body-scroll-scroll-y` and `--body-scroll-scrollbar-width`, are programmatically set, which contain respectively the window _scroll position_ and the browser _scrollbar width_, along with a `body-scroll-locked` css class to the `html` element.

These interventions alone are enough to ensure a cross-browser body scroll lock as it follows:

```css
html.body-scroll-locked {
    position: fixed;
    top: calc(var(--body-scroll-scroll-y) * -1);
    left: 0;
    width: 100%;
    padding-right: var(--body-scroll-scrollbar-width);
}
```

Please note that some browser recognition logic can be applied to address iOS more specifically keeping the standard approach for standard browsers:

```css
/* standard browsers body lock */
html.body-scroll-locked:not(.iOS-browser-sniffing-example) body {
    overflow: hidden;
}

/* iOS body lock */
html.body-scroll-locked.iOS-browser-sniffing-example {
    position: fixed;
    top: calc(var(--body-scroll-scroll-y) * -1);
    left: 0;
    width: 100%;
    padding-right: var(--body-scroll-scrollbar-width);
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

The main aim during the writing of this code was to be the less obtrusive as possible, so, without the use of any css class, inline style or element attribute, the only built-in way to keep track of the current **lock status** is to call the `isLocked` method.

```javascript
window.bodyScroll.isLocked(); // true when locked...
```

Lazy? Just `toggle` it...

```javascript
window.bodyScroll.toggle(); // locks if unlocked, unlocks if locked!
```

## Events

Get notified when scroll **state changes** listening to `bodyScrollLock` and `bodyScrollUnlock` **events**.

```javascript
window.addEventListener("bodyScrollLock", () =>
    console.log("The body scroll has been locked by someone, somewhere...")
);

window.addEventListener("bodyScrollUnlock", () =>
    console.log("Body scroll has been unlocked by someone, somewhere...")
);
```

## Support

All [modern browsers](https://teamtreehouse.com/community/what-is-a-modern-browser) have been tested; to support _Internet Explorer 11_ you will need to include a [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill) polyfill.

## Demo

Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demo/) to check if this is what you're looking for. 🤞
