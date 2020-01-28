import { $head } from "./body-scroll.client.mjs";

/**
 *
 * @param {string} id
 * @returns {HTMLStyleElement}
 */
export const getOrCreateUniqueStyleElement = id => {
    return (
        $head.querySelector(`#${id}`) ||
        (() => {
            const $style = document.createElement("style");
            $style.id = id;
            return $style;
        })()
    );
};

/**
 * Checks if the style element is in the tag head or not
 * @param {HTMLLinkElement} $style
 * @returns {boolean} true if present
 */
export const isStyleElementInHead = $style => $style.parentNode === $head;

/**
 * Inserts a rule with the CSSStyleSheet interface
 * @param {HTMLLinkElement} $style
 * @param {string} rule The CSS rule to add
 * @param {number} index The index of the CSS rule in the CSSRulesList
 */
export const insertIndexedRuleInStyleElement = (
    $style,
    rule = "",
    index = 0
) => {
    if (!isStyleElementInHead($style)) {
        $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
        $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(rule, index);

    return $style;
};
