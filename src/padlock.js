import getLayoutDimensions from './get-layout-dimensions';
import getScrollPosition from './get-scroll-position';
import setUniqueCssRule from './set-unique-css-rule';
import getCssRuleFromSchema from './get-css-rule-from-schema';
import getLayoutDimensionsCssSchema from './get-layout-dimensions-css-schema';
import getScrollPositionCssSchema from './get-scroll-position-css-schema';

//
const defaultHandlerWrapper = (a) => a;

//
let instanceId = 0;

// Instances collection,
// a weakmap is used in order to keep every instance associated with the scrollable element itself
const instances = new WeakMap();

/**
 * Creates the scroll padlock class instance on body scroll or on a given scrollable element.
 *
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
 * @public
 * @throws {TypeError} Throws when the given constructor arguments are invalid.
 * @throws {Error} Throws when an instance is already attached to the given dom element.
 * @param {HTMLElement | object} [scrollingElementArgument] - The given scrollable element
 * whose scroll needs to be controlled or an options object.
 * @param {string} [cssClassNameArgument] - The locked-state css class or an options object.
 * @param {Window} [clientArgument] - The client environment object (window).
 */
class ScrollPadlock {
  constructor(scrollingElementArgument, cssClassNameArgument, clientArgument = globalThis) {
    //
    const isScrollingElementArgumentObject = typeof scrollingElementArgument === 'object';

    //
    const { HTMLElement } = clientArgument;

    //
    const isScrollingElementArgumentHtmlElement = (
      scrollingElementArgument instanceof HTMLElement
    );

    //
    const isScrollingElementArgumentOptionsObject = (
      isScrollingElementArgumentObject && !isScrollingElementArgumentHtmlElement
    );

    //
    const options = isScrollingElementArgumentOptionsObject ? scrollingElementArgument : {
      scrollingElement: scrollingElementArgument,

      cssClassName: cssClassNameArgument,

      client: clientArgument,
    };

    //
    const {
      scrollingElement: optionScrollingElement,

      scrollEventElement: optionScrollEventElement,

      cssClassName: optionCssClassName,

      resizeHandlerWrapper: optionResizeHandlerWrapper,

      scrollHandlerWrapper: optionScrollHandlerWrapper,

      client: optionClient,
    } = options || {};

    //
    this.#window = optionClient || clientArgument;

    //
    const { document } = this.#window || {};

    //
    this.#document = document;

    //
    if (
      scrollingElementArgument === null
       || scrollingElementArgument === this.#window
       || scrollingElementArgument === this.#document
    ) {
      throw new TypeError('errrr1');
    }

    //
    const {
      body,

      documentElement,

      scrollingElement: documentScrollingElement,
    } = this.#document || {};

    //
    const defaultScrollingElement = documentScrollingElement || documentElement;

    //
    this.#scrollingElement = optionScrollingElement || defaultScrollingElement;

    if (!(this.#scrollingElement instanceof HTMLElement)) {
      throw new TypeError('errrr2');
    }

    //
    let defaultScrollEventElement = optionScrollingElement || this.#window;

    //
    defaultScrollEventElement = (
      optionScrollingElement === body || optionScrollingElement === documentElement
        ? this.#window
        : defaultScrollEventElement
    );

    //
    this.#scrollEventElement = optionScrollEventElement || defaultScrollEventElement;

    //
    if (
      !(this.#scrollEventElement instanceof HTMLElement)
       && this.#scrollEventElement !== this.#window
    ) {
      throw new TypeError('errrr3');
    }

    //
    this.#elementUniqueInstance = this.#scrollEventElement;

    //
    const optionCssClassNameTypeof = typeof optionCssClassName;

    //
    if (
      (optionCssClassNameTypeof !== 'undefined' && optionCssClassNameTypeof !== 'string')
      || optionCssClassName === ''
    ) {
      throw new TypeError('errrr1');
    }

    // Stores the class name as a private member
    this.#cssClassName = optionCssClassName || 'scroll-padlock-locked';

    //
    this.#resizeHandlerWrapper = optionResizeHandlerWrapper || defaultHandlerWrapper;

    //
    this.#scrollHandlerWrapper = optionScrollHandlerWrapper || defaultHandlerWrapper;

    // If an instance has already been initialized on this very element,
    // there could be conflicts in events handling etc,
    // throws an exception in this case
    if (instances.has(this.#elementUniqueInstance)) {
      throw new Error(`An instance has already been initialized on ${this.#elementUniqueInstance}`);
    }

    // Instance is not registered ad this point,
    // so this one is added to the instances collection
    instances.set(this.#elementUniqueInstance, this);

    //
    const { MutationObserver = function MutationObserver() {} } = this.#window || {};

    //
    this.#observer = new MutationObserver(this.#handleObservation.bind(this));

    //
    this.#styler = this.#document.createElement('style');

    // Stores the given element class list reference
    this.#classList = this.#getClassList();

    //
    instanceId += 1;

    // The element data attribute value
    this.#id = instanceId;

    // The element css selector
    this.#cssSelector = this.#getCssSelector();

    // Applies the css rules to the given element with the corresponding attribute selector
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
  }

  // #region properties

  /**
   *
   * @private
   * @memberof ScrollPadlock
   */
  #id = 0;

  /**
   * A reference to the client window object.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #window = null;

  /**
   * A reference to the client document object.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #document = null;

  /**
   * The html element that can perform the scrolling action.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #scrollingElement = null;

  /**
   * The element that can perform and listen to scroll event.
   * Usually coincides with the scrolling element, but when the scrolling element
   * is document.documentElement or document.body, "scroller" is window.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #scrollEventElement = null;

  /**
   * The element used as unique identifier (key) in the map of instances.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #elementUniqueInstance = null;

  /**
   * The styler, css variables holder.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #styler = null;

  /**
   * The original given element CSS class list.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #classList = null;

  /**
   * The current scroll position.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #scrollCurrent = null;

  /**
   * The scroll position saving, the scroll position stored for later use.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #scrollSaving = null;

  /**
   * State MutationObserver object,
   * registers the callback fired on CSS class change.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #observer = null;

  /**
   * Event listeners states map,
   * contains the last method called by event name (as key).
   *
   * @private
   * @memberof ScrollPadlock
   */
  #listenersState = {
    resize: 'remove',

    scroll: 'remove',
  };

  /**
   * The layout dimensions.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #layout = null;

  /**
   * The scroll lock state.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #state = false;

  /**
   * The current css class observer state
   * True if observing, false if not.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #observerState = false;

  /**
   * The element css selector.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #cssSelector = '';

  /**
   * The element data attribute name.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #cssSelectorAttributeName = 'data-scroll-padlock';

  /**
   * The lock state CSS class name.
   *
   * @private
   * @memberof ScrollPadlock
   */
  #cssClassName = '';

  // #endregion

  // #region accessors

  /**
   * Gets the currently set css selector.
   *
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.cssSelector // --> "[data-scroll-padlock="1-1"]"
   * @returns {string} The css selector.
   */
  get cssSelector() {
    return this.#cssSelector;
  }

  /**
   * Returns the current scroll position, if on a locked state it
   * returns the currently saved scroll position object.
   *
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll // --> { top: 123, left: 345 }
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
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll = { top: 123, left: 345 }
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
   * Gets the layout dimensions, such as widths, heights, scrollbars etc...
   *
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.layout // --> { outerHeight: 123, outerWidth: 345, innerWidth: 123, ... }
   * @returns {object} The layout object.
   */
  get layout() {
    return this.#layout;
  }

  // #endregion

  // #region methods

  /**
   * Handles the element mutation observation.
   *
   * @private
   * @memberof ScrollPadlock
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
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {any} Anything the given function returns is returned.
   */
  #resizeHandlerWrapper = defaultHandlerWrapper;

  /**
   *
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
   * Window resize event handler.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   */
  #handleResize = this.#resizeHandlerWrapper(
    this.#resizeHandler.bind(this),
  );

  /**
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {any} Anything the given function returns is returned.
   */
  #scrollHandlerWrapper = defaultHandlerWrapper;

  /**
   *
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
   * Element scroll event handler.
   *
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
   *
   * @private
   * @memberof ScrollPadlock
   */
  #listenersHandlers = {
    resize: this.#handleResize,

    scroll: this.#handleScroll,
  };

  /**
   * Event listeners targets (elements) map,
   * contains the event targets elements by event name (as key).
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {object} The listener targets.
   */
  get #listenersTargets() {
    return {
      resize: this.#window,

      scroll: this.#scrollEventElement,
    };
  }

