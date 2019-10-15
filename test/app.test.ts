import { ThemeBuilder } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { Strategy } from '../src/Theming/Strategy';

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

it('can be configured with the fluent api', async () => {
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

it('has a default configuration', () => {
  const plugin = new ThemeBuilder().defaults();

  expect(plugin.theming).toMatchObject({
    colorVariablePrefix: 'color',
    strategy: 'attribute',
  });
});
