import './typedef.js';

import getLayoutDimensions from './get-layout-dimensions.js';
import getScrollPosition from './get-scroll-position.js';
import setUniqueCssRule from './set-unique-css-rule.js';
import getLayoutDimensionsCssRules from './get-layout-dimensions-css-rules.js';
import getScrollPositionCssRules from './get-scroll-position-css-rules.js';

// The element data attribute name
const CSS_SELECTOR_ATTR_NAME = 'data-scroll-padlock';

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
 * void new ScrollPadlock({
 *  scrollingElement: document.querySelector('#custom-scrolling-element'),
 *
 *  cssClassName: 'locked-state-css-class',
 * });
 */
class ScrollPadlock {
  // #region constructor

  /**
   * Creates the scroll padlock class instance on body scroll or on a given scrollable element.
   * @param {ConstructorOptions} [options] - An options object.
   * @throws {TypeError} Throws when the given constructor arguments are invalid.
   * @throws {Error} Throws when an instance is already attached to the given dom element.
   * @public
   */
  constructor(options) {
    // Object of options deconstruction
    const {
      scrollingElement: optionScrollingElement,

      scrollEventElement: optionScrollEventElement,

      cssClassName: optionCssClassName,
    } = options || {};

    // The client "window" object reference
    this.#window = globalThis;

    // The client "document" object deconstruction
    this.#document = this.#window.document;

    // The browser default scrolling element
    const defaultScrollingElement = (
      this.#document.scrollingElement

      || this.#document.documentElement
    );

    // The Padlock instance scrolling element
    this.#scrollingElement = defaultScrollingElement;

    if (optionScrollingElement !== undefined) {
      this.#scrollingElement = optionScrollingElement;
    }

    // Whether the scrolling element Padlock instance member is an html element or not
    const isScrollingElementHtmlElement = (
      this.#scrollingElement instanceof this.#window.HTMLElement
    );

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
    if (
      optionScrollingElement === this.#document.body

      || optionScrollingElement === this.#document.documentElement
    ) {
      defaultScrollEventElement = this.#window;
    }

    // Padlock instance element which trigger "scroll" event member reference
    this.#scrollEventElement = defaultScrollEventElement;

    //
    if (optionScrollEventElement !== undefined) {
      this.#scrollEventElement = optionScrollEventElement;
    }

    // Whether the scrolling element Padlock instance member is an html element or not
    const isScrollEventHtmlElement = this.#scrollEventElement instanceof this.#window.HTMLElement;

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

    // Whether the Padlock css class option is set, but it's not of type "string"
    const isOptionsCssClassNameSetButNotString = (
      optionCssClassName !== undefined && typeof optionCssClassName !== 'string'
    );

    // The css class to be observed validity check...
    if (isOptionsCssClassNameSetButNotString || optionCssClassName === '') {
      // ...throws error if invalid
      throw new TypeError('The Padlock CSS class to be observed is invalid.');
    }

    // Stores the css class name to be observer or a default value
    this.#cssClassName = optionCssClassName || 'scroll-padlock-locked';

    // Handles the Padlock DOM observation through MutationObserver API
    this.#observer = new this.#window.MutationObserver(this.#handleObservation.bind(this));

    // The Padlock instance unique styler, a <style /> element
    this.#styler = this.#document.createElement('style');

    // Increments the global id reference in order to set a unique one to the current instance
    instanceId += 1;

    // The element data attribute value
    this.#id = instanceId;

    // The element css selector
    this.#cssSelector = `[${CSS_SELECTOR_ATTR_NAME}="${this.#id}"]`;

    // Applies the attribute selector to the scrolling element
    this.#scrollingElement?.setAttribute(
      CSS_SELECTOR_ATTR_NAME,

      this.#id,
    );

    // Fires the public update method to initialize everything;
    // computes scroll position, scrollbars sizes and writes css variables
    this.update();

    // Observes the given element CSS class list for given CSS class name changes
    this.#observeCssClass();

    // Attaches resize event listener
    this.#window?.addEventListener(
      'resize',

