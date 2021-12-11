import 'jsdom-global/register';

import chai from 'chai';

import {
  ADD,
  REMOVE,
} from '../../src/constants';

import listener from '../../src/listener';

const { expect } = chai;

describe('listener', () => {
  const customEventName = 'foobar';

  const div = document.createElement('div');

  it('should be able to dispatch and remove events through shortcut functions', () => {
    let customEventDispatchCount = 0;

    const customEventHandler = () => {
      customEventDispatchCount += 1;
    };

    listener(ADD, div, customEventName, customEventHandler);

    // This event is listened, from 0 to 1
    div.dispatchEvent(new CustomEvent(customEventName));

    expect(customEventDispatchCount).to.equals(1);

    listener(REMOVE, div, customEventName, customEventHandler);

    // This event is not listened, still 1
    div.dispatchEvent(new CustomEvent(customEventName));

    expect(customEventDispatchCount).to.equals(1);
  });
});
