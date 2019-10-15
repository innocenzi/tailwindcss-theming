import { ThemeBuilder } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { Strategy } from '../src/Theming/Strategy';
import { Theme, DEFAULT_THEME_NAME } from '../src/Theming/Theme/Theme';
import { Color } from '../src/Theming/Color/Color';

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

  expect(theme.name()).toBe('night');
  expect(theme.scheme).toBe('dark');
  expect(theme.colors()).toBeInstanceOf(Array);
  expect(theme.colors()[0]).toStrictEqual(new Color().name('primary').value('white'));
  expect(theme.colors()[1]).toStrictEqual(new Color().name('secondary').value('teal'));
  expect(theme.colors()[2]).toStrictEqual(new Color().name('brand').value('blue'));
});

it('generates default theme', () => {
  const theme = new Theme();

  expect(theme.name()).toBe(DEFAULT_THEME_NAME);
  expect(theme.scheme).toBe('light');
  expect(theme.colors()).toBeInstanceOf(Array);
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
    .opacityVariant('disabled', .25, 'secondary')
    .opacityVariant('hidden', 0);

  expect(theme.hasVariant('hover')).toBeTruthy();
  expect(theme.variantsOf('primary')).toStrictEqual([ 'hover', 'blueish', 'hidden' ]);
  expect(theme.variantsOf('secondary')).toStrictEqual([ 'blueish', 'disabled', 'hidden' ]);
  expect(theme.variantsOf('brand')).toStrictEqual([ 'blueish', 'hidden' ]);
});
