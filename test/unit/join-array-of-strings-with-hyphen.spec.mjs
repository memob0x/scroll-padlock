import 'jsdom-global/register.js';

import chai from 'chai';

import joinHyphen from '../../src/join-array-of-strings-with-hyphen.mjs';

const { expect } = chai;

describe('join-array-of-strings-with-hyphen', () => 
    it('should be able to join string fragments with hyphens', () =>
        expect(joinHyphen('foo', 'barr', 1234)).to.equals('foo-barr-1234')
    )
);
