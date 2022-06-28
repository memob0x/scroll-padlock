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
  STR_CAMEL_CSS_CLASS_NAME,
  STR_WORD_FUNCTION,
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
import isValidPadlockElement from './is-valid-padlock-element';
import sanitizePadlockOptions from './sanitize-padlock-options';

const STR_CAMEL_RESIZE_HANDLER_WRAPPER = 'resizeHandlerWrapper';
const STR_CAMEL_SCROLL_HANDLER_WRAPPER = 'scrollHandlerWrapper';

const noopHandlerWrapper = (a) => a;

// Instances collection,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

class ScrollPadlock {
  /**
   * Creates the scroll padlock class instance on a given scrollable element.
   *
   * @throws Throws when an instance is already attached to the given dom element.
   * @param {Window|HTMLElement} [element] - The given scrollable element
   * whose scroll needs to be controlled.
   * @param {string | object} [options] - An options object
   * or the given scrollable element whose scroll needs to be controlled.
   */
  constructor(element, options) {
    // checks whether the given element is assignable to padlock instance
    if (isValidPadlockElement(element)) {
      // then replace "element" and "scroller" private members with that element

      // Stores the given DOM element reference as main element
      this.#element = element;

      // Stores the given DOM element reference as scroller element
      this.#scroller = element;

      // Stores the given DOM element reference as scroller element,
      // the one provided to the class constructor
      this.#target = element;

      // Stores the given element class list reference
      this.#classList = this.#getClassList();

      // The element data attribute name
      this.#cssSelectorAttributeName = STR_KEBAB_DATA_SCROLL_PADLOCK;

      // The element data attribute value
      this.#cssSelectorAttributeValue = this.#getCssSelectorAttributeValue();

      // The element css selector
      this.#cssSelector = this.#getCssSelector();
    }

    // Sanitized the given class constructor options adding the defaults
    // values when no value is given or replacing the invalid ones
    const {
      [STR_CAMEL_CSS_CLASS_NAME]: cssClassName,

      [STR_CAMEL_RESIZE_HANDLER_WRAPPER]: resizeHandlerWrapper,

      [STR_CAMEL_SCROLL_HANDLER_WRAPPER]: scrollHandlerWrapper,
    } = sanitizePadlockOptions(options) || {};

    // Stores the class name as a private member
    if (cssClassName) {
      this.#cssClassName = cssClassName;
    }

    // if the given resize handler is a function...
    // eslint-disable-next-line valid-typeof
    if (typeof resizeHandlerWrapper === STR_WORD_FUNCTION) {
      // ...then stores it
      this.#resizeHandlerWrapper = resizeHandlerWrapper;
    }

    // if the given scroll handler is a function...
    // eslint-disable-next-line valid-typeof
    if (typeof scrollHandlerWrapper === STR_WORD_FUNCTION) {
      // ...then stores it
      this.#scrollHandlerWrapper = scrollHandlerWrapper;
    }

    // If an instance has already been initialized on this very element,
    // there could be conflicts in events handling etc,
    // throws an exception in this case
    if (instances.has(this.#element)) {
      throw new Error(`An instance has already been initialized on ${this.#element}`);
    }

    // Applies the css rules to the given element with the corresponding attribute selector
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
   * The element data attribute name.
   */
  #cssSelectorAttributeName = STR_KEBAB_DATA_SCROLL_PADLOCK;

  /**
   * The element data attribute value.
   */
  #cssSelectorAttributeValue = this.#getCssSelectorAttributeValue();

  /**
   * The element css selector.
   */
  #cssSelector = this.#getCssSelector();

  /**
   * Gets the currently set css selector.
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
   * Handles the element mutation observation.
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
  #resizeHandlerWrapper = noopHandlerWrapper;

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
  #scrollHandlerWrapper = noopHandlerWrapper;

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
   * Gets the given element class list reference.
   *
   * @returns {DOMTokenList} The given element class list reference.
   */
  #getClassList() {
    return this.#target.classList;
  }

  /**
   * Getsthe element data attribute value.
   *
   * @returns {string} The element data attribute value.
   */
  #getCssSelectorAttributeValue() {
    return getElementParentsLength(this.#target)
      + STR_CHAR_HYPHEN
      + getElementIndex(this.#target);
  }

  /**
   * Gets the element css selector.
   *
   * @returns {string} The element css selector.
   */
  #getCssSelector() {
    return `[${this.#cssSelectorAttributeName}="${this.#cssSelectorAttributeValue}"]`;
  }

  /**
   * Gets the scroll lock state.
   *
   * @returns {boolean} The scroll lock state.
   */
  #getState() {
    return !!this.#classList?.contains(this.#cssClassName);
  }

  /**
   * Gets the layout object.
   *
   * @returns {object} The layout object.
   */
  #getLayout() {
    return getLayoutDimensions(this.#element, this.#scroller);
  }

  /**
   * Gets the current scroll position.
   *
   * @returns {object} The current scroll position.
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
    // Updates the current scroll position.
    this.#scrollCurrent = this.#getScrollCurrent();

    // Returns the current scroll position.
    return this.#scrollCurrent;
  }

  /**
   * Applies the css rules.
   *
   * @returns {HTMLStyleElement} The styler element.
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
   * Ensures the styler element is in head.
   *
   * @returns {HTMLStyleElement} The styler element.
   */
  #ensureStylerPresenceInHead() {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (this.#styler && !head?.contains(this.#styler)) {
      head.appendChild(this.#styler);
    }

    return this.#styler;
  }

  /**
   * Removes the CSS variables, styler, styler selector...
   *
   * @returns {HTMLStyleElement} The styler element.
   */
  #removeStyler() {
    this.#styler?.remove();

    return this.#styler;
  }

  /**
   * Applies the css rules to the given element with the corresponding attribute selector.
   *
   * @param {string} method - The action to be performed, can be "remove" or "add".
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
    // Ensures the styler element is in head
    this.#ensureStylerPresenceInHead();

    // Applies the styler css rules and returns the styler element itself
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
