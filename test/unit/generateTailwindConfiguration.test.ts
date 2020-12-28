import { generateTailwindConfiguration } from '../../src/util/generateTailwindConfiguration';
import { ColorObject } from '../../src/theme/color';
import { ThemeManager, Theme } from '../../src/theme/theme';
import { Errors } from '../../src/errors';
import _ from 'lodash';

function testColorOutput(input: ColorObject, output: any): void {
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

it('throws an error if no theme exists', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation();
  expect(() => generateTailwindConfiguration(new ThemeManager())).toThrow(
    Errors.NO_THEME
  );
  spy.mockRestore();
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
    primary: { DEFAULT: 'rgba(var(--color-primary), 1)' },
    'on-primary': { DEFAULT: 'rgba(var(--color-on-primary), 1)' },
  });
});

it("generates a default theme's nested color configuration", () => {
  testColorOutput(
    {
      primary: {
        DEFAULT: 'green',
        hover: 'blue',
        focus: 'red',
      },
      onPrimary: 'cyan',
    },
    {
      primary: { DEFAULT: 'rgba(var(--color-primary), 1)' },
      'on-primary': { DEFAULT: 'rgba(var(--color-on-primary), 1)' },
      'primary-focus': { DEFAULT: 'rgba(var(--color-primary-focus), 1)' },
      'primary-hover': { DEFAULT: 'rgba(var(--color-primary-hover), 1)' },
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
      primary: { DEFAULT: 'rgba(var(--color-primary), 0.75)' },
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

it('handles multi-word variable names', () => {
  testExtendOutput(
    new Theme().setVariable('sans-serif', ['Roboto', 'Arial'], 'fontFamily', 'font'),
    {
      fontFamily: {
        'sans-serif': 'var(--font-sans-serif)',
      },
    }
  );
});
