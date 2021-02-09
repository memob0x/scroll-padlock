/**
 * Concats given string fragments to a single hyphen separated string
 * @param {String[]} args Given string fragment to be concatenated
 * @returns {String} The newly formed string
 */
export default (...args) => args.join('-');
