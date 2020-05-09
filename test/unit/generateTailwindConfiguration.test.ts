import { generateTailwindConfiguration } from '../../src/util/generateTailwindConfiguration';
import { TwoLevelColorObject } from '../../src/theme/colors/colorObject';
import { ThemeManager, Theme } from '../../src/api';
import { Errors } from '../../src/errors';
import _ from 'lodash';

function testColorOutput(input: TwoLevelColorObject, output: any): void {
  const defaultTheme = new Theme().setName('defaultTheme').addColors(input);
  const manager = new ThemeManager().setDefaultTheme(defaultTheme);
  const { theme } = generateTailwindConfiguration(manager);
  const { colors } = theme;

  expect(colors).toStrictEqual(output);
}

function testExtendOutput(inputTheme: Theme, output: any): void {
  const manager = new ThemeManager().setDefaultTheme(inputTheme);
  const { theme } = generateTailwindConfiguration(manager);

  expect(theme.extend).toStrictEqual(output);
}

it('throws an error if no default theme exists', () => {
  expect(() => generateTailwindConfiguration(new ThemeManager())).toThrow(
    Errors.NO_DEFAULT_THEME
  );
});

it("generates a default theme's color configuration", () => {
  const defaultTheme = new Theme().setName('defaultTheme').addColors({
    primary: 'blue',
    onPrimary: 'cyan',
  });

  const manager = new ThemeManager().setDefaultTheme(defaultTheme);
  const { theme } = generateTailwindConfiguration(manager);
  const { colors } = theme;

  expect(colors).toStrictEqual({
    primary: { default: 'rgba(var(--color-primary), 1)' },
    'on-primary': { default: 'rgba(var(--color-on-primary), 1)' },
  });
});

it("generates a default theme's nested color configuration", () => {
  testColorOutput(
    {
      primary: {
        default: 'green',
        hover: 'blue',
        focus: 'red',
      },
      onPrimary: 'cyan',
    },
    {
      primary: { default: 'rgba(var(--color-primary), 1)' },
      'on-primary': { default: 'rgba(var(--color-on-primary), 1)' },
      'primary-focus': { default: 'rgba(var(--color-primary-focus), 1)' },
      'primary-hover': { default: 'rgba(var(--color-primary-hover), 1)' },
    }
  );
});

it('does not generate hardcoded opacity in color configurations', () => {
  // TODO - When PR passes, implement Tailwind-based opacity handling
  // https://github.com/tailwindcss/tailwindcss/pull/1676

  testColorOutput(
    {
      primary: 'rgba(0, 0, 0, 0.75)',
    },
    {
      primary: { default: 'rgba(var(--color-primary), 0.75)' },
    }
  );
});

it('extends Tailwind', () => {
  testExtendOutput(new Theme().setVariable('sans', ['Roboto', 'Arial'], 'fontFamily'), {
    fontFamily: {
      sans: 'var(--sans)',
    },
  });
});
