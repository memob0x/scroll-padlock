import './typedef.js';

import getLayoutDimensions from './get-layout-dimensions.js';
import getScrollPosition from './get-scroll-position.js';
import setUniqueCssRule from './set-unique-css-rule.js';
import getLayoutDimensionsCssRules from './get-layout-dimensions-css-rules.js';
import getScrollPositionCssRules from './get-scroll-position-css-rules.js';

// The element data attribute name
const CSS_SELECTOR_ATTR_NAME = 'data-scroll-padlock';

// Handlers no-op function, default value
const defaultHandlerWrapper = (a) => a;

// Padlock instances global id reference
let instanceId = -1;

// Padlock instances gobal collection,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

/**
 * Creates the scroll padlock class instance on body scroll or on a given scrollable element.
 * @example
 * void new ScrollPadlock();
 *
 * void new ScrollPadlock(
 *  document.scrollingElement,
 *
 *  'locked-state-css-class'
 * );
 *
 * void new ScrollPadlock({
 *  cssClassName: 'locked-state-css-class'
 * });
 *
 * void new ScrollPadlock(
 *  document.querySelector('#custom-scrolling-element'),
 * );
 *
 * void new ScrollPadlock({
 *  scrollingElement: document.querySelector('#custom-scrolling-element'),
 * });
 *
 * void new ScrollPadlock(
 *  document.querySelector('#custom-scrolling-element'),
 *
 *  'locked-state-css-class',
 *
 *  window,
 * );
 *
 * void new ScrollPadlock({
 *  client: window,
 * });
 *
 * void new ScrollPadlock({
 *  scrollingElement: document.querySelector('#custom-scrolling-element'),
 *
 *  scrollEventElement: window,
 *
 *  cssClassName: 'locked-state-css-class',
 *
 *  resizeHandlerWrapper: debounce,
 *
 *  scrollHandlerWrapper: throttle,
 *
 *  client: window,
 * });
 */
