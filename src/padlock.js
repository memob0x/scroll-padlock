import {
  win,
  doc,
  documentElement,
  body,
  head,
} from './client';

import {
  STR_CHAR_HYPHEN,
  STR_WORD_ADD,
  STR_WORD_REMOVE,
  STR_WORD_RESIZE,
  STR_WORD_SCROLL,
  STR_WORD_SET,
} from './constants';

import {
  STR_WORD_LEFT,
  STR_WORD_TOP,
  STR_KEBAB_SCROLL_PADLOCK,
  STR_KEBAB_DATA_SCROLL_PADLOCK,
} from './constants-computed';

import getLayoutDimensions from './get-layout-dimensions';
import getScrollPosition from './get-scroll-position';
import setUniqueCssRule from './set-unique-css-rule';
import getElementParentsLength from './get-element-parents-length';
import getElementIndex from './get-element-index';
import getCssRuleFromSchema from './get-css-rule-from-schema';
import getLayoutDimensionsCssSchema from './get-layout-dimensions-css-schema';
import getScrollPositionCssSchema from './get-scroll-position-css-schema';

const STR_CAMEL_CSS_CLASS_NAME = 'cssClassName';
const STR_CAMEL_RESIZE_HANDLER_WRAPPER = 'resizeHandlerWrapper';
const STR_CAMEL_SCROLL_HANDLER_WRAPPER = 'scrollHandlerWrapper';

const INT_OPTIONS_TYPE_KEY_UNKNOWN = 0;
const INT_OPTIONS_TYPE_KEY_UNDEFINED = 1;
const INT_OPTIONS_TYPE_KEY_OBJECT = 3;
const INT_OPTIONS_TYPE_KEY_STRING = 4;

const isUndefined = (variable) => typeof variable === 'undefined';
const isObject = (variable) => typeof variable === 'object';
const isString = (variable) => typeof variable === 'string';
const isFunction = (variable) => typeof variable === 'function';
const noop = (a) => a;

const { isArray } = Array;

const getOptionsTypeKey = (options) => {
  if (isUndefined(options)) {
    return INT_OPTIONS_TYPE_KEY_UNDEFINED;
  }

  if (isString(options)) {
    return INT_OPTIONS_TYPE_KEY_STRING;
  }

  if (isArray(options)) {
    return INT_OPTIONS_TYPE_KEY_UNKNOWN;
  }

  if (isObject(options)) {
    return INT_OPTIONS_TYPE_KEY_OBJECT;
  }

  return INT_OPTIONS_TYPE_KEY_UNKNOWN;
};

const isElementAssignableToPadlockInstance = (element) => {
  //
  if (isUndefined(element)) {
    //
    return false;
  }

  // Window as element argument support
  const isElementTheWindow = element === win;

  // Scrollable html elements support
  const isElementAnHtmlElement = element instanceof HTMLElement;

  // If the given scrollable element is not supported (valid html element or page)
  // there's nothing to do, but throwing an exception
  if (!isElementTheWindow && !isElementAnHtmlElement) {
    throw new TypeError(`Invalid "element" argument (${element}) provided to ScrollPadlock constructor`);
  }

  // Global page (window, html or body as element argument)
  const isElementGlobalScroller = isElementTheWindow
    || element === documentElement
    || element === body;

  //
  return !isElementGlobalScroller;
};

const getOptionsParsed = (options) => {
  //
  const optionsTypeKey = getOptionsTypeKey(options);

  // No class name, nothing to do, but throwing an exception
  if (optionsTypeKey === INT_OPTIONS_TYPE_KEY_UNKNOWN) {
    throw new TypeError(`Invalid "options" argument (${options}) provided to ScrollPadlock constructor`);
  }

  //
  const optionsObject = !!options && optionsTypeKey === INT_OPTIONS_TYPE_KEY_OBJECT
    ? options
    : {};

  //
  const cssClassName = optionsTypeKey === INT_OPTIONS_TYPE_KEY_STRING
    ? options
    : optionsObject[STR_CAMEL_CSS_CLASS_NAME];

  //
  const isCssClassNameTruthyString = !!cssClassName && isString(cssClassName);

  // No class name, nothing to do, but throwing an exception
  if (
    // if is defined (because undefined is allowed)...
    !isUndefined(cssClassName)

    // ...and is an invalid argument
    && !isCssClassNameTruthyString
  ) {
    throw new TypeError('Invalid CSS class name provided to constructor');
  }

  //
  optionsObject[STR_CAMEL_CSS_CLASS_NAME] = cssClassName;

  //
  return optionsObject;
};

