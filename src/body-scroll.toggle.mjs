import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { status } from './body-scroll.status.mjs';

export const toggle = () => (!status ? lock() : unlock());
