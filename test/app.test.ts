import { ThemeBuilder } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { Strategy } from '../src/Theming/Strategy';
import { Theme, DEFAULT_THEME_NAME } from '../src/Theming/Theme/Theme';
import { Color } from '../src/Theming/Color/Color';
import { getColorConfiguration } from '../src/Theming/Generator/getColorConfiguration';

expect.extend({
  toMatchCss: cssMatcher,
});

const generatePluginCss = async (builder: ThemeBuilder, config?: any, base: boolean = true, components: boolean = true, utilities: boolean = false) => {
  const process = (base ? '@tailwind base; ' : '') + (components ? '@tailwind components; ' : '') + (utilities ? '@tailwind utilities; ' : '');
  const result = await postcss(
    tailwindcss({
      ...{
        corePlugins: false,
        plugins: [builder.plugin()],
      },
      ...config,
    })
  ).process(process, {
    from: undefined,
  });
  return result.css;
};

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
    .dark()
    .colors({
      primary: 'white',
      secondary: 'teal',
      brand: 'blue',
    });

  expect(theme.getName()).toBe('night');
  expect(theme.scheme).toBe('dark');
  expect(theme.getColors()).toBeInstanceOf(Array);
  expect(theme.getColors()[0]).toStrictEqual(new Color().name('primary').value('white'));
  expect(theme.getColors()[1]).toStrictEqual(new Color().name('secondary').value('teal'));
  expect(theme.getColors()[2]).toStrictEqual(new Color().name('brand').value('blue'));
});

it('generates default theme', () => {
  const theme = new Theme();

  expect(theme.getName()).toBe(DEFAULT_THEME_NAME);
  expect(theme.scheme).toBe('light');
  expect(theme.getColors()).toBeInstanceOf(Array);
});

it('maps variants to colors', () => {
  const theme = new Theme()
    .name('night')
    .dark()
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

it('generates color configuration', () => {
  const plugin = new ThemeBuilder().defaults();
  const theme = new Theme()
    .dark()
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

  expect(getColorConfiguration([theme], plugin.theming)).toMatchObject({
    colors: {
      primary: {
        hover: 'rgb(var(--color-variant-hover))',
        blueish: 'rgb(var(--color-variant-blueish))',
        hidden: 'rgba(var(--color-primary), var(--opacity-variant-hidden))',
      },
      secondary: {
        blueish: 'rgb(var(--color-variant-blueish))',
        disabled: 'rgba(var(--color-secondary), var(--opacity-variant-disabled))',
        hidden: 'rgba(var(--color-secondary), var(--opacity-variant-hidden))',
      },
      brand: {
        blueish: 'rgb(var(--color-variant-blueish))',
        hidden: 'rgba(var(--color-brand), var(--opacity-variant-hidden))',
      },
    },
  });
});