// Instances collection,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

class ScrollPadlock {
  /**
   * Creates the scroll padlock class instance on a given scrollable element.
   *
   * @throws TODO: doc.
   * @param {Window|HTMLElement} [element] - The given scrollable element
   * whose scroll needs to be controlled.
   * @param {string | object} [options] - An options object
   * or the given scrollable element whose scroll needs to be controlled.
   */
  constructor(element, options) {
    // then replace "element" and "scroller" private members with that element
    if (isElementAssignableToPadlockInstance(element)) {
      //
      this.#element = element;

      //
      this.#scroller = element;

      //
      this.#target = element;

      // Stores the given element class list reference
      this.#classList = this.#getClassList();

      //
      this.#cssSelectorAttributeName = STR_KEBAB_DATA_SCROLL_PADLOCK;

      //
      this.#cssSelectorAttributeValue = this.#getCssSelectorAttributeValue();

      //
      this.#cssSelector = this.#getCssSelector();
    }

    //
    const {
      [STR_CAMEL_CSS_CLASS_NAME]: cssClassName,

      [STR_CAMEL_RESIZE_HANDLER_WRAPPER]: resizeHandlerWrapper,

      [STR_CAMEL_SCROLL_HANDLER_WRAPPER]: scrollHandlerWrapper,
    } = getOptionsParsed(options) || {};

    // Stores the class name as a private member
    if (cssClassName) {
      this.#cssClassName = cssClassName;
    }

    //
    if (isFunction(resizeHandlerWrapper)) {
      this.#resizeHandlerWrapper = resizeHandlerWrapper;
    }

    //
    if (isFunction(scrollHandlerWrapper)) {
      this.#scrollHandlerWrapper = scrollHandlerWrapper;
    }

    // If an instance has already been initialized on this very element,
    // there could be conflicts in events handling etc,
    // throws an exception in this case
    if (instances.has(this.#element)) {
      throw new Error(`An instance has already been initialized on ${this.#element}`);
    }

    //
    this.#applyCssSelectorAttribute(STR_WORD_SET);

    // Instance is not registered ad this point,
    // so this one is added to the instances collection
    instances.set(this.#element, this);

    // Fires the public update method to initialize everything;
    // computes scroll position, scrollbars sizes and writes css variables
    this.update();

    // Observes the given element CSS class list for given CSS class name changes
    this.#observeCssClass();

    // Attaches resize event listener
    this.#listener(STR_WORD_RESIZE, STR_WORD_ADD);

    // Attaches scroll event listener
    this.#listener(STR_WORD_SCROLL, STR_WORD_ADD);
  }

  /**
   * The lock state element target, usually the scrollable element.
   */
  #element = documentElement;

  /**
   * The original given element (the one provided to the class constructor).
   */
  #target = body;

  /**
   * The actual scrollable element (the element that can perform and listen to scroll event)
   * Usually coincides with "element", but when "element"
   * is document.documentElement, "scroller" is window.
   */
  #scroller = window;

  /**
   * The styler, css variables holder.
   */
  #styler = doc.createElement('style');

  /**
   * The original given element CSS class list.
   */
  #classList = this.#getClassList();

  /**
   * The lock state CSS class name.
   */
  #cssClassName = `${STR_KEBAB_SCROLL_PADLOCK}-locked`;

  /**
   * The scroll lock state.
   */
  #state = this.#getState();

  /**
   * The current scroll position.
   */
  #scrollCurrent = this.#getScrollCurrent();

  /**
   * The scroll position saving, the scroll position stored for later use.
   */
  #scrollSaving = this.#scrollCurrent;

  /**
   *
   */
  #cssSelectorAttributeName = STR_KEBAB_DATA_SCROLL_PADLOCK;

  /**
   *
   */
  #cssSelectorAttributeValue = this.#getCssSelectorAttributeValue();

  /**
   *
   */
  #cssSelector = this.#getCssSelector();

  /**
   * TODO: write.
   *
   * @returns {string} The css selector.
   */
  get cssSelector() {
    return this.#cssSelector;
  }

  /**
   * Returns the current scroll position, if on a locked state it
   * returns the currently saved scroll position object.
   *
   * @returns {object} The current scroll position object or the
   * scroll position previously saved if on a locked state.
   */
  get scroll() {
    // If the state is locked, the saved scroll position is returned,
    // otherwise the current scroll position is returned
    return this.#state ? this.#scrollSaving : this.#scrollCurrent;
  }

  /**
   * Sets a new scroll position, if on a locked state it saves that
   * given scroll position for a future scroll restoration.
   *
   * @param {object} position - The scroll position to be set or saved if on a locked state.
   */
  set scroll(position) {
    // The scroll is locked...
    if (this.#state) {
      // ...the given scroll position is saved for later use...
      this.#scrollSaving = position;

      // ...then exits early
      return;
    }

    // The scroll is not locked, then a scrollTo native DOM api is triggered
    // (current scroll position will be retrieve through "scroll" event listener)
    this.#scrollTo(position);
  }

  /**
   * The layout dimensions.
   */
  #layout = this.#getLayout();

  /**
   * Gets the layout dimensions, such as widths, heights, scrollbars etc...
   *
   * @returns {object} The layout object.
   */
  get layout() {
    return this.#layout;
  }

  /**
   * The current css class observer state
   * True if observing, false if not.
   */
  #observerState = false;

  /**
   * TODO: write doc.
   *
   * @returns {void} Nothing.
   */
  #handleObservation() {
    // Caches the current scroll lock state before updating it
    const state = this.#state;

    // Updates lock state member
    this.#updateState();

    // No state change...
    if (this.#state === state) {
      // ...exits early
      return;
    }

    // State changed to true...
    if (this.#state) {
      // ...copies the current scroll position to another
      // private member (saves current scroll position)
      this.#scrollSaving = { ...this.#scrollCurrent };

      // ...and exits early
      return;
    }

    // State changed to false, restoring scroll position
    this.#scrollTo(this.#scrollSaving);
  }

  /**
   * State MutationObserver object,
   * registers the callback fired on CSS class change.
   */
  #observer = (
    (implementationName) => (
      implementationName in win ? new win[implementationName](
        this.#handleObservation.bind(this),
      ) : null
    )
  )('MutationObserver');

