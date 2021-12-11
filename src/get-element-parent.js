/**
 * Gets a given element first ancestor if present
 * @param {HTMLElement} element The given element
 * @returns {HTMLElement|null} The element first ancestor or null if not found
 */
export default (element) => element?.parentElement ?? null;
