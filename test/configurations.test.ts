import { ThemeBuilder } from '../src';
import mockConsole from 'jest-mock-console';
import { Strategy } from '../src/Theming/Strategy';
import { Theme, DEFAULT_THEME_NAME } from '../src/Theming/Theme/Theme';
import { Color } from '../src/Theming/Color/Color';
import { getColorConfiguration } from '../src/Theming/Generator/getColorConfiguration';
import { getCssConfiguration } from '../src/Theming/Generator/getCssConfiguration';

function getTestTheme(name?: string) {
  const theme = new Theme()
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    })
    .colorVariant('hover', 'gray', 'primary')
    .colorVariant('blueish', 'blue')
    .opacityVariant('disabled', 0.25, 'secondary')
    .opacityVariant('hidden', 0);

  if (!name) {
    theme.default();
  } else {
    theme.name(name);
  }

  return theme;
}

it('has a default configuration', () => {
  const plugin = new ThemeBuilder().defaults();

  expect(plugin.theming).toMatchObject({
    colorVariablePrefix: 'color',
    strategy: 'attribute',
  });
});

it('can be configured', () => {
  const plugin = new ThemeBuilder()
    .colorVariablePrefix('color')
    .prefix('theme')
    .strategy(Strategy.PrefixedAttribute);

  expect(plugin.theming).toMatchObject({
    prefix: 'theme',
    colorVariablePrefix: 'color',
    strategy: 'prefixed-attribute',
  });
});

it('generates themes without variants', async () => {
  const theme = new Theme()
    .name('night')
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    });

  expect(theme.getName()).toBe('night');
  expect(theme.getColors()).toBeInstanceOf(Array);
  expect(theme.getColors()[0]).toStrictEqual(new Color().name('primary').value('white'));
  expect(theme.getColors()[1]).toStrictEqual(new Color().name('secondary').value('teal'));
  expect(theme.getColors()[2]).toStrictEqual(new Color().name('brand').value('blue'));
});

it('generates default theme', () => {
  const theme = new Theme();

  expect(theme.getName()).toBe(DEFAULT_THEME_NAME);
  expect(theme.getColors()).toBeInstanceOf(Array);
});

it('maps variants to colors', () => {
  const theme = new Theme()
    .name('night')
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    })
    .colorVariant('hover', 'gray', 'primary')
    .colorVariant('blueish', 'blue')
    .opacityVariant('disabled', 0.25, 'secondary')
    .opacityVariant('hidden', 0);

  expect(theme.hasVariant('hover')).toBeTruthy();
  expect(theme.variantsOf('primary').map(v => v.name)).toStrictEqual(['hover', 'blueish', 'hidden']);
  expect(theme.variantsOf('secondary').map(v => v.name)).toStrictEqual(['blueish', 'disabled', 'hidden']);
  expect(theme.variantsOf('brand').map(v => v.name)).toStrictEqual(['blueish', 'hidden']);
});

it('throws without default theme', () => {
  const plugin = new ThemeBuilder().defaults();
  const theme = new Theme()
    .name('night')
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    })
    .colorVariant('hover', 'gray', 'primary')
    .colorVariant('blueish', 'blue')
    .opacityVariant('disabled', 0.25, 'secondary')
    .opacityVariant('hidden', 0);

  plugin.themes([theme]);

  const noDefaultTheme = () => {
    getColorConfiguration([theme], plugin.theming);
  };

  const multipleDefaultThemes = () => {
    getColorConfiguration([theme.default(), theme.default()], plugin.theming);
  };

  expect(noDefaultTheme).toThrowError('There is no default theme.');
  expect(multipleDefaultThemes).toThrowError('There are multiple default themes.');
});

it('generates color configuration', () => {
  const plugin = new ThemeBuilder().defaults();
  const theme = new Theme()
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    })
    .colorVariant('hover', 'gray', 'primary')
    .colorVariant('blueish', 'blue')
    .opacityVariant('disabled', 0.25, 'secondary')
    .opacityVariant('hidden', 0);

  plugin.themes([theme]);

  expect(getColorConfiguration([theme], plugin.theming)).toStrictEqual({
    primary: {
      default: 'rgb(var(--color-primary))',
      hover: 'rgb(var(--color-variant-hover))',
      blueish: 'rgb(var(--color-variant-blueish))',
      hidden: 'rgba(var(--color-primary), var(--opacity-variant-hidden))',
    },
    secondary: {
      default: 'rgb(var(--color-secondary))',
      blueish: 'rgb(var(--color-variant-blueish))',
      disabled: 'rgba(var(--color-secondary), var(--opacity-variant-disabled))',
      hidden: 'rgba(var(--color-secondary), var(--opacity-variant-hidden))',
    },
    brand: {
      default: 'rgb(var(--color-brand))',
      blueish: 'rgb(var(--color-variant-blueish))',
      hidden: 'rgba(var(--color-brand), var(--opacity-variant-hidden))',
    },
  });
});

