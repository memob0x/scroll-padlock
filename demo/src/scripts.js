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

document
    .querySelector("button.toggle-custom-scrollbar")
    .addEventListener("click", () => {
        log("toggling custom scrollbars");
        document.body.classList.toggle("custom-scrollbar");
        bodyScroll.update();
    });

window.addEventListener("bodyscrolllock", () => log("body scroll locked"));
window.addEventListener("bodyscrollunlock", () => log("body scroll unlocked"));

// ie11 compliancy
(function() {
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
