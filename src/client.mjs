//
export const doc = document;
export const html = doc.documentElement;
export const body = doc.body;
export const head = doc.head;

//
export const EVENT_NAME_SCROLL = 'scroll';
export const EVENT_NAME_RESIZE = 'resize';

/**
 * 
 * @param {Window|HTMLElement} element 
 * @param {String} eventName 
 * @param {Function} listener 
 * @param {Object|Boolean} options 
 * @returns {void} Nothing
 */
export const addListener = (element, eventName, listener, options = true) => element.addEventListener(eventName, listener, options);

/**
 * 
 * @param {Window|HTMLElement} element 
 * @param {String} eventName 
 * @param {Function} listener 
 * @param {Object|Boolean} options 
 * @returns {void} Nothing
 */
export const removeListener = (element, eventName, listener, options = true) => element.removeEventListener(eventName, listener, options);
