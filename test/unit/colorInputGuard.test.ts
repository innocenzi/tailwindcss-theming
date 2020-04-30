import { isColorInput } from '../../src/theme/colors/isColorInput';
import { TinyColor } from '@ctrl/tinycolor';
import _ from 'lodash';

const types = {
  rgb: { r: 0, g: 0, b: 0 },
  rgba: { r: 0, g: 0, b: 0, a: 0 },
  hsl: { h: 0, s: 0, l: 0 },
  hsla: { h: 0, s: 0, l: 0, a: 0 },
  hsv: { h: 0, s: 0, v: 0 },
  hslv: { h: 0, s: 0, v: 0, a: 0 },
};

Object.entries(types).forEach(([type, value]) => {
  it(`recognizes ${type}`, () => {
    expect(isColorInput(value)).toBe(true);
  });
});

it('recognizes string', () => {
  expect(isColorInput('#fff')).toBe(true);
});

it('recognizes TinyColor object', () => {
  expect(isColorInput(new TinyColor('white'))).toBe(true);
});

it('does not recognize non-color inputs', () => {
  expect(isColorInput({})).toBe(false);
  expect(isColorInput({ someKey: 'someValue' })).toBe(false);
});
