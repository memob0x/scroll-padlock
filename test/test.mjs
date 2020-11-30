import { head } from "../src/client.mjs";

//
export const scrollGapDefaultValue = 20;
export const scrollGapLargerValue = 60;
export const scrollGapLargerCssClassName = "scrollbar-wider";

//
export const styler = document.createElement("style");
export const expander = document.createElement("div");

/**
 *
 * @returns {void} Nothing
 */
export const preparePlayground = () => {
    // FIXME: y styler.sheet.insertRule() throws?
    styler.innerHTML = `
        html::-webkit-scrollbar { width: ${scrollGapDefaultValue}px; }
        html.${scrollGapLargerCssClassName}::-webkit-scrollbar { width: ${scrollGapLargerValue}px; }
    `;

    expander.style.height = "9999px";

    head.append(styler);
    document.body.append(expander);
};

/**
 *
 * @returns {void} Nothing
 */
export const clearPlayground = () => {
    styler.remove();
    expander.remove();
};