  /**
   *
   */
  #resizeHandlerWrapper = noop;

  /**
   *
   */
  #resizeHandler() {
    // Refresh layout
    this.#performUnlockedAction(this.#updateLayout);

    // Rewrites css variables
    this.#applyStyles();
  }

  /**
   * Window resize event handler.
   */
  #handleResize = this.#resizeHandlerWrapper(
    this.#resizeHandler.bind(this),
  );

  /**
   *
   */
  #scrollHandlerWrapper = noop;

  /**
   *
   */
  #scrollHandler() {
    // Refresh scrollbars size
    this.#performUnlockedAction(this.#updateScrollCurrent);

    // Rewrites css variables
    this.#applyStyles();
  }

  /**
   * Element scroll event handler.
   */
  #handleScroll = this.#scrollHandlerWrapper(
    this.#scrollHandler.bind(this),
  );

  /**
   * Event listeners states map,
   * contains the last method called by event name (as key).
   */
  #listenersState = {
    [STR_WORD_RESIZE]: STR_WORD_REMOVE,

    [STR_WORD_SCROLL]: STR_WORD_REMOVE,
  };

  /**
   * Event listeners handlers map,
   * contains the supported events handlers by event name (as key).
   */
  #listenersHandlers = {
    [STR_WORD_RESIZE]: this.#handleResize,

    [STR_WORD_SCROLL]: this.#handleScroll,
  };

  /**
   * Event listeners targets (elements) map,
   * contains the event targets elements by event name (as key).
   *
   * @returns {object} The listener targets.
   */
  get #listenersTargets() {
    return {
      [STR_WORD_RESIZE]: win,

      [STR_WORD_SCROLL]: this.#scroller,
    };
  }

  /**
   * TODO:.
   *
   * @returns {DOMTokenList} TODO:.
   */
  #getClassList() {
    return this.#target.classList;
  }

  /**
   * TODO:.
   *
   * @returns {string} TODO:.
   */
  #getCssSelectorAttributeValue() {
    return getElementParentsLength(this.#target)
      + STR_CHAR_HYPHEN
      + getElementIndex(this.#target);
  }

  /**
   * TODO:.
   *
   * @returns {string} TODO.
   */
  #getCssSelector() {
    return `[${this.#cssSelectorAttributeName}="${this.#cssSelectorAttributeValue}"]`;
  }

  /**
   * TODO:.
   *
   * @returns {boolean} TODO:.
   */
  #getState() {
    return !!this.#classList?.contains(this.#cssClassName);
  }

  /**
   * TODO: docs.
   *
   * @returns {object} TODO:.
   */
  #getLayout() {
    return getLayoutDimensions(this.#element, this.#scroller);
  }

  /**
   * TODO: docs.
   *
   * @returns {object} TODO:.
   */
  #getScrollCurrent() {
    return getScrollPosition(this.#scroller);
  }

  /**
   * Scrolls the given element to a given scroll position.
   *
   * @param {object} position - The scroll position to be set.
   * @returns {void} Nothing.
   */
  #scrollTo = (position) => this.#scroller.scrollTo(
    position[STR_WORD_LEFT],

    position[STR_WORD_TOP],
  );

  /**
   * Updates the scroll state.
   *
   * @returns {boolean} The scroll state.
   */
  #updateState() {
    //
    this.#state = this.#getState();

    //
    return this.#state;
  }

  /**
   * Fires a given function at a unlocked scroll state.
   *
   * @param {Function} action - The given function to be fired at unlocked scroll state.
   * @returns {any} Anything the given function returns is returned.
   */
  #performUnlockedAction(action) {
    // Caches the scroll lock state (true if css class is set, thus on a locked state)
    const wasLocked = this.#state;

    // Temporarily unobserves the CSS class change
    this.#unobserveCssClass();

    // Removes the css class temporarly
    this.#classList?.remove(this.#cssClassName);

    // Fires the given function and caches the return value
    const result = action.call(this);

    // Relocks the css class if was set before
    if (wasLocked) {
      this.#classList?.add(this.#cssClassName);
    }

    // Observes the given element CSS class list for given CSS class name changes
    this.#observeCssClass();

    // Returns what the given function returns
    return result;
  }

  /**
   * Updates the layout object.
   *
   * @returns {object} The layout object.
   */
  #updateLayout() {
    //
    this.#layout = this.#getLayout();

    //
    return this.#layout;
  }

  /**
   * Refresh the scroll position at a (temporarly) unlocked state.
   *
   * @returns {object} The current scroll position object.
   */
  #updateScrollCurrent() {
    //
    this.#scrollCurrent = this.#getScrollCurrent();

    //
    return this.#scrollCurrent;
  }

  /**
   * TODO:.
   *
   * @returns {HTMLStyleElement} TODO:.
   */
  #setStylerCssRule() {
    const schema = [
      ...getLayoutDimensionsCssSchema(this.layout),

      ...getScrollPositionCssSchema(this.scroll),
    ];

    const rule = getCssRuleFromSchema(this.#cssSelector, schema);

    return setUniqueCssRule(this.#styler, rule);
  }

  /**
   * TODO:.
   *
   * @returns {HTMLStyleElement} TODO:.
   */
  #ensureStylerPresenceInHead() {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (this.#styler && !head?.contains(this.#styler)) {
      head.appendChild(this.#styler);
    }

    return this.#styler;
  }

  /**
   * TODO:.
   *
   * @returns {HTMLStyleElement} TODO:.
   */
  #removeStyler() {
    this.#styler?.remove();

    return this.#styler;
  }

  /**
   * TODO: doc.
   *
   * @param {string} method - TODO:.
   */
  #applyCssSelectorAttribute(method) {
    this.#target?.[`${method}Attribute`](
      this.#cssSelectorAttributeName,

      this.#cssSelectorAttributeValue,
    );
  }

  /**
   * Rewrites the css variables with current data.
   *
   * @returns {HTMLStyleElement} Styler element.
   */
  #applyStyles() {
    //
    this.#ensureStylerPresenceInHead();

    //
    return this.#setStylerCssRule();
  }

  /**
   * Observes the element CSS class changes.
   *
   * @returns {boolean} The css class observer state.
   */
  #observeCssClass() {
    //
    if (this.#observerState) {
      //
      return this.#observerState;
    }

    //
    this.#observer?.observe(this.#target, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });

    //
    this.#observerState = !!this.#observer;

    //
    return this.#observerState;
  }

  /**
   * Unobserves the element CSS class changes.
   *
   * @returns {boolean} The css class observer state.
   */
  #unobserveCssClass() {
    //
    if (!this.#observerState) {
      //
      return this.#observerState;
    }

    //
    this.#observer?.disconnect();

    //
    this.#observerState = false;

    //
    return this.#observerState;
  }

  /**
   *
   */
  #refresh() {
    // Refresh layout
    this.#updateLayout();

    // Refresh scroll position
    this.#updateScrollCurrent();
  }

  /**
   * Attaches or detaches a supported listener.
   *
   * @param {string} type - The event type (scroll, resize...).
   * @param {string} method - The event method (add, remove).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  #listener(type, method) {
    // Gets the last method for the given event
    const state = this.#listenersState[type];

    // Exit early...
    if (
      // ...if the main element is not set (probably the instance has been destroyed)
      !this.#element

      // ...if a state for the given event doesn't exist
      // (supplied event type is not supported)
      || !state

      // ...if the former event method is the same as the current one
      // avoids multiple event handlers attachment
      || state === method
    ) {
      return false;
    }

    // Updates the state for the given event type
    this.#listenersState[type] = method;

    // Attaches or detaches the given event type
    this.#listenersTargets[type][`${method}EventListener`](
      type,

      this.#listenersHandlers[type],
    );

    // Ok
    return true;
  }

  /**
   * Detaches a supported listener.
   *
   * @param {string} type - The event type (scroll, resize...).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  unlisten(type) {
    return this.#listener(type, STR_WORD_REMOVE);
  }

  /**
   * Attaches a supported listener.
   *
   * @param {string} type - The event type (scroll, resize...).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  listen(type) {
    return this.#listener(type, STR_WORD_ADD);
  }

  /**
   * Effectively destroy the instance, detaching event listeners, removing styles, etc...
   *
   * @returns {void} Nothing.
   */
  destroy() {
    // Unobserves the CSS class change
    this.#unobserveCssClass();

    // Removes the CSS variables, styler, styler selector...
    this.#removeStyler();

    //
    this.#applyCssSelectorAttribute(STR_WORD_REMOVE);

    // Detaches the scroll event listener
    this.#listener(STR_WORD_RESIZE, STR_WORD_REMOVE);

    // Detaches the resize event listener
    this.#listener(STR_WORD_SCROLL, STR_WORD_REMOVE);

    // Removes the instance from the instances collection
    instances.delete(this.#element);

    // Removes references
    this.#element = null;

    this.#target = null;

    this.#scroller = null;

    this.#observer = null;

    this.#styler = null;

    this.#classList = null;
  }

  /**
   * Re-evaluates dimensions and such, updates css variables to the current state...
   *
   * @returns {void} Nothing.
   */
  update() {
    // Refresh the css class state
    this.#updateState();

    // Perform layout an scroll position refresh at unlocked state
    this.#performUnlockedAction(this.#refresh);

    // Rewrites css variables
    this.#applyStyles();
  }
}

// eslint-disable-next-line import/no-unused-modules
export default ScrollPadlock;
