import { setStyle } from 'scroll-padlock'

const cssClassName = 'locked'

const { document } = globalThis

const { scrollingElement } = document

const { classList } = scrollingElement

let globalScrollTop = 0

/**
 * Possibly saves the current scroll position.
 */
function possiblySaveScrollState() {
  if (classList.contains(cssClassName)) {
    return
  }

  globalScrollTop = globalThis.scrollY

  setStyle({
    selector: `.${cssClassName}`,
    element: scrollingElement,
    formatter: ({
      scrollTop = 0,
      offsetWidth = 0,
      clientWidth = 0,
    }) => `--scroll-top: ${scrollTop}px;
--scrollbar-width: ${offsetWidth - clientWidth}px;`,
  })
}

/**
 * Possibly updates the locked scroll state.
 */
function possiblyUpdateLockedScrollState() {
  if (!classList.contains(cssClassName)) {
    return
  }

  classList.remove(cssClassName)

  globalThis.scrollTo(0, globalScrollTop)

  possiblySaveScrollState()

  classList.add(cssClassName)
}

/**
 * Restores the saved scroll position.
 */
function restoreScrollPosition() {
  if (!classList.contains(cssClassName)) {
    globalThis.scrollTo(0, globalScrollTop)
  }
}

const modalInput = document.querySelector('#modal input')

Array.from(document.querySelectorAll('[data-button-name="toggle-scroll-lock"]')).forEach(el => el.addEventListener('click', () => {
  possiblySaveScrollState()

  classList.toggle(cssClassName)

  restoreScrollPosition()

  let focusTarget = document.body

  if (classList.contains(cssClassName)) {
    focusTarget = modalInput
  }

  focusTarget.focus()
}))

Array.from(document.querySelectorAll('[data-button-name="scroll-to-bottom"]')).forEach(el => el.addEventListener('click', () => {
  globalThis.scrollBy(0, 9999)
}))

Array.from(document.querySelectorAll('[data-button-name="scroll-to-top"]')).forEach(el => el.addEventListener('click', () => {
  globalThis.scrollTo(0, 0)
}))

globalThis.addEventListener('resize', () => {
  if (classList.contains(cssClassName)) {
    // Addressing the "ios-keyboard-sub-window-thing offset" bug:
    // locking the page scroll while a programmatic focus
    // on an an input field takes place it makes the keyboard tray to show
    // and that triggers, along with the visual artifact itself, a "resize" event
    // "Re-aligns" the iOS keyboard "sub-window"
    globalThis.scrollTo(0, 0)
  }

  possiblyUpdateLockedScrollState()
})
