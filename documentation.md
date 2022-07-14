## Classes

<dl>
<dt><a href="#ScrollPadlock">ScrollPadlock</a></dt>
<dd><p>Creates the scroll padlock class instance on a given scrollable element.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getCssRuleFromSchema">getCssRuleFromSchema(selector, schema)</a> ⇒ <code>string</code></dt>
<dd><p>Updates a given element css variables to a given styler element
ensuring its presence in the given target element (usually head).</p>
</dd>
<dt><a href="#getElementIndex">getElementIndex(element)</a> ⇒ <code>number</code></dt>
<dd><p>Gets a given element position (index) in the DOM tree
(where 0 is first-child, 1 is second etc...).</p>
</dd>
<dt><a href="#getElementParentsLength">getElementParentsLength(element)</a> ⇒ <code>number</code></dt>
<dd><p>Gets the number of ancestors of a given element.</p>
</dd>
<dt><a href="#getLayoutDimensionsCssSchema">getLayoutDimensionsCssSchema(layout)</a> ⇒ <code>Array</code></dt>
<dd><p>Gets the given layout dimensions object as css rules schema.</p>
</dd>
<dt><a href="#getLayoutDimensions">getLayoutDimensions(element, scroller)</a> ⇒ <code>object</code></dt>
<dd><p>Gets a given element or browser dimensions.</p>
</dd>
<dt><a href="#getScrollPositionCssSchema">getScrollPositionCssSchema(scroll)</a> ⇒ <code>Array</code></dt>
<dd><p>Gets the given scroll position object as css rules schema.</p>
</dd>
<dt><a href="#getScrollPosition">getScrollPosition(element)</a> ⇒ <code>object</code></dt>
<dd><p>Gets a given element or browser scroll position.</p>
</dd>
<dt><a href="#isValidPadlockElement">isValidPadlockElement(element, [window])</a> ⇒ <code>boolean</code></dt>
<dd><p>Gets whether the given (first) argument is a valid DOM scroll padlock element
(a div, etc...) or not.</p>
</dd>
<dt><a href="#sanitizePadlockOptions">sanitizePadlockOptions([options])</a> ⇒ <code>object</code></dt>
<dd><p>Formats the given scroll padlock options to a valid options object.</p>
</dd>
<dt><a href="#setUniqueCssRule">setUniqueCssRule(styler, rule)</a> ⇒ <code>HTMLStyleElement</code></dt>
<dd><p>Updates a given element css variables to a given styler element
ensuring its presence in the given target element (usually head).</p>
</dd>
</dl>

<a name="ScrollPadlock"></a>

## ScrollPadlock
Creates the scroll padlock class instance on a given scrollable element.

**Kind**: global class  
**Access**: public  

