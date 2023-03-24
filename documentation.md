## Classes

<dl>
<dt><a href="#ScrollPadlock">ScrollPadlock</a></dt>
<dd><p>Creates the scroll padlock class instance on body scroll or on a given scrollable element.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getLayoutDimensionsCssRules">getLayoutDimensionsCssRules(layout)</a> ⇒ <code>string</code></dt>
<dd><p>Gets the given layout dimensions object as css rules.</p>
</dd>
<dt><a href="#getLayoutDimensions">getLayoutDimensions(element, scroller)</a> ⇒ <code><a href="#LayoutDimensions">LayoutDimensions</a></code></dt>
<dd><p>Gets a given element or browser dimensions.</p>
</dd>
<dt><a href="#getScrollPositionCssRules">getScrollPositionCssRules(scroll)</a> ⇒ <code>string</code></dt>
<dd><p>Gets the given scroll position object as css rules.</p>
</dd>
<dt><a href="#getScrollPosition">getScrollPosition(element)</a> ⇒ <code><a href="#ScrollPosition">ScrollPosition</a></code></dt>
<dd><p>Gets a given element or browser scroll position.</p>
</dd>
<dt><a href="#setUniqueCssRule">setUniqueCssRule(styler, rule)</a> ⇒ <code>HTMLStyleElement</code></dt>
<dd><p>Updates a given element css variables to a given styler element
ensuring its presence in the given target element (usually head).</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ScrollPosition">ScrollPosition</a></dt>
<dd></dd>
<dt><a href="#LayoutDimensions">LayoutDimensions</a></dt>
<dd></dd>
</dl>

<a name="ScrollPadlock"></a>

## ScrollPadlock
Creates the scroll padlock class instance on body scroll or on a given scrollable element.

**Kind**: global class  
**Access**: public  

