const clickOnScrollToBottomButton = (page) => page.evaluate(() => document.querySelector('[data-button-name="scroll-to-bottom"]').click());

export default clickOnScrollToBottomButton;