      this.updateLayoutDimensions,
    );

    // Attaches scroll event listener
    this.#scrollEventElement?.addEventListener(
      'scroll',

      this.updateScrollPosition,
    );

    // The instance is not registered ad this point,
    // so, since nothing threw errors so far,
    // this instance is added to the global instances collection
    instances.set(this.#elementUniqueInstance, this);
  }

  // #endregion

  // #region private properties

  /**
   * The Padlock instance unique identifier.
   * @memberof ScrollPadlock
   * @private
   */
  #id = 0;

  /**
   * A reference to the client "window" object.
   * @type {GlobalContext}
   * @memberof ScrollPadlock
   * @private
   */
  #window = null;

  /**
   * A reference to the client "document" object.
   * @type {Document}
   * @memberof ScrollPadlock
   * @private
   */
  #document = null;

  /**
   * The html element that can perform the scrolling action.
   * @type {HTMLElement}
   * @memberof ScrollPadlock
   * @private
   */
  #scrollingElement = null;

  /**
   * The element that can perform and listen to scroll event.
   * Usually coincides with the scrolling element, but when the scrolling element
   * is document.documentElement or document.body, "scroller" is window.
   * @type {HTMLElement|Window}
   * @memberof ScrollPadlock
   * @private
   */
  #scrollEventElement = null;

  /**
   * The element used as unique identifier (key) in the map of instances.
   * @type {HTMLElement|Window}
   * @memberof ScrollPadlock
   * @private
   */
  #elementUniqueInstance = null;

  /**
   * The styler, css variables holder.
   * @type {HTMLStyleElement}
   * @memberof ScrollPadlock
   * @private
   */
  #styler = null;

  /**
   * The original given element CSS class list.
   * @type {DOMTokenList}
   * @memberof ScrollPadlock
   * @private
   */
  #scrollingElementClassList = null;

  /**
   * The current scroll position.
   * @type {ScrollPosition}
   * @memberof ScrollPadlock
   * @private
   */
  #scrollCurrent = null;

  /**
   * The scroll position saving, the scroll position stored for later use.
   * @type {ScrollPosition}
   * @memberof ScrollPadlock
   * @private
   */
  #scrollSaving = null;

  /**
   * State MutationObserver object,
   * registers the callback fired on CSS class change.
   * @type {MutationObserver}
   * @memberof ScrollPadlock
   * @private
   */
  #observer = null;

  /**
   * The layout dimensions.
   * @memberof ScrollPadlock
   * @private
   */
  #layout = null;

  /**
   * The scroll lock state, true if is locked, false if not.
   * @memberof ScrollPadlock
   * @private
   */
  #lockState = false;

  /**
   * The current css class observer state
   * True if observing, false if not.
   * @memberof ScrollPadlock
   * @private
   */
  #observerState = false;

  /**
   * The element css selector.
   * @memberof ScrollPadlock
   * @private
   */
  #cssSelector = '';

  /**
   * The lock state CSS class name.
   * @memberof ScrollPadlock
   * @private
   */
  #cssClassName = '';

  // #endregion

  // #region public accessors

  /**
   * The html element that can perform the scrolling action.
   * @type {HTMLElement}
   * @memberof ScrollPadlock
   * @public
   */
  get scrollingElement() {
    return this.#scrollingElement;
  }

  /**
   * The element that can listen to scroll event.
   * Usually coincides with the scrolling element, but when the scrolling element
   * is document.documentElement or document.body, "scroller" is window.
   * @type {HTMLElement|Window}
   * @memberof ScrollPadlock
   * @public
   */
  get scrollEventElement() {
    return this.#scrollEventElement;
  }

  /**
   * The lock state CSS class name.
   * @type {string}
   * @memberof ScrollPadlock
   * @public
   */
  get cssClassName() {
    return this.#cssClassName;
  }

  /**
   * Returns the current scroll position, if on a locked state it
   * returns the currently saved scroll position object.
   * @returns {ScrollPosition} The current scroll position object or the
   * scroll position previously saved if on a locked state.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll // --> { top: 123, left: 345 }
   */
  get scroll() {
    // If the state is locked, the saved scroll position is returned...
    if (this.#lockState) {
      return this.#scrollSaving;
    }

    // ...otherwise the current scroll position is returned
    return this.#scrollCurrent;
  }

  /**
   * Sets a new scroll position, if on a locked state it saves that
   * given scroll position for a future scroll restoration.
   * @param {ScrollPosition} position - The scroll position to be set
   * or saved if on a locked state.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.scroll = { top: 123, left: 345 }
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
   * @returns {LayoutDimensions} The layout object.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.layout // --> { outerHeight: 123, outerWidth: 345, innerWidth: 123, ... }
   */
  get layout() {
    return this.#layout;
  }

  // #endregion

  // #region private methods

  /**
   * Handles the element mutation observation.
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @private
   */
  #handleObservation() {
    // Caches the current scroll lock state before updating it
    const state = this.#lockState;

    // Updates lock state member
    this.updateLockState();

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
   * Scrolls the given element to a given scroll position.
   * @memberof ScrollPadlock
   * @param {ScrollPosition} position - The scroll position to be set.
   * @returns {void} Nothing.
   * @private
   */
  #scrollTo = (position) => this.#scrollEventElement?.scrollTo(
    position.left,

    position.top,
  );

  /**
   * Fires a given function at a unlocked scroll state.
   * @memberof ScrollPadlock
   * @param {Function} action - The given function to be fired at unlocked scroll state.
   * @returns {unknown} Anything the given function returns is returned.
   * @private
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
   * @memberof ScrollPadlock
   * @returns {LayoutDimensions} The layout object.
   * @private
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
   * @memberof ScrollPadlock
   * @returns {ScrollPosition} The current scroll position object.
   * @private
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
   * Rewrites the css variables with current data.
   * @memberof ScrollPadlock
   * @returns {HTMLStyleElement} Styler element.
   * @private
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
   * @memberof ScrollPadlock
   * @returns {boolean} The css class observer state.
   * @private
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
   * @memberof ScrollPadlock
   * @returns {boolean} The css class observer state.
   * @private
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
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @private
   */
  #updateAll() {
    // Refresh layout
    this.#updateLayout();

    // Refresh scroll position
    this.#updateScrollCurrent();
  }

  // #endregion

  // #region public methods

  /**
   * Effectively destroy the instance, detaching event listeners, removing styles, etc...
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @public
   * @example
   *  const padlock = new ScrollPadlock();
   *
   *  padlock.destroy(); // completely removes the padlock listeners, dom modifications etc...
   */
  destroy() {
    // Unobserves the CSS class change
    this.#unobserveCssClass();

    // Removes the instance <style /> element from DOM...
    this.#styler?.remove();

    // Removes the css attribute selector from the scrolling element
    this.#scrollingElement?.removeAttribute(
      CSS_SELECTOR_ATTR_NAME,

      this.#id,
    );

    // Detaches the scroll event listener
    this.#window?.removeEventListener(
      'resize',

      this.updateLayoutDimensions,
    );

    // Detaches the resize event listener
    this.#scrollEventElement?.removeEventListener(
      'scroll',

      this.updateScrollPosition,
    );

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
   * Updates the scroll state.
   * @memberof ScrollPadlock
   * @returns {boolean} The scroll state, true if is locked, false if not.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.updateLockState(); // programmaticaly updates
   * // the current padlock scroll locked or unlocked state in its environment
   */
  updateLockState() {
    // Updates the instance scroll state...
    this.#lockState = !!this.#scrollingElementClassList?.contains(this.#cssClassName);

    // ...then returns it.
    return this.#lockState;
  }

  /**
   * Re-evaluates scroll positions, updates the relative css variables to the current state...
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.updateScrollPosition(); // programmaticaly updates
   * // the current padlock layout state in its environment
   */
  updateScrollPosition = function updateScrollPosition() {
    // Refresh scrollbars size
    this.#performUnlockedAction(this.#updateScrollCurrent);

    // Rewrites css variables
    this.#applyStyles();
  }.bind(this);

  /**
   * Re-evaluates layout dimensions, updates the relative css variables to the current state...
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.updateLayoutDimensions(); // programmaticaly updates
   * // the current padlock scroll state in its environment
   */
  updateLayoutDimensions = function updateLayoutDimensions() {
    // Refresh layout
    this.#performUnlockedAction(this.#updateLayout);

    // Rewrites css variables
    this.#applyStyles();
  }.bind(this);

  /**
   * Re-evaluates dimensions and such, updates css variables to the current state...
   * @memberof ScrollPadlock
   * @returns {void} Nothing.
   * @public
   * @example
   * const padlock = new ScrollPadlock();
   *
   * padlock.update(); // programmaticaly updates the current padlock state in its environment
   */
  update() {
    // Refresh the css class state
    this.updateLockState();

    // Perform layout an scroll position refresh at unlocked state
    this.#performUnlockedAction(this.#updateAll);

    // Rewrites css variables
    this.#applyStyles();
  }
  // #endregion
}

export default ScrollPadlock;
