import { STR_WORD_UNDEFINED } from './constants';

/**
 * Gets whether the given (first) argument is a valid DOM scroll padlock element
 * (a div, etc...) or not.
 *
 * @public
 * @example
 * isValidPadlockElement(); // --> throws, not an HTMLElement...
 * isValidPadlockElement(null); // --> throws, not an HTMLElement...
 * isValidPadlockElement({}); // --> throws, not an HTMLElement...
 * isValidPadlockElement(window); // --> false
 * isValidPadlockElement(document); // --> false
 * isValidPadlockElement(document.body); // --> false
 * isValidPadlockElement(document.documentElement); // --> false
 * isValidPadlockElement(document.querySelector('div#my-scrollable-div')); // --> true
 * @throws {TypeError} Throws when the given (first) argument is not
 * a valid DOM scroll padlock element (a div, etc...)
 * nor a global element (window, body, document).
 * @param {Window|Document|HTMLElement} element - The given argument to be checked for its validity
 * as custom scroll padlock element.
 * @param {Window} [window] - The environment client global object.
 * @returns {boolean} Whether the given (first) argument is a valid
 * custom scroll padlock element or not.
 */
const isValidPadlockElement = (element, window = globalThis) => {
  //
  // eslint-disable-next-line valid-typeof
  if (typeof element === STR_WORD_UNDEFINED) {
    //
    return false;
  }

  const {
    document,

    HTMLElement,
  } = window || {};

  const {
    documentElement,

    body,
  } = document || {};

  // Global page (window, html or body as element argument)
  const isElementGlobalScroller = element === window
    || element === document
    || element === documentElement
    || element === body;

  // Scrollable html elements support
  const isElementAnHtmlElement = element instanceof HTMLElement;

  // If the given scrollable element is not supported (valid html element or page)
  // there's nothing to do, but throwing an exception
  if (!isElementGlobalScroller && !isElementAnHtmlElement) {
    throw new TypeError(`Invalid "element" argument (${element}) provided to ScrollPadlock constructor`);
  }

  //
  return !isElementGlobalScroller;
};

export default isValidPadlockElement;
