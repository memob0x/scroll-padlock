import { STR_CAMEL_PARENT_ELEMENT } from './constants';

/**
 * Gets the number of ancestors of a given element.
 *
 * @param {HTMLElement} element - The given element to be checked.
 * @returns {number} The number of ancestors of the given element.
 */
const getElementParentsLength = (element) => {
  let count = -1;

  let el = element || {};

  while (el) {
    count += 1;

    el = el[STR_CAMEL_PARENT_ELEMENT];
  }

  return count;
};

export default getElementParentsLength;
