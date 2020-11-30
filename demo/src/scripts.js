const $console = document.querySelector(".console");

const log = (...message) => {
    console?.log(...message);

    let $ol = $console.querySelector("ol");

    if (!$ol) {
        $ol = document.createElement("ol");
        $ol.classList.add("console__list");

        $console.appendChild($ol);
    }

    const $li = document.createElement("li");
    $li.classList.add("console__list__item");

    $li.innerHTML = message;
    $ol.appendChild($li);

    $ol.scrollTop = $ol.scrollHeight;
};

const html = document.documentElement;
const body = document.body;

const isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isMultiTouchMacAkaIOS13 =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;
const isAnyIOS = isLegacyIOS || isMultiTouchMacAkaIOS13;

if (isAnyIOS) {
    html.classList.add("ios");
}

const bodyScroll = new window.ScrollPadlock();

document
    .querySelector(".toggle-scroll-lock")
    .addEventListener("click", () =>
        !bodyScroll.state ? bodyScroll.lock() : bodyScroll.unlock()
    );

const search = document.querySelector(".head__search");
const input = document.querySelector(".head__search__input");

const open = () => {
    html.classList.add('search');

    search.classList.remove("head__search");
    search.classList.add("head__search--in");
    input.classList.remove("head__search__input");
    input.classList.add("head__search--in__input");

    bodyScroll.lock();

    input.focus();
};

const close = () => {
    search.classList.add("head__search");
    search.classList.remove("head__search--in");
    input.classList.add("head__search__input");
    input.classList.remove("head__search--in__input");

    html.classList.remove('search');
    
    bodyScroll.unlock();

    document.body.focus();
};

document.querySelector(".toggle-search-input").addEventListener("click", () => {
    if (!search.classList.contains("head__search__input--in")) {
        open();
    } else {
        close();
    }
});

input.addEventListener("click", close);

html.addEventListener("scrollpadlocklock", () => log("body scroll locked"));
html.addEventListener("scrollpadlockunlock", () => log("body scroll unlocked"));
html.addEventListener("scrollpadlockresize", () => {
    if (isAnyIOS) {
        window.scrollTo(0, 0);
    }
});

// ie11 compliancy
(function () {
    if (typeof window.CustomEvent === "function") {
        return false;
    }

    window.CustomEvent = function (event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };

        const evt = document.createEvent("CustomEvent");

        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );

        return evt;
    };
})();
