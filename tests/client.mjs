import { dispatchEvent, eventNamePrefix } from "../src/client.mjs";

describe("client", () => {
    it("should be able to dispatch a prefixed event name", done => {
        const eventName = "foobarrrr";

        const div = document.createElement('div');

        div.addEventListener(`${eventNamePrefix}${eventName}`, () => done(), { once: true });

        dispatchEvent(div, eventName);
    });
});
