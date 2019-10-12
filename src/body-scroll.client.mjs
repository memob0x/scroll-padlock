export const $head = document.head;
export const $stylerBase = document.createElement('style');
export const $stylerResizable = document.createElement('style');

const isLegacyIOS = /iPad|iPhone|iPod/.test(navigator.platform);
const isMultiTouchMac =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1; // aka iOS >= 13
export const isAppleTouchDevice = isLegacyIOS && isMultiTouchMac;
