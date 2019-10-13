import { isAppleTouchDevice } from "../src/body-scroll.client.mjs";
import bodyScroll from "../src/body-scroll.mjs";

before(() => {
    bodyScroll.setOption("alwaysUsePositionFixedTechnique", true);
});

after(() => {
    bodyScroll.setOption("alwaysUsePositionFixedTechnique", false);
});

describe("On Apple devices", () => {
    it("should print different apple-specific rules", done => {
        // TODO:

        done();
    });

    it("should save and restore the scroll position", done => {
        // TODO:

        done();
    });

    it("should detect apple devices", done => {
        // Apple iPhone iOS 12
        expect(
            isAppleTouchDevice(
                "Mozilla/5.0 (iPod; CPU iPhone OS 12_0 like macOS) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/12.0 Mobile/14A5335d Safari/602.1.50",
                "iOS",
                2
            )
        ).to.be.true;

        // Apple iPad iOS 13
        expect(
            isAppleTouchDevice(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15  ",
                "MacIntel",
                2
            )
        ).to.be.true;

        // Android Nexus 5X
        expect(
            isAppleTouchDevice(
                "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Mobile Safari/537.36",
                "Android",
                2
            )
        ).to.be.false;

        // Linux PC
        expect(
            isAppleTouchDevice(
                "Mozilla/5.0 (X11; U; Linux i686; pt-BR; rv:1.9.0.15) Gecko/2009102815 Ubuntu/9.04 (jaunty) Firefox/3.0.15",
                "Linux",
                1
            )
        ).to.be.false;

        done();
    });
});
