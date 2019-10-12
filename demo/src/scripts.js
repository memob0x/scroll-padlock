const $html = document.documentElement;
const $console = document.querySelector("#console");

const log = (...message) => {
    console.log && console.log(...message);

    if (!$console.hasChildNodes()) {
        $console.append(document.createElement("ol"));
    }

    const $ol = $console.querySelector("ol");
    const $li = document.createElement("li");
    $li.innerHTML = message;
    $ol.append($li);

    $console.scrollTop = $ol.offsetHeight;
};

document
    .querySelector(".toggle-scroll-lock")
    .addEventListener("click", () => bodyScroll.toggle());

document
    .querySelector("button.toggle-custom-scrollbar")
    .addEventListener("click", () => {
        log("toggling custom scrollbars");
        $html.classList.toggle("custom-scrollbar");
    });

document
    .querySelector("button.toggle-horizontal-orientation")
    .addEventListener("click", () => {
        log("toggling page orientation");
        $html.classList.toggle("horizontal");
    });

window.addEventListener("bodyScrollLock", () => log("body scroll locked"));
window.addEventListener("bodyScrollUnlock", () => log("body scroll unlocked"));