  /**
   * Gets the given element class list reference.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {DOMTokenList} The given element class list reference.
   */
  #getClassList() {
    return this.#scrollingElement?.classList;
  }

  /**
   * Gets the element css selector.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {string} The element css selector.
   */
  #getCssSelector() {
    return `[${this.#cssSelectorAttributeName}="${this.#id}"]`;
  }

  /**
   * Gets the scroll lock state.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {boolean} The scroll lock state.
   */
  #getState() {
    return !!this.#classList?.contains(this.#cssClassName);
  }

  /**
   * Gets the layout object.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {object} The layout object.
   */
  #getLayout() {
    return getLayoutDimensions(this.#scrollingElement, this.#scrollEventElement);
  }

  /**
   * Gets the current scroll position.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {object} The current scroll position.
   */
  #getScrollCurrent() {
    return getScrollPosition(this.#scrollEventElement);
  }

  /**
   * Scrolls the given element to a given scroll position.
   *
   * @private
   * @memberof ScrollPadlock
   * @param {object} position - The scroll position to be set.
   * @returns {void} Nothing.
   */
  #scrollTo = (position) => this.#scrollEventElement.scrollTo(
    position.left,

    position.top,
  );

  /**
   * Updates the scroll state.
   *
   * @private
   * @memberof ScrollPadlock
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
   * @private
   * @memberof ScrollPadlock
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
   * @private
   * @memberof ScrollPadlock
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
   * @private
   * @memberof ScrollPadlock
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
   * @private
   * @memberof ScrollPadlock
   * @returns {HTMLStyleElement} The styler element.
   */
  #setStylerCssRule() {
    //
    const schema = [
      ...getLayoutDimensionsCssSchema(this.layout),

      ...getScrollPositionCssSchema(this.scroll),
    ];

    //
    const rule = getCssRuleFromSchema(this.#cssSelector, schema);

    //
    return setUniqueCssRule(this.#styler, rule);
  }

  /**
   * Ensures the styler element is in head.
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {HTMLStyleElement} The styler element.
   */
  #ensureStylerPresenceInHead() {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (this.#styler && !this.#document?.head?.contains(this.#styler)) {
      //
      this.#document?.head.appendChild(this.#styler);
    }

    //
    return this.#styler;
  }

  /**
   * Removes the CSS variables, styler, styler selector...
   *
   * @private
   * @memberof ScrollPadlock
   * @returns {HTMLStyleElement} The styler element.
   */
  #removeStyler() {
    //
    this.#styler?.remove();

    //
    return this.#styler;
  }

  /**
   * Applies the css rules to the given element with the corresponding attribute selector.
   *
   * @private
   * @memberof ScrollPadlock
   * @param {string} method - The action to be performed, can be "remove" or "add".
   * @returns {void} Nothing.
   */
  #applyCssSelectorAttribute(method) {
    this.#scrollingElement?.[`${method}Attribute`](
      this.#cssSelectorAttributeName,

      this.#id,
    );
  }

  /**
   * Rewrites the css variables with current data.
   *
   * @private
   * @memberof ScrollPadlock
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
   * @private
   * @memberof ScrollPadlock
   * @returns {boolean} The css class observer state.
   */
  #observeCssClass() {
    //
    if (this.#observerState) {
      //
      return this.#observerState;
    }

    //
    this.#observer?.observe(this.#scrollingElement, {
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
   * @private
   * @memberof ScrollPadlock
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
   *
   * @private
   * @memberof ScrollPadlock
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
      !this.#elementUniqueInstance

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
   *
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
   *
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

    // Removes the CSS variables, styler, styler selector...
    this.#removeStyler();

    //
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

    this.#classList = null;
  }

  /**
   * Re-evaluates dimensions and such, updates css variables to the current state...
   *
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
    this.#updateState();

    // Perform layout an scroll position refresh at unlocked state
    this.#performUnlockedAction(this.#refresh);

    // Rewrites css variables
    this.#applyStyles();
  }
  // #endregion
}

// eslint-disable-next-line import/no-unused-modules
export default ScrollPadlock;
