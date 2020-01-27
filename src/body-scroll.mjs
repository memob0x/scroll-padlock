import { lock, unlock, isLocked, update } from "./body-scroll.api.mjs";

export default {
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    toggle: () => (isLocked() ? unlock() : lock()),
    update: update
};
