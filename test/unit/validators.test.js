/**
 * @fileoverview Test validators.
 */

// const testLib = require('../lib/test.lib');
const validators = require('../../app/utils/validators');

describe('UNIT Validators', () => {
  describe('isName()', () => {
    test('"Thanasis" should pass', async () => {
      expect(validators.isName('Thanasis')).toBeTrue();
    });
    test('"Thanasis" should always pass', async () => {
      expect(validators.isName('Thanasis')).toBeTrue();
      expect(validators.isName('Thanasis')).toBeTrue();
      expect(validators.isName('Thanasis')).toBeTrue();
      expect(validators.isName('Thanasis')).toBeTrue();
      expect(validators.isName('Thanasis')).toBeTrue();
    });

    test('"Thanasis Iosif" should pass', async () => {
      expect(validators.isName('Thanasis Iosif')).toBeTrue();
    });
    test('"Kostas-Nikos" should pass', async () => {
      expect(validators.isName('Kostas-Nikos')).toBeTrue();
    });
    test('"Kostas2" should not pass', async () => {
      expect(validators.isName('Kostas2')).toBeFalse();
    });
    test('"$$" should not pass', async () => {
      expect(validators.isName('$$')).toBeFalse();
    });
    test('"Pok/a" should not pass', async () => {
      expect(validators.isName('Pok/a')).toBeFalse();
    });
    test('"Yank+" should not pass', async () => {
      expect(validators.isName('Yank+')).toBeFalse();
    });
  });
});
