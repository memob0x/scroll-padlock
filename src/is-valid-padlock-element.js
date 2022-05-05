import {
  win,
  documentElement,
  body,
} from './client';

import { STR_WORD_UNDEFINED } from './constants';

const isValidPadlockElement = (element) => {
  //
  // eslint-disable-next-line valid-typeof
  if (typeof element === STR_WORD_UNDEFINED) {
    //
    return false;
  }

  // Window as element argument support
  const isElementTheWindow = element === win;

  // Scrollable html elements support
  const isElementAnHtmlElement = element instanceof HTMLElement;

  // If the given scrollable element is not supported (valid html element or page)
  // there's nothing to do, but throwing an exception
  if (!isElementTheWindow && !isElementAnHtmlElement) {
    throw new TypeError(`Invalid "element" argument (${element}) provided to ScrollPadlock constructor`);
  }

  // Global page (window, html or body as element argument)
  const isElementGlobalScroller = isElementTheWindow
    || element === documentElement
    || element === body;

  //
  return !isElementGlobalScroller;
};

export default isValidPadlockElement;
