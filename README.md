# Body Scroll Lock

An **iOS safari compatible** technique to **lock body scroll**, with **scrollbars gap** compensation.

## The Backstory

The proper way to lock body scroll would be putting `overflow: hidden;` **on body and html elements**, but unfortunately this standard approach just doesn't work on iOS safari.<br>
The cleanest way to overcome this situation would be preventing `touchmove` events, but you might still have issues with some `viewport` metatag configurations along with pinch to zoom taking place and other scroll inertia related artifacts.<br>
So, if you do use the most common configuration (`<meta name="viewport" content="width=device-width, initial-scale=1">`) you should not have any problems using [that approach](https://github.com/willmcpo/body-scroll-lock), otherwhise you would probably need this **hack**.

## Usage
The inclusion of **body-scroll.js** would set a global **bodyScroll** variable, which is basically an `Object` with some `methods` in it.

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
`bodyScroll.lock()` internally takes care of the infamous unpleasant flickering effect you get when you put `overflow: hidden;` on html or body elements, making the scrollbar disappear, and the body widen, but you may still have it on some **right-aligned _fixed_ elements** in your page.<br>
Registering those elements **selectors** with the `registerScrollbarGapSelectors` method will fix that, adding a `margin-right` when the `lock` function is called.
```javascript
window.bodyScroll.registerScrollbarGapSelectors([
    '.lightbox',
    '#header.sticky'
]);
```
You prefer the `padding-right` property? No problem.
```javascript
window.bodyScroll.registerScrollbarGapSelectors([
    '.lightbox',
    '#header.sticky',
    {
        selector: '.full-width-fixed-el',
        property: 'padding-right'
    }
]);
```

## Demo
Have a look at this [demo](https://memob0x.github.io/body-scroll-lock/demos/sample-page.html) to check if this is what you're looking for. 🤞
