import { $head, $html, $body, $style } from "./body-scroll.client.mjs";

const CssVars = {
    SCROLL_Y: "--body-scroll-scroll-y",
    SCROLLBAR_WIDTH: "--body-scroll-scrollbar-width"
};

/**
 *
 * @param state
 */
const getClientWidth = locked => {
    $body.style.width = locked ? `${$html.clientWidth}px` : "";
    $html.style.overflow = locked ? "hidden" : "";

    return $html.clientWidth;
};

/**
 * Checks if the style element is in the tag head or not
 * @returns {boolean} true if present
 */
export const isStyleElementInHead = () => $style.parentNode === $head;

/**
 * Inserts a rule with the CSSStyleSheet interface
 * @param {string} rule The CSS rule to add
 * @param {number} index The index of the CSS rule in the CSSRulesList
 */
const insertIndexedRule = (rule = "", index = 0) => {
    if (!isStyleElementInHead()) {
        $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
        $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(rule, index);
};

/**
 *
 */
export const setCssVars = () => {
    insertIndexedRule(
        `:root {
            ${CssVars.SCROLL_Y}: ${window.scrollY}px;
            ${CssVars.SCROLLBAR_WIDTH}: ${getClientWidth(true) -
            getClientWidth(false)}px;
        }`
    );
};

/**
 *
 */
export const clearCssVars = () => {};
/**
 *
 */
let scroll = {
    x: 0,
    y: 0
};

/**
 *
 */
export const getScrollPosition = () => {
    return {
        x: window.scrollX,
        y: window.scrollY
    };
};

/**
 *
 */
export const saveScrollPosition = () => (scroll = getScrollPosition());

/**
 *
 */
export const restoreScrollPosition = () => window.scrollTo(scroll.x, scroll.y);
