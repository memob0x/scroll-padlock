import { $html, $body } from "./body-scroll.client.mjs";
import {
    insertIndexedRuleInStyleElement,
    getOrCreateUniqueStyleElement
} from "./body-scroll.styler.mjs";

/**
 *
 */
export const $locker = getOrCreateUniqueStyleElement("body-scroll-locker");

/**
 *
 */
export const CssVars = {
    SCROLL_Y: "--body-scroll-scroll-y",
    SCROLLBAR_WIDTH: "--body-scroll-scrollbar-width"
};

/**
 *
 * @param locked
 */
const getClientWidth = locked => {
    $body.style.width = locked ? `${$html.clientWidth}px` : "";
    $html.style.overflow = locked ? "hidden" : "";

    return $html.clientWidth;
};

/**
 *
 */
export const setLockerCssVars = () => {
    insertIndexedRuleInStyleElement(
        $locker,
        `:root {
            ${CssVars.SCROLL_Y}: ${window.scrollY}px!important;
            ${CssVars.SCROLLBAR_WIDTH}: ${getClientWidth(true) -
            getClientWidth(false)}px!important;
        }`
    );
};

/**
 *
 */
if (
    !!!window.getComputedStyle($html).getPropertyValue(CssVars.SCROLLBAR_WIDTH)
) {
    insertIndexedRuleInStyleElement(
        getOrCreateUniqueStyleElement("body-scroll-defaults"),
        `:root {
            ${CssVars.SCROLLBAR_WIDTH}: 0;
        }`
    );
}
