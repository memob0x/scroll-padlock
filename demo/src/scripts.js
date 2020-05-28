const $console = document.querySelector(".console");

const log = (...message) => {
    console.log && console.log(...message);

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

const isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isMultiTouchMacAkaIOS13 =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

if (isLegacyIOS || isMultiTouchMacAkaIOS13) {
    document.documentElement.classList.add("ios");
}

document
    .querySelector(".toggle-scroll-lock")
    .addEventListener("click", () =>
        !bodyScroll.isLocked() ? bodyScroll.lock() : bodyScroll.unlock()
    );

const search = document.querySelector(".head__search");
const input = document.querySelector(".head__search__input");

const open = () => {
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

window.addEventListener("bodyscrolllock", () => log("body scroll locked"));
window.addEventListener("bodyscrollunlock", () => log("body scroll unlocked"));

const toggleCustomScrollbars = () => {
    document.documentElement.classList.toggle("custom-scrollbars");

    bodyScroll.update();
};

// ie11 compliancy
(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );
        return evt;
    }

    window.CustomEvent = CustomEvent;
})();