* [ScrollPadlock](#ScrollPadlock)
    * [new ScrollPadlock([scrollingElementArgument], [cssClassNameArgument], [clientArgument])](#new_ScrollPadlock_new)
    * [.scrollingElement](#ScrollPadlock+scrollingElement) : <code>HTMLElement</code>
    * [.scrollEventElement](#ScrollPadlock+scrollEventElement) : <code>HTMLElement</code> \| <code>Window</code>
    * [.scroll](#ScrollPadlock+scroll) ⇒ <code>Types.ScrollPosition</code>
    * [.scroll](#ScrollPadlock+scroll)
    * [.layout](#ScrollPadlock+layout) ⇒ <code>Types.Layout</code>
    * [.unlisten(type)](#ScrollPadlock+unlisten) ⇒ <code>boolean</code>
    * [.listen(type)](#ScrollPadlock+listen) ⇒ <code>boolean</code>
    * [.destroy()](#ScrollPadlock+destroy) ⇒ <code>void</code>
    * [.update()](#ScrollPadlock+update) ⇒ <code>void</code>

<a name="new_ScrollPadlock_new"></a>

### new ScrollPadlock([scrollingElementArgument], [cssClassNameArgument], [clientArgument])
**Throws**:

- <code>TypeError</code> Throws when the given constructor arguments are invalid.
- <code>Error</code> Throws when an instance is already attached to the given dom element.


| Param | Type | Description |
| --- | --- | --- |
| [scrollingElementArgument] | <code>HTMLElement</code> \| <code>object</code> | The given scrollable element whose scroll needs to be controlled or an options object. |
| [cssClassNameArgument] | <code>string</code> | The locked-state css class or an options object. |
| [clientArgument] | <code>Window</code> | The client environment object (window). |

**Example**  
```js
void new ScrollPadlock();

void new ScrollPadlock(
 document.scrollingElement,

 'locked-state-css-class'
);

void new ScrollPadlock({
 cssClassName: 'locked-state-css-class'
});

void new ScrollPadlock(
 document.querySelector('#custom-scrolling-element'),
);

void new ScrollPadlock({
 scrollingElement: document.querySelector('#custom-scrolling-element'),
});

void new ScrollPadlock(
 document.querySelector('#custom-scrolling-element'),

 'locked-state-css-class',

 window,
);

void new ScrollPadlock({
 client: window,
});

void new ScrollPadlock({
 scrollingElement: document.querySelector('#custom-scrolling-element'),

 scrollEventElement: window,

 cssClassName: 'locked-state-css-class',

 resizeHandlerWrapper: debounce,

 scrollHandlerWrapper: throttle,

 client: window,
});
```
<a name="ScrollPadlock+scrollingElement"></a>

### scrollPadlock.scrollingElement : <code>HTMLElement</code>
The html element that can perform the scrolling action.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Access**: public  
<a name="ScrollPadlock+scrollEventElement"></a>

### scrollPadlock.scrollEventElement : <code>HTMLElement</code> \| <code>Window</code>
The element that can perform and listen to scroll event.
Usually coincides with the scrolling element, but when the scrolling element
is document.documentElement or document.body, "scroller" is window.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Access**: public  
<a name="ScrollPadlock+scroll"></a>

### scrollPadlock.scroll ⇒ <code>Types.ScrollPosition</code>
Returns the current scroll position, if on a locked state it
returns the currently saved scroll position object.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>Types.ScrollPosition</code> - The current scroll position object or the
scroll position previously saved if on a locked state.  
**Access**: public  
**Example**  
```js
const padlock = new ScrollPadlock();

padlock.scroll // --> { top: 123, left: 345 }
```
<a name="ScrollPadlock+scroll"></a>

### scrollPadlock.scroll
Sets a new scroll position, if on a locked state it saves that
given scroll position for a future scroll restoration.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>Types.ScrollPosition</code> | The scroll position to be set or saved if on a locked state. |

**Example**  
```js
const padlock = new ScrollPadlock();

padlock.scroll = { top: 123, left: 345 }
```
<a name="ScrollPadlock+layout"></a>

### scrollPadlock.layout ⇒ <code>Types.Layout</code>
Gets the layout dimensions, such as widths, heights, scrollbars etc...

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>Types.Layout</code> - The layout object.  
**Access**: public  
**Example**  
```js
const padlock = new ScrollPadlock();

padlock.layout // --> { outerHeight: 123, outerWidth: 345, innerWidth: 123, ... }
```
<a name="ScrollPadlock+unlisten"></a>

### scrollPadlock.unlisten(type) ⇒ <code>boolean</code>
Detaches a supported listener.

**Kind**: instance method of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>boolean</code> - Whether the event attachment or detachment has been successful or not.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type (scroll, resize...). |

**Example**  
```js
const padlock = new ScrollPadlock();

padlock.unlisten('scroll'); // pauses scroll handler
padlock.unlisten('resize'); // pauses resize handler
```
<a name="ScrollPadlock+listen"></a>

### scrollPadlock.listen(type) ⇒ <code>boolean</code>
Attaches a supported listener.

**Kind**: instance method of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>boolean</code> - Whether the event attachment or detachment has been successful or not.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The event type (scroll, resize...). |

**Example**  
```js
const padlock = new ScrollPadlock();

padlock.listen('scroll'); // resumes scroll handler
padlock.listen('resize'); // resumes resize handler
```
<a name="ScrollPadlock+destroy"></a>

### scrollPadlock.destroy() ⇒ <code>void</code>
Effectively destroy the instance, detaching event listeners, removing styles, etc...

**Kind**: instance method of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>void</code> - Nothing.  
**Access**: public  
**Example**  
```js
const padlock = new ScrollPadlock();

padlock.destroy(); // completely removes the padlock listeners, dom modifications etc...
```
<a name="ScrollPadlock+update"></a>

### scrollPadlock.update() ⇒ <code>void</code>
Re-evaluates dimensions and such, updates css variables to the current state...

**Kind**: instance method of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>void</code> - Nothing.  
**Access**: public  
**Example**  
```js
const padlock = new ScrollPadlock();

padlock.update(); // programmaticaly updates the current padlock state in its environment
```
<a name="getLayoutDimensionsCssRules"></a>

## getLayoutDimensionsCssRules(layout) ⇒ <code>string</code>
Gets the given layout dimensions object as css rules.

**Kind**: global function  
**Returns**: <code>string</code> - The styling rule css string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| layout | [<code>LayoutDimensions</code>](#LayoutDimensions) | The layout dimensions objects to be set in css variables. |

**Example**  
```js
getLayoutDimensionsCssRules({ outerWidth: 10 }); // --> `
// --scroll-padlock-outer-width: 10px;
// --scroll-padlock-outer-height: 0px;
// --scroll-padlock-inner-width: 0px;
// --scroll-padlock-inner-height: 0px;
// --scroll-padlock-scroll-width: 0px;
// --scroll-padlock-scroll-height: 0px;
// --scroll-padlock-scrollbar-width: 0px;
// --scroll-padlock-scrollbar-height: 0px;`
```
<a name="getLayoutDimensions"></a>

## getLayoutDimensions(element, scroller) ⇒ [<code>LayoutDimensions</code>](#LayoutDimensions)
Gets a given element or browser dimensions.

**Kind**: global function  
**Returns**: [<code>LayoutDimensions</code>](#LayoutDimensions) - The given element dimensions as an object ({ top, left }).  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The given element whose dimensions need to be retrieved. |
| scroller | <code>Window</code> \| <code>HTMLElement</code> | The given scrollable used to retrieve some dimensions when the given element is global (page). |

**Example**  
```js
getLayoutDimensions(document.querySelector('div')) // --> { outerHeight: 123, ... }
```
<a name="getScrollPositionCssRules"></a>

## getScrollPositionCssRules(scroll) ⇒ <code>string</code>
Gets the given scroll position object as css rules.

**Kind**: global function  
**Returns**: <code>string</code> - The styling rule css string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| scroll | [<code>ScrollPosition</code>](#ScrollPosition) | The scroll position to be set in css variables. |

**Example**  
```js
getScrollPositionCssRules({ top: 10 }); // --> `
// --scroll-padlock-scroll-top: 10px;
// --scroll-padlock-scroll-left: 0px;`
```
<a name="getScrollPosition"></a>

## getScrollPosition(element) ⇒ [<code>ScrollPosition</code>](#ScrollPosition)
Gets a given element or browser scroll position.

**Kind**: global function  
**Returns**: [<code>ScrollPosition</code>](#ScrollPosition) - The given element scroll position
as an object ({ top, left }).  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Window</code> \| <code>HTMLElement</code> | The given element whose scroll position needs to be retrieved. |

**Example**  
```js
getScrollPosition(document.queryselector('div')); // --> { top: 123, left: 345 }
```
<a name="setUniqueCssRule"></a>

## setUniqueCssRule(styler, rule) ⇒ <code>HTMLStyleElement</code>
Updates a given element css variables to a given styler element
ensuring its presence in the given target element (usually head).

**Kind**: global function  
**Returns**: <code>HTMLStyleElement</code> - The given styler element.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| styler | <code>HTMLStyleElement</code> | The styler element where the css variables are written. |
| rule | <code>string</code> | The styling rule css string. |

**Example**  
```js
setUniqueCssRule(document.querySelector('style#my-styles'), '.el { color: blue; }');
```
<a name="ScrollPosition"></a>

## ScrollPosition
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| top | <code>number</code> | The current scroll position from parent's top. |
| left | <code>number</code> | The current scroll position from parent's left. |

<a name="LayoutDimensions"></a>

## LayoutDimensions
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| outerWidth | <code>number</code> | Element width including vertical scrollbar width. |
| outerHeight | <code>number</code> | Element height including horizontal scrollbar height. |
| innerWidth | <code>number</code> | Element width not including vertical scrollbar width. |
| innerHeight | <code>number</code> | Element height not including horizontal scrollbar height. |
| scrollWidth | <code>number</code> | Contents width. |
| scrollHeight | <code>number</code> | Contents height. |
| scrollbarWidth | <code>number</code> | Vertical scrollbar width. |
| scrollbarHeight | <code>number</code> | Horizontal scrollbar height. |

