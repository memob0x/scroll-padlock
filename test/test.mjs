export const html = document.documentElement;
const div = document.createElement("div");
div.style.height = "9999px";

export const CSS_VAR_NAME_POSITION = "top-rect";
export const CSS_VAR_NAME_GAP = "scrollbar-gap";

export const SCROLL_GAP_DEFAULT = 20;
export const SCROLL_GAP_LARGER = 60;
export const CSS_CLASS_GAP_LARGER = "scrollbar-wider";

export const getCssVarVal = name =>
    window
        .getComputedStyle(html)
        .getPropertyValue(`--body-scroll-lock-${name}`)
        .trim();

export const style = document.createElement("style");

style.innerHTML = `
    html::-webkit-scrollbar {
        width: ${SCROLL_GAP_DEFAULT}px;
    }
    
    html.${CSS_CLASS_GAP_LARGER}::-webkit-scrollbar {
        width: ${SCROLL_GAP_LARGER}px;
    }
`;
