import getElementParent from './get-element-parent';

/**
 * Gets a given element position (index) in the DOM tree
 * (where 0 is first-child, 1 is second etc...)
 * @param {HTMLElement} element The given element to be checked
 * @returns {Number} The position of the given element in the DOM tree
 */
export default (element) => {
  const siblings = getElementParent(element)?.children ?? [];

  let count = 0;

  for (let i = 0, j = siblings.length; i < j; i += 1) {
    const sibling = siblings[i];

    if (sibling === element) {
      return count;
    }

    count += 1;
  }

  return count;
};
