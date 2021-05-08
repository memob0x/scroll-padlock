/**
 * Registers or unregisters an event listener
 * @param {String} method Whether is a registration or an unregistration method (accepts "add" or "remove")
 * @param {Window|HTMLElement} element The given element target of the event listener
 * @param {String} eventName The event listener name
 * @param {Function} listener The event handler
 * @param {Object|Boolean} options The event listener options object (or boolean to address "passive" property only)
 * @returns {void} Nothing
 */
export default (method, element, eventName, listener, options = true) => element?.[`${method}EventListener`](eventName, listener, options);
