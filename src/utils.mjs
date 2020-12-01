/**
 * Checks whether a given value is a valid number or not
 * @param {any} value The given value to be checked
 * @returns {Boolean} True if the given value is a number
 */
export const isNumber = value => typeof value === "number" && !isNaN(value) && isFinite(value);

/**
 * Transform the first character to uppercase
 * Intentionally simple, doesn't check for leading empty character nor multiple words etc
 * @param {String} string The given word to be capitalized
 * @returns {String} The given word, capitalized
 */
export const capitalizeWord = string => string.charAt(0).toUpperCase() + string.slice(1, string.length);
