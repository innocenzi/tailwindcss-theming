import { generateTailwindConfiguration } from '../../src/util/generateTailwindConfiguration';
import { TwoLevelColorObject } from '../../src/theme/colors/colorObject';
import { ThemeManager, Theme } from '../../src/api';
import { Errors } from '../../src/errors';
import _ from 'lodash';

function testThemeOutput(input: TwoLevelColorObject, output: any): void {
  const defaultTheme = new Theme().setName('defaultTheme').addColors(input);
  const manager = new ThemeManager().setDefaultTheme(defaultTheme);
  const { theme } = generateTailwindConfiguration(manager);
  const { colors } = theme;

  expect(colors).toStrictEqual(output);
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
  testThemeOutput(
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

  testThemeOutput(
    {
      primary: 'rgba(0, 0, 0, 0.75)',
    },
    {
      primary: { default: 'rgba(var(--color-primary), 0.75)' },
    }
  );
});