class ScrollPadlock {
  /**
   * @public
   * @throws {TypeError} Throws when the given constructor arguments are invalid.
   * @throws {Error} Throws when an instance is already attached to the given dom element.
   * @param {HTMLElement | object} [scrollingElementArgument] - The given scrollable element
   * whose scroll needs to be controlled or an options object.
   * @param {string} [cssClassNameArgument] - The locked-state css class or an options object.
   * @param {Window} [clientArgument] - The client environment object (window).
   */
  constructor(scrollingElementArgument, cssClassNameArgument, clientArgument = globalThis) {
    // The Padlock first argument type
    const scrollingElementArgumentTypeString = typeof scrollingElementArgument;

    // Whether the scrolling element constructor argument is an object or not
    const isScrollingElementArgumentObject = scrollingElementArgumentTypeString === 'object';

    // Whether the scrolling element constructor argument is an object, but not an array
    const isScrollingElementArgumentObjectButNotArray = (
      isScrollingElementArgumentObject && !Array.isArray(scrollingElementArgument)
    );

    const {
      client: clientOptionObject,
    } = isScrollingElementArgumentObjectButNotArray ? scrollingElementArgument : {};

    const possiblyClient = clientOptionObject || clientArgument;

    // The html element type from the client argument
    const { HTMLElement } = possiblyClient;

    // Whether the scrolling element constructor argument is an html element or not
    const isScrollingElementArgumentHtmlElement = (
      scrollingElementArgument instanceof HTMLElement
    );

    // Whether the scrolling element constructor argument is an object of options
    const isScrollingElementArgumentOptionsObject = (
      isScrollingElementArgumentObjectButNotArray && !isScrollingElementArgumentHtmlElement
    );

    // Seamless object of options reference
    // (if the first argument is an object of options) or declaration
    const options = isScrollingElementArgumentOptionsObject ? scrollingElementArgument : {
      scrollingElement: scrollingElementArgument,

      cssClassName: cssClassNameArgument,

      client: possiblyClient,
    };

    // Object of options deconstruction
    const {
      scrollingElement: optionScrollingElement,

      scrollEventElement: optionScrollEventElement,

      cssClassName: optionCssClassName,

      resizeHandlerWrapper: optionResizeHandlerWrapper,

      scrollHandlerWrapper: optionScrollHandlerWrapper,

      client: optionClient,
    } = options;

    // The client "window" object reference
    this.#window = optionClient || clientArgument;

    // The client "window" object deconstruction
    const {
      document,

      MutationObserver,
    } = this.#window;

    // The client "document" object deconstruction
    this.#document = document;

    //
    const isScrollingElementArgumentObjectOrNotSet = (
      isScrollingElementArgumentObject || scrollingElementArgumentTypeString === 'undefined'
    );

    // Constructor scrolling element argument type check validity check...
    if (
      // (is set, but not an object)
      !isScrollingElementArgumentObjectOrNotSet
      || scrollingElementArgument === this.#window
      || scrollingElementArgument === this.#document
    ) {
      // ...throws error if invalid
      throw new TypeError('The Padlock constructor "scrolling element" argument is invalid.');
    }

    // The client "document" object deconstruction
    const {
      body,

      documentElement,

      scrollingElement: documentScrollingElement,
    } = this.#document;

    // The browser default scrolling element
    const defaultScrollingElement = documentScrollingElement || documentElement;

    // The Padlock instance scrolling element
    this.#scrollingElement = typeof optionScrollingElement !== 'undefined' ? optionScrollingElement : defaultScrollingElement;

    // Whether the scrolling element Padlock instance member is an html element or not
    const isScrollingElementHtmlElement = this.#scrollingElement instanceof HTMLElement;

    // Padlock instance scrolling element validity check...
    if (!isScrollingElementHtmlElement) {
      // ...throws error if invalid
      throw new TypeError('The Padlock instance scrolling element is invalid.');
    }

    // Stores the given element class list reference
    this.#scrollingElementClassList = this.#scrollingElement?.classList;

    // The default element which trigger "scroll" event
    let defaultScrollEventElement = optionScrollingElement || this.#window;

    // The default element which trigger "scroll" event, based on "scrolling element" option
    defaultScrollEventElement = (
      optionScrollingElement === body || optionScrollingElement === documentElement
        ? this.#window
        : defaultScrollEventElement
    );

    // Padlock instance element which trigger "scroll" event member reference
    this.#scrollEventElement = typeof optionScrollEventElement !== 'undefined' ? optionScrollEventElement : defaultScrollEventElement;

    // Whether the scrolling element Padlock instance member is an html element or not
    const isScrollEventHtmlElement = this.#scrollEventElement instanceof HTMLElement;

    // Padlock instance scroll event element validity check...
    if (!isScrollEventHtmlElement && this.#scrollEventElement !== this.#window) {
      // ...throws error if invalid
      throw new TypeError('The Padlock instance scroll event element is invalid.');
    }

    // Stores the element used as unique identifier (key) in the map of instances.
    this.#elementUniqueInstance = this.#scrollEventElement;

    // If an instance has already been initialized on this very element,
    // there could be conflicts in events handling etc...
    if (instances.has(this.#elementUniqueInstance)) {
      // ...throws an exception in this case
      throw new Error(`An instance has already been initialized on ${this.#elementUniqueInstance}`);
    }

    // The Padlock css class option type
    const optionCssClassNameTypeString = typeof optionCssClassName;

    // Whether the Padlock css class option is set, but it's not of type "string"
    const isOptionsCssClassNameSetButNotString = (
      optionCssClassNameTypeString !== 'undefined' && optionCssClassNameTypeString !== 'string'
    );

    // The css class to be observed validity check...
    if (isOptionsCssClassNameSetButNotString || optionCssClassName === '') {
      // ...throws error if invalid
      throw new TypeError('The Padlock CSS class to be observed is invalid.');
    }

    // Stores the css class name to be observer or a default value
    this.#cssClassName = optionCssClassName || 'scroll-padlock-locked';

    // Stores a resize event handler function wrapper
    this.#resizeHandlerWrapper = optionResizeHandlerWrapper || defaultHandlerWrapper;

    // Stores a scroll event handler function wrapper
    this.#scrollHandlerWrapper = optionScrollHandlerWrapper || defaultHandlerWrapper;

    // Handles the Padlock DOM observation through MutationObserver API
    this.#observer = new MutationObserver(this.#handleObservation.bind(this));

    // The Padlock instance unique styler, a <style /> element
    this.#styler = this.#document.createElement('style');

    // Increments the global id reference in order to set a unique one to the current instance
    instanceId += 1;

    // The element data attribute value
    this.#id = instanceId;

    // The element css selector
    this.#cssSelector = `[${CSS_SELECTOR_ATTR_NAME}="${this.#id}"]`;

    // Applies the attribute selector to the scrolling element
    this.#applyCssSelectorAttribute('set');

    // Fires the public update method to initialize everything;
    // computes scroll position, scrollbars sizes and writes css variables
    this.update();

    // Observes the given element CSS class list for given CSS class name changes
    this.#observeCssClass();

    // Attaches resize event listener
    this.#listener('resize', 'add');

    // Attaches scroll event listener
    this.#listener('scroll', 'add');

    // The instance is not registered ad this point,
    // so, since nothing threw errors so far,
    // this instance is added to the global instances collection
    instances.set(this.#elementUniqueInstance, this);
  }

  // #region properties

  /**
   * The Padlock instance unique identifier.
   * @private
   * @memberof ScrollPadlock
   */
  #id = 0;

  /**
   * A reference to the client "window" object.
   * @private
   * @type {Window}
   * @memberof ScrollPadlock
   */
  #window = null;

  /**
   * A reference to the client "document" object.
   * @type {Document}
   * @private
   * @memberof ScrollPadlock
   */
  #document = null;

  /**
   * The html element that can perform the scrolling action.
   * @type {HTMLElement}
   * @private
   * @memberof ScrollPadlock
   */
  #scrollingElement = null;

  /**
   * The html element that can perform the scrolling action.
   * @type {HTMLElement}
   * @public
   * @memberof ScrollPadlock
   */
  get scrollingElement() {
    return this.#scrollingElement;
  }

  /**
   * The element that can perform and listen to scroll event.
   * Usually coincides with the scrolling element, but when the scrolling element
   * is document.documentElement or document.body, "scroller" is window.
   * @type {HTMLElement|Window}
   * @private
   * @memberof ScrollPadlock
   */
  #scrollEventElement = null;

  /**
   * The element that can listen to scroll event.
   * Usually coincides with the scrolling element, but when the scrolling element
   * is document.documentElement or document.body, "scroller" is window.
   * @type {HTMLElement|Window}
   * @public
   * @memberof ScrollPadlock
   */
  get scrollEventElement() {
    return this.#scrollEventElement;
  }

  /**
   * The element used as unique identifier (key) in the map of instances.
   * @type {HTMLElement|Window}
   * @private
   * @memberof ScrollPadlock
   */
  #elementUniqueInstance = null;

  /**
   * The styler, css variables holder.
   * @type {HTMLStyleElement}
   * @private
   * @memberof ScrollPadlock
   */
  #styler = null;

  /**
   * The original given element CSS class list.
   * @type {DOMTokenList}
   * @private
   * @memberof ScrollPadlock
   */
  #scrollingElementClassList = null;

  /**
   * The current scroll position.
   * @type {Types.ScrollPosition}
   * @private
   * @memberof ScrollPadlock
   */
  #scrollCurrent = null;

  /**
   * The scroll position saving, the scroll position stored for later use.
   * @type {Types.ScrollPosition}
   * @private
   * @memberof ScrollPadlock
   */
  #scrollSaving = null;

  /**
   * State MutationObserver object,
   * registers the callback fired on CSS class change.
   * @type {MutationObserver}
   * @private
   * @memberof ScrollPadlock
   */
  #observer = null;

  /**
   * Event listeners states map,
   * contains the last method called by event name (as key).
   * @private
   * @memberof ScrollPadlock
   */
  #listenersState = {
    resize: 'remove',

    scroll: 'remove',
  };

  /**
   * The layout dimensions.
   * @private
   * @memberof ScrollPadlock
   */
  #layout = null;

  /**
   * The scroll lock state.
   * @private
   * @memberof ScrollPadlock
   */
  #lockState = false;

  /**
   * The current css class observer state
   * True if observing, false if not.
   * @private
   * @memberof ScrollPadlock
   */
  #observerState = false;

  /**
   * The element css selector.
   * @private
   * @memberof ScrollPadlock
   */
  #cssSelector = '';

  /**
   * The lock state CSS class name.
   * @private
   * @memberof ScrollPadlock
   */
  #cssClassName = '';

  /**
   * The lock state CSS class name.
   * @type {string}
   * @public
   * @memberof ScrollPadlock
   */
  get cssClassName() {
    return this.#cssClassName;
  }

  // #endregion

  // #region accessors

  /**
   * Returns the current scroll position, if on a locked state it
   * returns the currently saved scroll position object.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll // --> { top: 123, left: 345 }
   * @returns {Types.ScrollPosition} The current scroll position object or the
   * scroll position previously saved if on a locked state.
   */
  get scroll() {
    // If the state is locked, the saved scroll position is returned,
    // otherwise the current scroll position is returned
    return this.#lockState ? this.#scrollSaving : this.#scrollCurrent;
  }

  /**
   * Sets a new scroll position, if on a locked state it saves that
   * given scroll position for a future scroll restoration.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll = { top: 123, left: 345 }
   * @param {Types.ScrollPosition} position - The scroll position to be set
   * or saved if on a locked state.
   */
  set scroll(position) {
    // The scroll is locked...
    if (this.#lockState) {
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
   * Gets the layout dimensions, such as widths, heights, scrollbars etc...
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.layout // --> { outerHeight: 123, outerWidth: 345, innerWidth: 123, ... }
   * @returns {Types.Layout} The layout object.
   */
  get layout() {
    return this.#layout;
  }

  // #endregion

  // #region methods

  /**
   * Handles the element mutation observation.
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #handleObservation() {
    // Caches the current scroll lock state before updating it
    const state = this.#lockState;

    // Updates lock state member
    this.#updateLockState();

    // No state change...
    if (this.#lockState === state) {
      // ...exits early
      return;
    }

    // State changed to true...
    if (this.#lockState) {
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
   * The resize event handler function wrapper.
   * @private
   * @memberof ScrollPadlock
   * @returns {any} Anything the given function returns is returned.
   */
  #resizeHandlerWrapper = defaultHandlerWrapper;

  /**
   * Window resize event handler.
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #resizeHandler() {
    // Refresh layout
    this.#performUnlockedAction(this.#updateLayout);

    // Rewrites css variables
    this.#applyStyles();
  }

  /**
   * Window resize event handler, bound with the wrapper function.
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #handleResize = this.#resizeHandlerWrapper(
    this.#resizeHandler.bind(this),
  );

  /**
   * The scroll event handler function wrapper.
   * @private
   * @memberof ScrollPadlock
   * @returns {any} Anything the given function returns is returned.
   */
  #scrollHandlerWrapper = defaultHandlerWrapper;

  /**
   * Element scroll event handler.
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #scrollHandler() {
    // Refresh scrollbars size
    this.#performUnlockedAction(this.#updateScrollCurrent);

    // Rewrites css variables
    this.#applyStyles();
  }

  /**
   * Element scroll event handler, bound with the wrapper function.
   * @private
   * @memberof ScrollPadlock
   * @returns {any} Anything the given function returns is returned.
   */
  #handleScroll = this.#scrollHandlerWrapper(
    this.#scrollHandler.bind(this),
  );

  /**
   * Event listeners handlers map,
   * contains the supported events handlers by event name (as key).
   * @private
   * @memberof ScrollPadlock
   */
  #listenersHandlers = {
    resize: this.#handleResize,

    scroll: this.#handleScroll,
  };

  /**
   * Scrolls the given element to a given scroll position.
   * @private
   * @memberof ScrollPadlock
   * @param {Types.ScrollPosition} position - The scroll position to be set.
   * @returns {void} Nothing.
   */
  #scrollTo = (position) => this.#scrollEventElement?.scrollTo(
    position.left,

    position.top,
  );

