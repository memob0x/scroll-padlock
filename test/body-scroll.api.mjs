import * as Api from "../src/body-scroll.api.mjs";

const html = document.documentElement;
const div = document.createElement("div");
div.style.height = "9999px";

const CSS_VAR_NAME_POSITION = "top-rect";
const CSS_VAR_NAME_GAP = "scrollbar-gap";

const SCROLL_GAP_DEFAULT = 20;
const SCROLL_GAP_LARGER = 60;
const CSS_CLASS_GAP_LARGER = "scrollbar-wider";

const getCssVarVal = name =>
    window
        .getComputedStyle(html)
        .getPropertyValue(`--body-scroll-lock-${name}`)
        .trim();

const style = document.createElement("style");
style.innerHTML = `
    html::-webkit-scrollbar {
        width: ${SCROLL_GAP_DEFAULT}px;
    }
    
    html.${CSS_CLASS_GAP_LARGER}::-webkit-scrollbar {
        width: ${SCROLL_GAP_LARGER}px;
    }
`;

beforeEach(() => {
    html.append(style);

    document.body.append(div);
});

afterEach(() => {
    div.remove();

    style.remove();
});

describe("Api provider module", () => {
    it('should return the boolean status with "isLocked" method', done => {
        expect(Api.isLocked()).to.be.false;

        Api.lock();

        expect(Api.isLocked()).to.be.true;

        Api.unlock();

        expect(Api.isLocked()).to.be.false;

        done();
    });

    it('should write scroll position css variable accordingly during "lock" and "unlock" method calls', done => {
        expect(getCssVarVal(CSS_VAR_NAME_POSITION)).to.equals("");

        Api.lock();

        expect(getCssVarVal(CSS_VAR_NAME_POSITION)).to.equals("0px");

        Api.unlock();

        const scrollPosition = 120;

        window.scrollTo(0, scrollPosition);

        Api.lock();

        expect(getCssVarVal(CSS_VAR_NAME_POSITION)).to.equals(
            `-${scrollPosition}px`
        );

        Api.unlock();

        expect(getCssVarVal(CSS_VAR_NAME_POSITION)).to.equals("");

        done();
    });

    it('should write scrollbar gap css variable accordingly during "lock" and "unlock" method calls', done => {
        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals("");

        Api.lock();

        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_DEFAULT}px`
        );

        Api.unlock();

        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals("");

        done();
    });

    it('should update scrollbar gap css variable accordingly after "update" method calls', done => {
        Api.lock();

        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_DEFAULT}px`
        );

        html.classList.add(CSS_CLASS_GAP_LARGER);

        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_DEFAULT}px`
        );

        Api.update();

        expect(getCssVarVal(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_LARGER}px`
        );

        Api.unlock();

        html.classList.remove(CSS_CLASS_GAP_LARGER);

        done();
    });

    it("should update css variable accordingly after a resize event", done => {
        window.scrollTo(0, 9999);

        Api.lock();

        const cssVarPos = getCssVarVal(CSS_VAR_NAME_POSITION);

        div.remove();

        window.dispatchEvent(new Event("resize"));

        expect(getCssVarVal(CSS_VAR_NAME_POSITION)).to.not.equals(cssVarPos);

        Api.unlock();

        done();
    });
});
