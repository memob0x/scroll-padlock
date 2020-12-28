// Test env elements
export const html = document.documentElement;
export const head = document.head;
export const body = document.body;

// Test values constants
export const SCROLL_GAP_VALUE_DEFAULT = 25;
export const SCROLL_GAP_VALUE_LARGER = 65;
export const SCROLL_GAP_CSS_CLASS_NAME_LARGER = "scrollbar-wider";
export const DUMMY_SCROLLER_TAG_NAME = 'div';
export const DUMMY_SCROLLER_CLASS_NAME = 'dummy-scroller';
export const DUMMY_SCROLLER_EXPANDER_CLASS_NAME = 'dummy-scroller__expander';

// Scrollbars styler closure
const styler = document.createElement("style");

// All test environment CSS rules
const cssRules = [
    `
    ::-webkit-scrollbar {
        width: ${SCROLL_GAP_VALUE_DEFAULT}px;
    }`,
    `
    .${SCROLL_GAP_CSS_CLASS_NAME_LARGER}::-webkit-scrollbar {
        width: ${SCROLL_GAP_VALUE_LARGER}px;
    }`,
    `
    ${DUMMY_SCROLLER_TAG_NAME}.${DUMMY_SCROLLER_CLASS_NAME} {
        max-width: 100px;
        max-height: 100px;
        overflow: auto;
    }`,
    `
    ${DUMMY_SCROLLER_TAG_NAME}.${DUMMY_SCROLLER_EXPANDER_CLASS_NAME} {
        width: 9999px;
        height: 9999px;
    }`
]

/**
 * Sets the test playground up
 * @returns {void} Nothing
 */
export const setCSSRules = () => {
    if( !head.contains(styler) ){
        head.append(styler);
    }

    const sheet = styler.sheet;
    
    for( let i = 0, j = cssRules.length; i < j; i++ ){
        if (sheet.cssRules[i]) {
            sheet.deleteRule(i);
        }

        sheet.insertRule(cssRules[i]);
    }
};

/**
 * Cleans up the test playground
 * @returns {void} Nothing
 */
export const removeCSSRules = () => styler.remove();

/**
 * Gets a given element given css variable value
 * @param {HTMLElement} element The given element
 * @param {String} variableName The given css variable name
 * @returns {String} The given css variable value set to the given element
 */
export const getCSSVariableValue = (element, variableName) => window.getComputedStyle(element).getPropertyValue(variableName).trim();

/**
 * Creates a dummy scroll expander element
 * @returns {HTMLElement} The dummy scroll expander element
 */
export const getScrollExpanderElement = () => {
    const expander = document.createElement(DUMMY_SCROLLER_TAG_NAME);

    expander.classList.add(DUMMY_SCROLLER_EXPANDER_CLASS_NAME);

    return expander;
}

/**
 * Creates a dummy scrollable element
 * @returns {HTMLElement} The dummy scrollable element
 */
export const getScrollableElement = () => {    
    const scroller = document.createElement(DUMMY_SCROLLER_TAG_NAME);

    scroller.classList.add(DUMMY_SCROLLER_CLASS_NAME);

    scroller.append(getScrollExpanderElement());

    return scroller;
}
