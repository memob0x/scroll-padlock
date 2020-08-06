import { preparePlayground, clearPlayground } from "./test.mjs";

// TODO: test resize
// TODO: test object should have just the following methods
// lock
// unlock
// isLocked
// updateCssVariables
// getVerticalScrollbarGap
// restoreScrollPosition
// saveScrollPosition
// getSavedScrollPosition

describe("body-scroll", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());
});
