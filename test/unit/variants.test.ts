import { NColorVariant, NOpacityVariant, NVariant } from '../../src/api';
import _ from 'lodash';

test('color variants correctly replace colors', () => {
  const hoverVariant = new NColorVariant('hover', 'gray');

  expect(hoverVariant.apply('white').toName()).toBe('gray');
});

test('opacity variants correctly change opacity', () => {
  const hoverVariant = new NOpacityVariant('hover', 0.75);

  expect(hoverVariant.apply('white').toRgbString()).toBe('rgba(255, 255, 255, 0.75)');
});

test('variants correctly replace colors', () => {
  expect(
    new NVariant('', color => color.greyscale().setAlpha(0.75))
      .apply('cyan')
      .toRgbString()
  ).toBe('rgba(128, 128, 128, 0.75)');

  expect(new NVariant('', color => color).apply('cyan').toRgbString()).toBe(
    'rgb(0, 255, 255)'
  );
});