it('warns at css configuration if a color is set in a theme but not the default theme', () => {
  const restore = mockConsole();
  const plugin = new ThemeBuilder().defaults();

  expect(getCssConfiguration([getTestTheme()], plugin.theming)).toStrictEqual({
    ':root': {
      '--color-primary': '255,255,255',
      '--color-secondary': '0,128,128',
      '--color-brand': '0,0,255',
      '--color-variant-hover': '128,128,128',
      '--color-variant-blueish': '0,0,255',
      '--opacity-variant-hidden': '0',
      '--opacity-variant-disabled': '0.25',
    },
  });

  getCssConfiguration([getTestTheme(), getTestTheme('someOtherTheme').color('pink', 'pink')], plugin.theming);
  expect(console.warn).toHaveBeenLastCalledWith(`Color pink is not defined in the main theme and won't be available in Tailwind utilities.`);
  restore();
});

it('generates css configuration', () => {
  const plugin = new ThemeBuilder().defaults();

  expect(getCssConfiguration([getTestTheme()], plugin.theming)).toStrictEqual({
    ':root': {
      '--color-primary': '255,255,255',
      '--color-secondary': '0,128,128',
      '--color-brand': '0,0,255',
      '--color-variant-hover': '128,128,128',
      '--color-variant-blueish': '0,0,255',
      '--opacity-variant-hidden': '0',
      '--opacity-variant-disabled': '0.25',
    },
  });

  expect(getCssConfiguration([getTestTheme(), getTestTheme('someOtherTheme')], plugin.theming)).toStrictEqual({
    ':root': {
      '--color-primary': '255,255,255',
      '--color-secondary': '0,128,128',
      '--color-brand': '0,0,255',
      '--color-variant-hover': '128,128,128',
      '--color-variant-blueish': '0,0,255',
      '--opacity-variant-hidden': '0',
      '--opacity-variant-disabled': '0.25',
    },
    '[someOtherTheme]': {
      '--color-primary': '255,255,255',
      '--color-secondary': '0,128,128',
      '--color-brand': '0,0,255',
      '--color-variant-hover': '128,128,128',
      '--color-variant-blueish': '0,0,255',
      '--opacity-variant-hidden': '0',
      '--opacity-variant-disabled': '0.25',
    },
  });
});

it('takes strategies into account', () => {
  const plugin = new ThemeBuilder().defaults();
  const getSimpleTheme = () => new Theme().color('white', 'white');

  const shouldThrow = () => {
    getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.PrefixedClass).theming);
  };

  expect(shouldThrow).toThrowError('Strategy is set to prefixed class but no prefix is defined.');

  expect(getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.PrefixedClass).prefix('my-theme').theming)).toStrictEqual({
    ':root': {
      '--color-white': '255,255,255',
    },
    '.my-theme-foo': {
      '--color-white': '255,255,255',
    },
  });

  expect(getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.PrefixedAttribute).prefix('my-theme').theming)).toStrictEqual({
    ':root': {
      '--color-white': '255,255,255',
    },
    '[my-theme-foo]': {
      '--color-white': '255,255,255',
    },
  });

  expect(getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.DataAttribute).theming)).toStrictEqual({
    ':root': {
      '--color-white': '255,255,255',
    },
    '[data-foo]': {
      '--color-white': '255,255,255',
    },
  });

  expect(getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.Class).theming)).toStrictEqual({
    ':root': {
      '--color-white': '255,255,255',
    },
    '.foo': {
      '--color-white': '255,255,255',
    },
  });

  expect(getCssConfiguration([getSimpleTheme().default(), getSimpleTheme().name('foo')], plugin.strategy(Strategy.DataThemeAttribute).theming)).toStrictEqual({
    ':root': {
      '--color-white': '255,255,255',
    },
    '[data-theme=foo]': {
      '--color-white': '255,255,255',
    },
  });
});
