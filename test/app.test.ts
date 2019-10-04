import { ThemingPlugin, DefaultThemes } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { OpacityVariant } from '../src/Theming/OpacityVariant';

expect.extend({
  toMatchCss: cssMatcher,
});

const generatePluginCss = async (plugin: ThemingPlugin, config?: any) => {
  const result = await postcss(
    tailwindcss({
      ...{
        theme: {
          ...plugin.getTheme(),
        },
        corePlugins: false,
        plugins: [plugin.getTailwind()],
      },
      ...config,
    })
  ).process('@tailwind base; @tailwind components;', {
    from: undefined,
  });
  return result.css;
};

it('generates root theme', async () => {
  const plugin = new ThemingPlugin({
    default: { type: 'light', colors: [{ name: 'primary', outputFormat: 'rgb', value: '#fff', opacityVariants: [] }] },
  });

  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
      :root {
        --color-primary: 255,255,255;
        --color-scheme: light
      }
  `);
});

it('generates multiple themes', async () => {
  const plugin = new ThemingPlugin({
    default: { type: 'light', colors: [{ name: 'primary', outputFormat: 'rgb', value: '#fff', opacityVariants: [] }] },
    night: { type: 'dark', colors: [{ name: 'primary', outputFormat: 'rgb', value: '#000', opacityVariants: [] }] },
  });

  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-primary: 255,255,255;
      --color-scheme: light
    }
    .theme-night {
      --color-primary: 0,0,0;
      --color-scheme: dark
    }
  `);
});

it('generates variants', async () => {
  const opacityVariants: OpacityVariant[] = [{ name: 'disabled', value: 0.6 }];

  const plugin = new ThemingPlugin({
    default: { type: 'light', colors: [{ name: 'primary', outputFormat: 'rgb', value: '#fff', opacityVariants }] },
  });

  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-primary: 255,255,255;
      --disabled: 0.6;
      --color-scheme: light
    }
  `);
});

it('generates default theme', async () => {
  const plugin = new ThemingPlugin(DefaultThemes);
  const mustContain = Object.keys(plugin.getTheme().colors);
  const css = await generatePluginCss(plugin);

  mustContain.forEach(color => {
    // @ts-ignore
    expect(css.includes(`--${plugin.pluginConfig.colorVariablePrefix}-${color}`)).toBeTruthy();
  });
});
