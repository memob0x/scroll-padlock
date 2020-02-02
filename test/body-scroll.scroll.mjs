import * as Scroll from "../src/body-scroll.scroll.mjs";

const div = document.createElement("div");
div.style.height = "9999px";

beforeEach(() => document.body.append(div));

afterEach(() => div.remove());

describe("Scroll saver module", () =>
    it("should save and restore body scroll position", done => {
        const SCROLL_Y = 120;

        window.scrollTo(0, SCROLL_Y);

        Scroll.save();

        expect(window.pageYOffset).to.equals(SCROLL_Y);

        window.scrollTo(0, 9999);

        expect(window.pageYOffset).to.greaterThan(SCROLL_Y);

        Scroll.restore();

        expect(window.pageYOffset).to.equals(SCROLL_Y);

        done();
    }));