  /**
   * Updates the scroll state.
   * @private
   * @memberof ScrollPadlock
   * @returns {boolean} The scroll state.
   */
  #updateLockState() {
    // Updates the instance scroll state...
    this.#lockState = !!this.#scrollingElementClassList?.contains(this.#cssClassName);

    // ...then returns it.
    return this.#lockState;
  }

  /**
   * Fires a given function at a unlocked scroll state.
   * @private
   * @memberof ScrollPadlock
   * @param {Function} action - The given function to be fired at unlocked scroll state.
   * @returns {any} Anything the given function returns is returned.
   */
  #performUnlockedAction(action) {
    // Caches the scroll lock state (true if css class is set, thus on a locked state)
    const wasLocked = this.#lockState;

    // Temporarily unobserves the CSS class change
    this.#unobserveCssClass();

    // Removes the css class temporarly
    this.#scrollingElementClassList?.remove(this.#cssClassName);

    // Fires the given function and caches the return value
    const result = action.call(this);

    // Relocks the css class if was set before
    if (wasLocked) {
      this.#scrollingElementClassList?.add(this.#cssClassName);
    }

    // Observes the given element CSS class list for given CSS class name changes
    this.#observeCssClass();

    // Returns what the given function returns
    return result;
  }

  /**
   * Updates the layout object.
   * @private
   * @memberof ScrollPadlock
   * @returns {Types.ScrollPosition} The layout object.
   */
  #updateLayout() {
    // If the elements involved are set (if not the instance has been probably destroyed)
    if (this.#scrollingElement && this.#scrollEventElement) {
    // Updates the instance layout state...
      this.#layout = getLayoutDimensions(this.#scrollingElement, this.#scrollEventElement);
    }

    // ...then returns it.
    return this.#layout;
  }

  /**
   * Refresh the scroll position at a (temporarly) unlocked state.
   * @private
   * @memberof ScrollPadlock
   * @returns {Types.ScrollPosition} The current scroll position object.
   */
  #updateScrollCurrent() {
    // If the involved element is set (if not the instance has been probably destroyed)
    if (this.#scrollEventElement) {
      // Updates the current scroll position.
      this.#scrollCurrent = getScrollPosition(this.#scrollEventElement);
    }

    // Returns the current scroll position.
    return this.#scrollCurrent;
  }

  /**
   * Sets or removes the attribute selector to/from the scrolling element.
   * @private
   * @memberof ScrollPadlock
   * @param {string} method - The action to be performed, can be "remove" or "add".
   * @returns {void} Nothing.
   */
  #applyCssSelectorAttribute(method) {
    this.#scrollingElement?.[`${method}Attribute`](
      CSS_SELECTOR_ATTR_NAME,

      this.#id,
    );
  }

  /**
   * Rewrites the css variables with current data.
   * @private
   * @memberof ScrollPadlock
   * @returns {HTMLStyleElement} Styler element.
   */
  #applyStyles() {
    // Ensures style tag dom presence, StyleSheet API throws otherwise,
    // if instance styler element is set, but is not inside the <head /> element...
    if (this.#styler && !this.#document?.head?.contains(this.#styler)) {
      // ...then it is inserted.
      this.#document?.head.appendChild(this.#styler);
    }

    // Inserts the CSS string rule into the instance styler, then returns it
    return setUniqueCssRule(
      this.#styler,

      `${this.#cssSelector} { ${
        getLayoutDimensionsCssRules(this.layout)
      } ${
        getScrollPositionCssRules(this.scroll)
      } }`,
    );
  }

  /**
   * Observes the element CSS class changes.
   * @private
   * @memberof ScrollPadlock
   * @returns {boolean} The css class observer state.
   */
  #observeCssClass() {
    // if instance observer is already observing...
    if (this.#observerState) {
      // ...then exits early, nothing to do, returns the observer state.
      return this.#observerState;
    }

    // Attaches the observer, starts observing.
    this.#observer?.observe(this.#scrollingElement, {
      attributes: true,
      attributeFilter: ['class'],
      childList: false,
      characterData: false,
    });

    // Updates (toggles) the instance observer state.
    this.#observerState = !!this.#observer;

    // Returns the instance observer state.
    return this.#observerState;
  }

  /**
   * Unobserves the element CSS class changes.
   * @private
   * @memberof ScrollPadlock
   * @returns {boolean} The css class observer state.
   */
  #unobserveCssClass() {
    // if instance observer is already disconnected...
    if (!this.#observerState) {
      // ...then exits early, nothing to do, returns the observer state.
      return this.#observerState;
    }

    // Disconnects the observer, stops observing.
    this.#observer?.disconnect();

    // Updates the instance observer state.
    this.#observerState = false;

    // Returns the instance observer state.
    return this.#observerState;
  }

  /**
   * Refreshes instance DOM-related states.
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #refresh() {
    // Refresh layout
    this.#updateLayout();

    // Refresh scroll position
    this.#updateScrollCurrent();
  }

  /**
   * Attaches or detaches a supported listener.
   * @private
   * @memberof ScrollPadlock
   * @param {string} type - The event type (scroll, resize...).
   * @param {string} method - The event method (add, remove).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  #listener(type, method) {
    // Gets the last method for the given event
    const state = this.#listenersState[type];

    // Event listeners targets (elements) map,
    // contains the event targets elements by event name (as key).
    const listenersTargets = {
      resize: this.#window,

      scroll: this.#scrollEventElement,
    };

    //
    const target = listenersTargets[type];

    // Exit early...
    if (
      // ...if the main element is not set (probably the instance has been destroyed)
      !target

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
    target[`${method}EventListener`](
      type,

      this.#listenersHandlers[type],
    );

    // Ok
    return true;
  }

  /**
   * Detaches a supported listener.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.unlisten('scroll'); // pauses scroll handler
   * padlock.unlisten('resize'); // pauses resize handler
   * @memberof ScrollPadlock
   * @param {string} type - The event type (scroll, resize...).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  unlisten(type) {
    return this.#listener(type, 'remove');
  }

  /**
   * Attaches a supported listener.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.listen('scroll'); // resumes scroll handler
   * padlock.listen('resize'); // resumes resize handler
   * @memberof ScrollPadlock
   * @param {string} type - The event type (scroll, resize...).
   * @returns {boolean} Whether the event attachment or detachment has been successful or not.
   */
  listen(type) {
    return this.#listener(type, 'add');
  }

  /**
   * Effectively destroy the instance, detaching event listeners, removing styles, etc...
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.destroy(); // completely removes the padlock listeners, dom modifications etc...
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  destroy() {
    // Unobserves the CSS class change
    this.#unobserveCssClass();

    // Removes the instance <style /> element from DOM...
    this.#styler?.remove();

    // Removes the css attribute selector from the scrolling element
    this.#applyCssSelectorAttribute('remove');

    // Detaches the scroll event listener
    this.#listener('resize', 'remove');

    // Detaches the resize event listener
    this.#listener('scroll', 'remove');

    // Removes the instance from the instances collection
    instances.delete(this.#elementUniqueInstance);

    // Removes references
    this.#window = null;

    this.#document = null;

    this.#elementUniqueInstance = null;

    this.#scrollingElement = null;

    this.#scrollEventElement = null;

    this.#observer = null;

    this.#styler = null;

    this.#scrollingElementClassList = null;

    this.#scrollCurrent = null;

    this.#scrollSaving = null;

    this.#layout = null;

    this.#cssClassName = '';
  }

  /**
   * Re-evaluates dimensions and such, updates css variables to the current state...
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.update(); // programmaticaly updates the current padlock state in its environment
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  update() {
    // Refresh the css class state
    this.#updateLockState();

    // Perform layout an scroll position refresh at unlocked state
    this.#performUnlockedAction(this.#refresh);

    // Rewrites css variables
    this.#applyStyles();
  }
  // #endregion
}

// eslint-disable-next-line import/no-unused-modules
export default ScrollPadlock;
