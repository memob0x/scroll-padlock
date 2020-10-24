import {
    dispatchEvent,
    eventNamePrefix
} from "../src/body-scroll.client.mjs";

describe("body-scroll.client", () => {
    it("should be able to dispatch a prefixed event name", (done) => {
        const eventName = "foobarrrr";

        const div = document.createElement('div');

        div.addEventListener(`${eventNamePrefix}${eventName}`, () => done());

        dispatchEvent(div, eventName);
    });
});
