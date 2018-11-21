import { lock } from './body-scroll.lock.mjs';
import { unlock } from './body-scroll.unlock.mjs';
import { status } from './body-scroll.state.mjs';

export const toggle = () => (!status ? lock() : unlock());
