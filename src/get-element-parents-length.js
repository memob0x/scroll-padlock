import getElementParent from './get-element-parent';

/**
 * Gets the number of ancestors of a given element
 * @param {HTMLElement} element The given element to be checked
 * @returns {Number} The number of ancestors of the given element
 */
export default (element) => {
  let count = -1;

  let el = element;

  while (el) {
    count += 1;

    el = getElementParent(el);
  }

  return count;
};
