import { lock, unlock, isLocked, resize } from "./body-scroll.core.mjs";

document.addEventListener("resize", resize);

export default {
    lock: lock,
    unlock: unlock,
    toggle: () => (!isLocked() ? lock() : unlock()),
    isLocked: isLocked,
    update: resize
};
