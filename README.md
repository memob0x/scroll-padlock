# Body Scroll Lock
An **iOS safari compatible** technique to **lock body scroll**.
This is basically the classic `position: fixed;` on body element approach on steroids: it saves the scroll position and reserves a gap for [scrollbar width](#the-scrollbar-width-issue).

## The Backstory
The proper way to lock body scroll is putting `overflow: hidden;` **on body and html elements**, but unfortunately this approach just doesn't work on iOS safari.<br>
The cleanest way to overcome this situation would be preventing `touchmove` events, but you might still have issues with some `viewport` metatag configurations along with pinch to zoom taking place and other scroll inertia related artifacts.<br>
So, if you do use the most common configuration (`<meta name="viewport" content="width=device-width, initial-scale=1">`) you should not have any problems using [that approach](https://github.com/willmcpo/body-scroll-lock), otherwhise you would probably need this script.

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

The main aim during the writing of this code was to be as seamless as possible, so, without the use of any css class, inline style or attribute, the only built-in way to keep track of the current **lock status** is to call the `isLocked` method.
```javascript
window.bodyScroll.isLocked(); // true when locked...
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

## Demo
Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demos/sample-page.html) to check if this is what you're looking for. 🤞
