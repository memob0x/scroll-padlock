import { expect } from 'chai';
import sanitizePadlockOptions from '../../src/sanitize-padlock-options';

describe('src/is-valid-padlock-element', () => {
  it('should be able to format and sanitize valid padlock instance options (throwing when invalid argument type is passed)', () => {
    expect(() => sanitizePadlockOptions([])).to.throw(TypeError);
    expect(() => sanitizePadlockOptions(1)).to.throw(TypeError);
    expect(() => sanitizePadlockOptions('')).to.throw(TypeError);

    expect(() => sanitizePadlockOptions()).to.not.throw(TypeError);
    expect(sanitizePadlockOptions()).to.deep.equals({ cssClassName: undefined });

    expect(() => sanitizePadlockOptions({})).to.not.throw(TypeError);
    expect(sanitizePadlockOptions({})).to.deep.equals({ cssClassName: undefined });

    expect(() => sanitizePadlockOptions(null)).to.not.throw(TypeError);
    expect(sanitizePadlockOptions(null)).to.deep.equals({ cssClassName: undefined });

    expect(() => sanitizePadlockOptions('fee')).to.not.throw(TypeError);
    expect(sanitizePadlockOptions('fee')).to.deep.equals({ cssClassName: 'fee' });

    expect(() => sanitizePadlockOptions({ a: 'b' })).to.not.throw(TypeError);
    expect(sanitizePadlockOptions({ a: 'b' })).to.deep.equals({ cssClassName: undefined, a: 'b' });
  });
});
