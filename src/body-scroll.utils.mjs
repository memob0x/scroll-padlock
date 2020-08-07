/**
 * Checks whether a given value is a valid number or not
 * @static
 * @private
 * @param {any} value The given value to be checked
 * @returns {Boolean} True if the given value is a number
 */
export const isNumber = (value) =>
    typeof value === "number" && !isNaN(value) && isFinite(value);
