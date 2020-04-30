import {
  VariableColor,
  Theme,
  ColorVariant,
  OpacityVariant,
  CustomVariant,
} from '../../src/api';
import _ from 'lodash';

it('flattens color object', () => {
  const theme = new Theme();

  theme.addColors({
    blue: {
      primary: 'blue',
      secondary: 'cyan',
    },
    white: '#fff',
    black: 'black',
    rgb: { r: 0, g: 0, b: 0 },
  });

  expect(theme.getColors()).toStrictEqual([
    new VariableColor('blue-primary', 'blue'),
    new VariableColor('blue-secondary', 'cyan'),
    new VariableColor('white', '#fff'),
    new VariableColor('black', 'black'),
    new VariableColor('rgb', { r: 0, g: 0, b: 0 }),
  ]);
});

it('handles variants by name', () => {
  const theme = new Theme();

  theme.addColors({
    color1: 'blue',
    color2: 'red',
    color3: 'green',
  });

  theme.addColorVariant('hover', 'cyan', 'color1');
  theme.addOpacityVariant('focus', 0.5, ['color2', 'color3']);

  expect(
    theme
      .getColors()
      .find(c => c.getName() === 'color1')
      .getColorVariants()
  ).toStrictEqual([new ColorVariant('hover', 'cyan')]);

  expect(
    _.flatten(
      theme
        .getColors()
        .filter(c => ['color2', 'color3'].includes(c.getName()))
        .map(color => color.getOpacityVariants())
    )
  ).toStrictEqual([new OpacityVariant('focus', 0.5), new OpacityVariant('focus', 0.5)]);
});

it('handles global variants', () => {
  const theme = new Theme();

  theme.addColors({
    color1: 'blue',
    color2: 'red',
    color3: 'green',
  });

  theme.addColorVariant('hover', 'cyan');

  expect(theme.getVariants()).toStrictEqual([
    new ColorVariant('hover', 'cyan'),
    new ColorVariant('hover', 'cyan'),
    new ColorVariant('hover', 'cyan'),
  ]);
});
