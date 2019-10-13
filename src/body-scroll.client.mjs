// elements involved
export const $head = document.head;
export const $html = document.documentElement;
export const $body = document.body;
export const $style = document.createElement("style");

// Apple devices recognition
const isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isMultiTouchMacAkaIOS13 =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;
export const isAppleTouchDevice = isLegacyIOS || isMultiTouchMacAkaIOS13;
