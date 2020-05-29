// consts
const LOCKED_STATE_CLASS = "body-scroll-lock";

// scroll position saving closure
let scrollSaving = null;
// lock state flag closure, true if is locked
let lockState = false;

// caching involved dom elements
const head = document.head;
const body = document.body;
const html = document.documentElement;
const styler = document.createElement("style");

/**
 * Checks whether a given value is a valid number or not
 * @static
 * @private
 * @param {any} value The given value to be checked
 * @returns {Boolean} True if the given value is a number
 */
const isNumber = (value) => typeof value === "number" && !isNaN(value);

/**
 * Checks whether a given value is a valid scroll object or not
 * @example
 * isValidScrollPosition({top:0, left:100}); // true
 * isValidScrollPosition(null); // false
 * isValidScrollPosition({top:"foo", left:NaN}); // false
 * @static
 * @private
 * @param {Object} value The given value to be checked
 * @returns {Boolean} True if the given value is a valid scroll object
 */
const isValidScrollPosition = (value) =>
    value && isNumber(value?.top) && isNumber(value?.left);

/**
 * Formats a given scroll position object value, if malformed returns null
 * @static
 * @private
 * @param {Object} value The given value to be formatted
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
var formatScrollPosition = (value) =>
    isValidScrollPosition(value) ? value : null;

/**
 * Restores a given valid scroll position object, if not passed possibly restores a previously saved scroll position object
 * @public
 * @param {Object} [scroll] The given scroll object to be restored
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
const restoreScrollPosition = (scroll) => {
    scroll = scroll !== undefined ? scroll : scrollSaving;
    scroll = formatScrollPosition(scroll);

    if (scroll) {
        window.scrollTo(scroll.left, scroll.top);
    }

    return scroll;
};

/**
 * Saves a given valid scroll position object, if not passed saves the current body scroll position
 * @public
 * @param {Object} [scroll] The given scroll position object to be saved
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
var saveScrollPosition = (scroll) => {
    if (scroll === undefined) {
        scroll = {
            top: window.pageYOffset,
            left: window.pageXOffset
        };
    }

    scrollSaving = formatScrollPosition(scroll);

    return scrollSaving;
};

/**
 * Gets the current vertical scrollbar width size in px unit
 * @public
 * @returns {Number} The current vertical scrollbar width in px
 */
const getVerticalScrollbarGap = () => {
    // NOTE: right now this is the safest and more robust way to detect the real document scrollbar size (compatible with iOS pinch to zoom)
    // bodyscroll is gonna change overflow property anyway, so we keep this not 100% clean approach for now

    // clears possible body scroll lock state css strategies
    html.classList.remove(LOCKED_STATE_CLASS);

    // caches current html element width
    // NOTE: right now only getBoundingClientRect grant sub pixel measures, repaint would have been done anyway so...
    var docWidth = html.getBoundingClientRect().width;

    // fixes current body element width to avoid page jump due to overflow value change
    body.style.width = body.getBoundingClientRect().width + "px";
    // sets overflow property to hidden
    html.style.overflowY = body.style.overflowY = "hidden";

    // gets the actual scrollbar width comparing the cached html width to the current one with overflow hidden on
    var scrollbarWidth = html.getBoundingClientRect().width - docWidth;

    // cleans everything up
    body.style.width = html.style.overflowY = body.style.overflowY = "";

    // possibly re applies body scroll lock state css strategies
    if (isLocked()) {
        html.classList.add(LOCKED_STATE_CLASS);
    }

    // returns the vertical scrollbar width
    return scrollbarWidth;
};

/**
 * Updates css variables to the current state
 * @public
 * @returns {void} Nothing
 */
const updateCssVariables = () => {
    // ensuring style presence, StyleSheet API throws otherwise
    if (!body.contains(styler)) {
        head.append(styler);
    }

    // only rule
    const index = 0;

    // clean up past rules
    if (styler.sheet.cssRules[index]) {
        styler.sheet.deleteRule(index);
    }

    // calculating scrollbar gap
    const verticalScrollbarGap = getVerticalScrollbarGap();
    // gets the current scroll position object saving or default
    const scrollPosition = isValidScrollPosition(scrollSaving)
        ? scrollSaving
        : { top: 0, left: 0 };

    // composes updated css variables rule
    const rule = `:root {
        --body-scroll-lock-top-rect: ${scrollPosition.top * -1}px;
        --body-scroll-lock-vertical-scrollbar-gap: ${verticalScrollbarGap}px;
        --body-scroll-lock-vertical-scrollbar-gap-round: ${Math.round(
            verticalScrollbarGap
        )}px;
    }`;

    // sets new rule up
    styler.sheet.insertRule(rule, index);
};