* [ScrollPadlock](#ScrollPadlock)
    * [new ScrollPadlock([element], [options], [client])](#new_ScrollPadlock_new)
    * [.cssSelector](#ScrollPadlock+cssSelector) ⇒ <code>string</code>
    * [.scroll](#ScrollPadlock+scroll) ⇒ <code>object</code>
    * [.scroll](#ScrollPadlock+scroll)
    * [.layout](#ScrollPadlock+layout) ⇒ <code>object</code>
    * [.unlisten(type)](#ScrollPadlock+unlisten) ⇒ <code>boolean</code>
    * [.listen(type)](#ScrollPadlock+listen) ⇒ <code>boolean</code>
    * [.destroy()](#ScrollPadlock+destroy) ⇒ <code>void</code>
    * [.update()](#ScrollPadlock+update) ⇒ <code>void</code>

<a name="new_ScrollPadlock_new"></a>

### new ScrollPadlock([element], [options], [client])
**Throws**:

- <code>TypeError</code> Throws when the given (first) argument is not
a valid DOM scroll padlock element (a div, etc...)
nor a global element (window, body, document).
- <code>Error</code> Throws when an instance is already attached to the given dom element.


| Param | Type | Description |
| --- | --- | --- |
| [element] | <code>Window</code> \| <code>HTMLElement</code> | The given scrollable element whose scroll needs to be controlled. |
| [options] | <code>string</code> \| <code>object</code> | An options object or the given scrollable element whose scroll needs to be controlled. |
| [client] | <code>object</code> | An object with the client environment (window). |

**Example**  
```js
void new ScrollPadlock(window, 'locked-state-css-class');
```
<a name="ScrollPadlock+cssSelector"></a>

### scrollPadlock.cssSelector ⇒ <code>string</code>
Gets the currently set css selector.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>string</code> - The css selector.  
**Access**: public  
**Example**  
```js
const padlock = new ScrollPadlock();

padlock.cssSelector // --> "[data-scroll-padlock="1-1"]"
```
<a name="ScrollPadlock+scroll"></a>

### scrollPadlock.scroll ⇒ <code>object</code>
Returns the current scroll position, if on a locked state it
returns the currently saved scroll position object.

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>object</code> - The current scroll position object or the
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
| position | <code>object</code> | The scroll position to be set or saved if on a locked state. |

**Example**  
```js
const padlock = new ScrollPadlock();

padlock.scroll = { top: 123, left: 345 }
```
<a name="ScrollPadlock+layout"></a>

### scrollPadlock.layout ⇒ <code>object</code>
Gets the layout dimensions, such as widths, heights, scrollbars etc...

**Kind**: instance property of [<code>ScrollPadlock</code>](#ScrollPadlock)  
**Returns**: <code>object</code> - The layout object.  
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
<a name="getCssRuleFromSchema"></a>

## getCssRuleFromSchema(selector, schema) ⇒ <code>string</code>
Updates a given element css variables to a given styler element
ensuring its presence in the given target element (usually head).

**Kind**: global function  
**Returns**: <code>string</code> - The styling rule css string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | The styling rules css selector. |
| schema | <code>Array</code> | The css rules js schema. |

**Example**  
```js
getCssRuleFromSchema([['top', 1], ['right', 2]]); // --> { 'top': '1px', 'right': '2px' }
```
<a name="getElementIndex"></a>

## getElementIndex(element) ⇒ <code>number</code>
Gets a given element position (index) in the DOM tree
(where 0 is first-child, 1 is second etc...).

**Kind**: global function  
**Returns**: <code>number</code> - The position of the given element in the DOM tree.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The given element to be checked. |

**Example**  
```js
getElementIndex(document.documentElement); // --> 0
getElementIndex(document.head); // --> 0
getElementIndex(document.body); // --> 1
```
<a name="getElementParentsLength"></a>

## getElementParentsLength(element) ⇒ <code>number</code>
Gets the number of ancestors of a given element.

**Kind**: global function  
**Returns**: <code>number</code> - The number of ancestors of the given element.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The given element to be checked. |

**Example**  
```js
getElementParentsLength(document.documentElement); // --> 0
getElementParentsLength(document.head); // --> 1
getElementParentsLength(document.body); // --> 1
```
<a name="getLayoutDimensionsCssSchema"></a>

## getLayoutDimensionsCssSchema(layout) ⇒ <code>Array</code>
Gets the given layout dimensions object as css rules schema.

**Kind**: global function  
**Returns**: <code>Array</code> - The styling rule css schema.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| layout | <code>object</code> | The layout dimensions objects to be set in css variables. |

**Example**  
```js
getLayoutDimensionsCssSchema({ width: 10, height: 20 }); // --> [
//  ['--outer-width', 10],
//  ['--outer-height', 20]
// ]).
```
<a name="getLayoutDimensions"></a>

## getLayoutDimensions(element, scroller) ⇒ <code>object</code>
Gets a given element or browser dimensions.

**Kind**: global function  
**Returns**: <code>object</code> - The given element dimensions as an object ({ top, left }).  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLElement</code> | The given element whose dimensions need to be retrieved. |
| scroller | <code>Window</code> \| <code>HTMLElement</code> | The given scrollable used to retrieve some dimensions when the given element is global (page). |

**Example**  
```js
getLayoutDimensions(document.querySelector('div')) // --> { outerHeight: 123, ... }
```
<a name="getScrollPositionCssSchema"></a>

## getScrollPositionCssSchema(scroll) ⇒ <code>Array</code>
Gets the given scroll position object as css rules schema.

**Kind**: global function  
**Returns**: <code>Array</code> - The styling rule css string.  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| scroll | <code>object</code> | The scroll position to be set in css variables. |

**Example**  
```js
getScrollPositionCssSchema({ top: 10, left: 20 }); // --> [
//  ['--position-top', 10],
//  ['--position-left', 20]
// ]).
```
<a name="getScrollPosition"></a>

## getScrollPosition(element) ⇒ <code>object</code>
Gets a given element or browser scroll position.

**Kind**: global function  
**Returns**: <code>object</code> - The given element scroll position as an object ({ top, left }).  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Window</code> \| <code>HTMLElement</code> | The given element whose scroll position needs to be retrieved. |

**Example**  
```js
getScrollPosition(document.queryselector('div')); // --> { top: 123, left: 345 }
```
<a name="isValidPadlockElement"></a>

## isValidPadlockElement(element, [window]) ⇒ <code>boolean</code>
Gets whether the given (first) argument is a valid DOM scroll padlock element
(a div, etc...) or not.

**Kind**: global function  
**Returns**: <code>boolean</code> - Whether the given (first) argument is a valid
custom scroll padlock element or not.  
**Throws**:

- <code>TypeError</code> Throws when the given (first) argument is not
a valid DOM scroll padlock element (a div, etc...)
nor a global element (window, body, document).

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Window</code> \| <code>Document</code> \| <code>HTMLElement</code> | The given argument to be checked for its validity as custom scroll padlock element. |
| [window] | <code>Window</code> | The environment client global object. |

**Example**  
```js
isValidPadlockElement(); // --> throws, not an HTMLElement...
isValidPadlockElement(null); // --> throws, not an HTMLElement...
isValidPadlockElement({}); // --> throws, not an HTMLElement...
isValidPadlockElement(window); // --> false
isValidPadlockElement(document); // --> false
isValidPadlockElement(document.body); // --> false
isValidPadlockElement(document.documentElement); // --> false
isValidPadlockElement(document.querySelector('div#my-scrollable-div')); // --> true
```
<a name="sanitizePadlockOptions"></a>

## sanitizePadlockOptions([options]) ⇒ <code>object</code>
Formats the given scroll padlock options to a valid options object.

**Kind**: global function  
**Returns**: <code>object</code> - The options object formatted.  
**Throws**:

- <code>TypeError</code> Throws when a given argument is not a valid padlock options type.

**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> \| <code>string</code> | The options raw argument to be formatted into object. |

**Example**  
```js
sanitizePadlockOptions('foobar'); // --> { cssClassName: 'foobar' }
sanitizePadlockOptions({ b: 'c' }); // --> { cssClassName: undefined, b: 'c' }
sanitizePadlockOptions({ cssClassName: 'a', b: 'c' }); // --> { cssClassName: 'a', b: 'c' }
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
