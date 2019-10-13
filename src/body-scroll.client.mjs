// elements involved
export const $head = document.head;
export const $html = document.documentElement;
export const $body = document.body;
export const $style = document.createElement("style");

/**
 * Apple devices recognizer
 * @param {string} userAgent The browser user agent
 * @param {string} platform The device platform (eg. window.navigator.platform)
 * @param {number} maxTouchPoints The device maximum touch points supported
 * @returns {boolean} True if is an apple touch device
 */
export const isAppleTouchDevice = (
    userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    maxTouchPoints = window.navigator.maxTouchPoints
) => {
    const isLegacyIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isMultiTouchMacAkaIOS13 =
        platform === "MacIntel" && maxTouchPoints > 1;
    return isLegacyIOS || isMultiTouchMacAkaIOS13;
};

export const shouldUsePositionFixedTechnique = isAppleTouchDevice();
