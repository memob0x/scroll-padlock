import { head } from "../src/client.mjs";

//
export const scrollGapDefaultValue = 25;
export const scrollGapLargerValue = 65;
export const scrollGapLargerCssClassName = "scrollbar-wider";

//
export const styler = document.createElement("style");
export const expander = document.createElement("div");

/**
 *
 * @returns {void} Nothing
 */
export const preparePlayground = () => {
    head.append(styler);
    
    if (styler.sheet.cssRules[0]) {
        styler.sheet.deleteRule(0);
    }

    styler.sheet.insertRule(`
        html::-webkit-scrollbar {
            width: ${scrollGapDefaultValue}px;
        }
    `);
    
    if (styler.sheet.cssRules[1]) {
        styler.sheet.deleteRule(1);
    }

    styler.sheet.insertRule(`
        html.${scrollGapLargerCssClassName}::-webkit-scrollbar {
            width: ${scrollGapLargerValue}px;
        }
    `);

    expander.style.height = "9999px";

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
