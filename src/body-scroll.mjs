let status = false;
const lock = () => {}
const unlock = () => {}

export default {
    lock: lock,
    unlock: unlock,
    toggle: () => (!status ? lock() : unlock()),
    isLocked: () => status
};
