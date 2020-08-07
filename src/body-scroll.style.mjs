import {
    isValidScrollPosition,
    getSavedScrollPosition
} from "./body-scroll.scroll.mjs";
import {
    html,
    head,
    body,
    styler,
    addLockedCssClass,
    removeLockedCssClass
} from "./body-scroll.client.mjs";

/**
 * Gets the current vertical scrollbar width size in px unit
 * @public
 * @returns {Number} The current vertical scrollbar width in px
 */
export const getVerticalScrollbarGap = () => {
    // NOTE: right now this is the safest and more robust way to detect the real document scrollbar size (compatible with iOS pinch to zoom)
    // bodyscroll is gonna change overflow property anyway, so we keep this not 100% clean approach for now

    // clears possible body scroll lock state css strategies
    const hasClassRemoved = removeLockedCssClass();

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
    if (hasClassRemoved) {
        addLockedCssClass();
    }

    // returns the vertical scrollbar width
    return scrollbarWidth;
};

//
export const cssVarNamePosition = "--body-scroll-lock-top-rect";
export const cssVarNameGap = "--body-scroll-lock-vertical-scrollbar-gap";

/**
 * Updates css variables to the current state
 * @public
 * @returns {void} Nothing
 */
export const updateCssVariables = () => {
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
    const scrollSaving = getSavedScrollPosition();
    const scrollPosition = isValidScrollPosition(scrollSaving)
        ? scrollSaving
        : { top: 0, left: 0 };

    // composes updated css variables rule
    const rule = `:root {
        ${cssVarNamePosition}: ${scrollPosition.top * -1}px;
        ${cssVarNameGap}: ${verticalScrollbarGap}px;
        ${cssVarNameGap}-round: ${Math.round(verticalScrollbarGap)}px;
    }`;

    // sets new rule up
    styler.sheet.insertRule(rule, index);
};
