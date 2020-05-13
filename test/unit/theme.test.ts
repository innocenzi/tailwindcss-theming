import { VariableColor, ColorVariant, VariantType } from '../../src/theme/color';
import { Theme } from '../../src/theme/theme';
import { TinyColor } from '@ctrl/tinycolor';
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

it('find colors by name', () => {
  const theme = new Theme();

  theme.addColors({
    color1: 'blue',
    color2: 'red',
    color3: 'green',
  });

  const single = theme.getColors('color1');
  expect(single.length).toBe(1);
  expect(single[0].getValue().originalInput).toBe('blue');

  const multiple = theme.getColors(['color2', 'color3']);
  expect(multiple.length).toBe(2);
  expect(multiple[0].getValue().originalInput).toBe('red');
  expect(multiple[1].getValue().originalInput).toBe('green');
});

it('registers a global variant on a theme', () => {
  const theme = new Theme();

  theme.addColors({
    color1: 'blue',
    color2: 'cyan',
  });

  theme.addColorVariant('hover', 'cyan');

  theme.getVariants().forEach((variant: ColorVariant) => {
    expect(variant.getName()).toBe('hover');
    expect(variant.getReplacement()).toBe('cyan');
  });
});

it('associates multiple global variants to all colors', () => {
  const theme = new Theme();

  theme.addColors({
    color1: 'green',
    color2: 'red',
  });

  theme.addCustomVariant('to-blue', () => new TinyColor('blue'));
  theme.addCustomVariant('to-cyan', () => new TinyColor('cyan'));

  theme.getColors().forEach(color => {
    expect(
      color.getCustomVariants().map(v => ({
        name: v.getName(),
        value: v.apply(color.getValue()).toRgbString(),
      }))
    ).toStrictEqual([
      {
        name: 'to-blue',
        value: 'rgb(0, 0, 255)',
      },
      {
        name: 'to-cyan',
        value: 'rgb(0, 255, 255)',
      },
    ]);
  });
});

it('associates a variant to a color', () => {
  const theme = new Theme();

  theme.addColors({ color1: 'blue' });
  theme.addColorVariant('hover', 'cyan', 'color1');

  expect(
    theme
      .getColors('color1')
      .shift()
      .getColorVariants()
      .map(v => [v.getName(), v.getReplacement()])
  ).toStrictEqual([['hover', 'cyan']]);
});

it('associates a variant to multiple colors', () => {
  const theme = new Theme();

  theme
    .addColors({
      color1: 'red',
      color2: 'green',
    })
    .addOpacityVariant('focus', 0.5, ['color1', 'color2']);

  theme.getColors(['color1', 'color2']).forEach(color => {
    expect(
      color.getOpacityVariants().map(v => [v.getName(), v.getOpacity()])
    ).toStrictEqual([['focus', 0.5]]);
  });
});

it(`recognizes variants of a variant object`, () => {
  const theme = new Theme();

  theme.addColors({ color1: 'red' }).addVariants({
    focus: 0.5,
    lighten: color => color.lighten(),
    blue: 'blue',
  });

  expect(
    theme.getVariants().map(variant => [variant.getName(), variant.getType()])
  ).toStrictEqual([
    ['focus', VariantType.Opacity],
    ['lighten', VariantType.Custom],
    ['blue', VariantType.Color],
  ]);
});

it(`associates a variant object's variants to their colors`, () => {
  const theme = new Theme();

  theme
    .addColors({
      color1: 'red',
      color2: 'blue',
      color3: 'green',
    })
    .addVariants({
      focus: { variant: 0.5, colors: 'color1' },
      hover: { variant: c => c.darken(), colors: ['color1', 'color2'] },
      yes: { variant: 'blue', colors: 'color3' },
      all: 0.2,
    });

  const color1 = theme.getColors('color1').shift();
  expect(color1.getVariants().map(v => v.getName())).toStrictEqual([
    'focus',
    'hover',
    'all',
  ]);

  const color2 = theme.getColors('color2').shift();
  expect(color2.getVariants().map(v => v.getName())).toStrictEqual(['hover', 'all']);

  const color3 = theme.getColors('color3').shift();
  expect(color3.getVariants().map(v => v.getName())).toStrictEqual(['yes', 'all']);
});
