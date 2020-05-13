import { generateCssConfiguration } from '../../src/util/generateCssConfiguration';
import { TwoLevelColorObject } from '../../src/theme/colors/color';
import { ThemeManager, Theme, VariantsObject } from '../../src/api';
import { Errors } from '../../src/errors';
import _ from 'lodash';

function testCssConfigurationOutputForSingleTheme(
  colors: TwoLevelColorObject,
  variants: VariantsObject,
  output: any
): void {
  const defaultTheme = new Theme()
    .setName('defaultTheme')
    .addColors(colors)
    .addVariants(variants);

  const manager = new ThemeManager().setDefaultTheme(defaultTheme);
  const css = generateCssConfiguration(manager);

  expect(css).toStrictEqual(output);
}

it("generates a default theme's CSS configuration", () => {
  testCssConfigurationOutputForSingleTheme(
    {
      primary: 'blue',
      onPrimary: 'cyan',
    },
    {},
    {
      ':root': {
        '--color-primary': '0, 0, 255',
        '--color-on-primary': '0, 255, 255',
      },
    }
  );
});

it('generates custom variants for every given color', () => {
  testCssConfigurationOutputForSingleTheme(
    {
      primary: 'blue',
      onPrimary: 'cyan',
      navigation: 'red',
    },
    {
      hover: { variant: c => c.lighten(), colors: ['primary'] }, // for primary
      focus: { variant: c => c.lighten(), colors: ['primary', 'onPrimary'] }, // for two
      darken: c => c.lighten(), // for all
    },
    {
      ':root': {
        '--color-navigation': '255, 0, 0',
        '--color-primary': '0, 0, 255',
        '--color-on-primary': '0, 255, 255',

        // darken
        '--custom-variant-navigation-darken': '255, 51, 51, 1',
        '--custom-variant-on-primary-darken': '51, 255, 255, 1',
        '--custom-variant-primary-darken': '51, 51, 255, 1',

        // focus
        '--custom-variant-on-primary-focus': '51, 255, 255, 1',
        '--custom-variant-primary-focus': '51, 51, 255, 1',

        // hover
        '--custom-variant-primary-hover': '51, 51, 255, 1',
      },
    }
  );
});

it('generates color variants for every given color', () => {
  testCssConfigurationOutputForSingleTheme(
    {
      primary: 'blue',
      onPrimary: 'cyan',
      navigation: 'red',
    },
    {
      hover: { variant: 'brown', colors: ['primary'] }, // for primary
      focus: { variant: 'pink', colors: ['primary', 'onPrimary'] }, // for two
      darken: 'green', // for all
    },
    {
      ':root': {
        '--color-navigation': '255, 0, 0',
        '--color-primary': '0, 0, 255',
        '--color-on-primary': '0, 255, 255',

        // darken
        '--color-variant-navigation-darken': '0, 128, 0, 1',
        '--color-variant-on-primary-darken': '0, 128, 0, 1',
        '--color-variant-primary-darken': '0, 128, 0, 1',

        // focus
        '--color-variant-on-primary-focus': '255, 192, 203, 1',
        '--color-variant-primary-focus': '255, 192, 203, 1',

        // hover
        '--color-variant-primary-hover': '165, 42, 42, 1',
      },
    }
  );
});

it('generates opacity variants for every given color', () => {
  testCssConfigurationOutputForSingleTheme(
    {
      primary: 'blue',
      onPrimary: 'cyan',
      navigation: 'red',
    },
    {
      hover: { variant: 0.75, colors: ['primary'] }, // for primary
      focus: { variant: 0.5, colors: ['primary', 'onPrimary'] }, // for two
      darken: 0.1, // for all
    },
    {
      ':root': {
        '--color-navigation': '255, 0, 0',
        '--color-primary': '0, 0, 255',
        '--color-on-primary': '0, 255, 255',

        // darken
        '--opacity-variant-navigation-darken': '0.1',
        '--opacity-variant-on-primary-darken': '0.1',
        '--opacity-variant-primary-darken': '0.1',

        // focus
        '--opacity-variant-on-primary-focus': '0.5',
        '--opacity-variant-primary-focus': '0.5',

        // hover
        '--opacity-variant-primary-hover': '0.75',
      },
    }
  );
});
