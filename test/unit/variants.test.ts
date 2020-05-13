import {
  OpacityVariant,
  ColorVariant,
  CustomVariant,
} from '../../src/theme/colors/color';
import _ from 'lodash';

test('color variants correctly replace colors', () => {
  const hoverVariant = new ColorVariant('hover', 'gray');

  expect(hoverVariant.apply('white').toName()).toBe('gray');
});

test('opacity variants correctly change opacity', () => {
  const hoverVariant = new OpacityVariant('hover', 0.75);

  expect(hoverVariant.apply('white').toRgbString()).toBe('rgba(255, 255, 255, 0.75)');
});

test('variants correctly replace colors', () => {
  expect(
    new CustomVariant('', color => color.greyscale().setAlpha(0.75))
      .apply('cyan')
      .toRgbString()
  ).toBe('rgba(128, 128, 128, 0.75)');

  expect(new CustomVariant('', color => color).apply('cyan').toRgbString()).toBe(
    'rgb(0, 255, 255)'
  );
});
