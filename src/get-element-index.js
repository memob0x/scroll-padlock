import { STR_CAMEL_PARENT_ELEMENT } from './constants';

/**
 * Gets a given element position (index) in the DOM tree
 * (where 0 is first-child, 1 is second etc...).
 *
 * @public
 * @example
 * getElementIndex(document.documentElement); // --> 0
 * getElementIndex(document.head); // --> 0
 * getElementIndex(document.body); // --> 1
 * @param {HTMLElement} element - The given element to be checked.
 * @returns {number} The position of the given element in the DOM tree.
 */
const getElementIndex = (element) => {
  const siblings = element?.[STR_CAMEL_PARENT_ELEMENT]?.children;

  let count = 0;

  const { length = 0 } = siblings || [];

  for (let i = 0; i < length; i += 1) {
    const sibling = siblings[i];

    if (sibling === element) {
      return count;
    }

    count += 1;
  }

  return count;
};

export default getElementIndex;