/**
 * Returns the currently saved scroll position object
 * @public
 * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
 */
const getSavedScrollPosition = () => scrollSaving;

/**
 * Returns the current lock state as a boolean
 * @public
 * @returns {Boolean} True if body scroll is locked, false if not
 */
const isLocked = () => lockState;

/**
 * Dispatches the given message name in jQuery.Event
 * @private
 * @param {String} messageName The given message name to be dispatched
 * @returns {void} Nothing
 */
const dispatchMessage = (messageName) =>
    typeof window.CustomEvent === "function"
        ? window.dispatchEvent(new CustomEvent(`bodyscroll${messageName}`))
        : () => {};

/**
 * Locks the body scroll, saves current body scroll position (if not already saved) and updates css variables
 * @private
 * @returns {Boolean} True if the lock has been successfully done, false if not
 */
const doLock = () => {
    // don't lock when already locked, lock not done, returns false early
    if (isLocked()) {
        return false;
    }

    // sets the lock state to true
    lockState = true;

    // saves current scroll position if there's not another saving state
    if (!isValidScrollPosition(scrollSaving)) {
        saveScrollPosition({
            top: window.pageYOffset,
            left: window.pageXOffset
        });
    }

    // calculates and applies :root css variables to grant body scroll lock css techniques
    updateCssVariables();

    // applies body scroll lock css techniques
    html.classList.add(LOCKED_STATE_CLASS);

    // lock done, returns true
    return true;
};

/**
 * Unlocks the body scroll, restores the scroll position previously saved and clears the saving
 * @private
 * @returns {Boolean} True if the unlock has been successfully done, false if not
 */
var doUnlock = () => {
    // don't unlock when already unlocked, unlock not done, returns false early
    if (!isLocked()) {
        return false;
    }

    // sets the lock state to false
    lockState = false;

    // clears body scroll lock css techniques that could prevent scroll restoration
    html.classList.remove(LOCKED_STATE_CLASS);

    // restores previously saved scroll position
    restoreScrollPosition(scrollSaving);

    // clears the scroll position saving
    scrollSaving = null;

    // unlock done, returns true
    return true;
};

/**
 * Locks the body scroll
 * @public
 * @returns {void} Nothing
 */
const lock = () => {
    // returns early if lock itself hasn't been successful
    if (!doLock()) {
        return;
    }

    // dispatch a "lock done" notification
    dispatchMessage("lock");
};

/**
 * Unlocks the body scroll
 * @public
 * @returns {void} Nothing
 */
var unlock = () => {
    // returns early if unlock itself hasn't been successful
    if (!doUnlock()) {
        return;
    }

    // dispatch an "unlock done" notification
    dispatchMessage("unlock");
};

// handling browser resize (implicitly includes a possible device orientation change)
// re applying a consistent lock state when body scroll is locked
const RESIZE_DEBOUNCE_TIME = 150;
let id = null;
const resizeHandler = () => {
    clearTimeout(id);

    id = setTimeout(() => {
        // toggling body scroll lock

        // gets rid of possible body scroll locked state
        // avoids useless computations when scroll is not locked
        if (!doUnlock()) {
            return;
        }

        // recalculates and rewrites lock state
        doLock();

        // dispatch a "resize during lock" notification
        dispatchMessage("resize");
    }, RESIZE_DEBOUNCE_TIME);
};
window.addEventListener("resize", resizeHandler, true);

// public API
export default {
    // main
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    // extras
    updateCssVariables: updateCssVariables,
    getVerticalScrollbarGap: getVerticalScrollbarGap,
    restoreScrollPosition: restoreScrollPosition,
    saveScrollPosition: saveScrollPosition,
    getSavedScrollPosition: getSavedScrollPosition
};
