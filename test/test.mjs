import { html, body, head } from "../src/body-scroll.client.mjs";

// bodyScroll consts
export const CSS_VAR_NAME_POSITION = "--body-scroll-lock-top-rect";
export const CSS_VAR_NAME_GAP = "--body-scroll-lock-vertical-scrollbar-gap";
export const LOCKED_STATE_CLASS = "body-scroll-lock";

// test consts
export const SCROLL_GAP_DEFAULT = 20;
export const SCROLL_GAP_LARGER = 60;
export const CSS_CLASS_GAP_LARGER = "scrollbar-wider";

// caching test involved elements
export const styler = document.createElement("style");
export const expander = document.createElement("div");

// utility function to retrieve a css variable value (maybe can be component._utils)
export const getCssVariableValue = (variableName) =>
    window.getComputedStyle(html).getPropertyValue(variableName).trim();

export const preparePlayground = () => {
    // FIXME: y styler.sheet.insertRule() throws?
    styler.innerHTML = `
        html::-webkit-scrollbar { width: ${SCROLL_GAP_DEFAULT}px; }
        html.${CSS_CLASS_GAP_LARGER}::-webkit-scrollbar { width: ${SCROLL_GAP_LARGER}px; }
    `;

    expander.style.height = "9999px";

    head.append(styler);
    body.append(expander);
};

export const clearPlayground = () => {
    styler.remove();
    expander.remove();
};
