import { lock, unlock, isLocked } from "./body-scroll.core.mjs";

export default {
    lock: lock,
    unlock: unlock,
    toggle: () => (!isLocked() ? lock() : unlock()),
    isLocked: isLocked
};
