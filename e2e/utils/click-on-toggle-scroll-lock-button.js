const clickOnToggleScrollLockButton = (page) => page.evaluate(() => document.querySelector('[data-button-name="toggle-scroll-lock"]').click());

export default clickOnToggleScrollLockButton;
