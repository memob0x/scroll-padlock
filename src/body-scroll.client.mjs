export const $head = document.head;
export const $stylerBase = document.createElement('style');
export const $stylerResizable = document.createElement('style');

const isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isMultiTouchMacAkaIOS13 =
    window.navigator.platform === 'MacIntel' &&
    window.navigator.maxTouchPoints > 1;
export const isAppleTouchDevice = isLegacyIOS || isMultiTouchMacAkaIOS13;
