const cssClassName = 'locked';

const { scrollingElement } = document;

const { classList } = scrollingElement;

let scrollTop = 0;

/**
 * Possibly saves the current scroll position.
 */
function possiblySaveScrollState() {
  if (classList.contains(cssClassName)) {
    return;
  }

  scrollTop = window.scrollY;

  window.scrollPadlock.setStyle({
    selector: `.${cssClassName}`,
    element: scrollingElement,
  });
}

/**
 * Possibly updates the locked scroll state.
 */
function possiblyUpdateLockedScrollState() {
  if (!classList.contains(cssClassName)) {
    return;
  }

  classList.remove(cssClassName);

  window.scrollTo(0, scrollTop);

  possiblySaveScrollState();

  classList.add(cssClassName);
}

/**
 * Restores the saved scroll position.
 */
function restoreScrollPosition() {
  if (!classList.contains(cssClassName)) {
    window.scrollTo(0, scrollTop);
  }
}

Array.from(document.querySelectorAll('[data-button-name="toggle-scroll-lock"]')).forEach((el) => el.addEventListener('click', () => {
  possiblySaveScrollState();

  classList.toggle(cssClassName);

  restoreScrollPosition();
}));

Array.from(document.querySelectorAll('[data-button-name="scroll-to-bottom"]')).forEach((el) => el.addEventListener('click', () => {
  window.scrollBy(0, 9999);
}));

Array.from(document.querySelectorAll('[data-button-name="scroll-to-top"]')).forEach((el) => el.addEventListener('click', () => {
  window.scrollTo(0, 0);
}));

window.addEventListener('resize', possiblyUpdateLockedScrollState);
