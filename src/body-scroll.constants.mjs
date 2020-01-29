export const NAMESPACE = "body-scroll-lock";

export const $head = document.head;
export const $html = document.documentElement;
export const $body = document.body;

export const $style =
    $head.querySelector(`#${NAMESPACE}`) ||
    (() => {
        const $style = document.createElement("style");

        $style.id = NAMESPACE;

        return $style;
    })();

export const supportsCustomEvents = typeof window.CustomEvent === "function";
