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

    $ol.scrollTo(0, $ol.scrollHeight);
};

document
    .querySelector(".toggle-scroll-lock")
    .addEventListener("click", () => bodyScroll.toggle());

document
    .querySelector("button.toggle-custom-scrollbar")
    .addEventListener("click", () => {
        log("toggling custom scrollbars");
        document.body.classList.toggle("custom-scrollbar");
    });

window.addEventListener("bodyScrollLock", () => log("body scroll locked"));
window.addEventListener("bodyScrollUnlock", () => log("body scroll unlocked"));
