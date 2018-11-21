# Body Scroll Lock
An **iOS safari compatible** technique to **lock body scroll**.
This is basically the classic `position: fixed;` on **html element** hack on steroids: it saves the scroll position and reserves a gap for [scrollbar width](#the-scrollbar-width-issue).

## The Backstory
The **proper way** to lock body scroll has always been putting `overflow: hidden;` **on body element**, but unfortunately this approach **just doesn't work on iOS safari**. 🙅<br>
The cleanest way to overcome this unfortunate situation would be [preventing `touchmove` events](https://github.com/willmcpo/body-scroll-lock), but you might still have **issues** with some **`viewport` configurations** along with **pinch to zoom** taking place or **iOS navigation bars** covering your elements.<br>
Since **this script** is more of a tool to programmatically **generate some CSS overrides rules** put in head element, I always considered this approach the most convenient solution: no event listeners to add/remove; no scrollable inner-elements to keep in mind, no problems. ✌<br>
An halfway solution would be using the css `touch-action` property, but, again, [**safari doesn't** seem to **support it**](https://bugs.webkit.org/show_bug.cgi?id=133112) any time soon 🙄, so...

## Usage
The inclusion of **body-scroll.js** sets a global **bodyScroll** variable, which is basically an `Object` with some `methods` in it.

To **lock** the body scroll simply call the `lock` method.
```javascript
window.bodyScroll.lock(); // freeze!
```
To **unlock** it, call the `unlock` one.
```javascript
window.bodyScroll.unlock(); // scroll free, little bird.
```

The main aim during the writing of this code was to be as seamless as possible, so, without the use of any css class, inline style or element attribute, the only built-in way to keep track of the current **lock status** is to call the `isLocked` method.
```javascript
window.bodyScroll.isLocked(); // true when locked...
```

Lazy? Just **toggle** it...
```javascript
window.bodyScroll.toggle(); // locks if unlocked, unlocks if locked!
```

## The scrollbar width issue
The `lock` method internally takes care of the infamous unpleasant flickering effect you get when you put `overflow: hidden;` on html or body elements, making the scrollbar disappear, and the body widen, but you may still have it on some **right-aligned _fixed_ elements** in your page.<br>
Registering those elements **selectors** with the `registerScrollbarGapSelectors` method will fix that, adding the scrollbar width to their `margin-right` when the `lock` function is called.
```javascript
window.bodyScroll.registerScrollbarGapSelectors([
    '#header.sticky'
]);
```
You prefer the `padding-right` property? No problem.
```javascript
window.bodyScroll.registerScrollbarGapSelectors([
    '#header.sticky',
    {
        selector: '.lightbox',
        property: 'padding-right'
    }
]);
```
The `right` property is also supported.
```javascript
window.bodyScroll.registerScrollbarGapSelectors([
    '#header.sticky',
    {
        selector: '.lightbox',
        property: 'padding-right'
    },
    {
        selector: '.bruh',
        property: 'right'
    }
]);
```

## Demo
Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demos/sample-page.html) to check if this is what you're looking for. 🤞
