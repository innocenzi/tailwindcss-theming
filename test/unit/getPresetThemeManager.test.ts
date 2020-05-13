import { getPresetThemeManager } from '../../src/util/getPresetThemeManager';
import { Errors } from '../../src/errors';
import { presets } from '../../src/presets';

it('throws an error if an unknown preset name is used', () => {
  // @ts-ignore
  const t = () => getPresetThemeManager('this-is-an-unknown-preset');

  expect(t).toThrowError(new RegExp(Errors.UNKOWN_PRESET));
});

it('returns the preset corresponding to the given name', () => {
  const nord = getPresetThemeManager('nord');

  expect(nord).toBe(presets.nord);
});
