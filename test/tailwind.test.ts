import { ThemeBuilder } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { Theme } from '../src/Theming/Theme/Theme';
import { Strategy } from '../src/Theming/Strategy';
import { generateTheme } from './themeGenerator';
import { tryStatement } from '@babel/types';
import { getThemeConfiguration } from '../src/Theming/Generator/getThemeConfiguration';

expect.extend({
  toMatchCss: cssMatcher,
});

const generatePluginCss = async (
  builder: ThemeBuilder,
  config?: any,
  base: boolean = true,
  components: boolean = true,
  utilities: boolean = false,
  plugins: string[] | false = false
) => {
  const process = (base ? '@tailwind base; ' : '') + (components ? '@tailwind components; ' : '') + (utilities ? '@tailwind utilities; ' : '');
  const result = await postcss(
    tailwindcss({
      ...config,
      theme: {
        screens: false,
      },
      variants: [],
      corePlugins: plugins,
      plugins: [builder.plugin()],
    })
  ).process(process, {
    from: undefined,
  });
  return result.css;
};

it('generates root theme', async () => {
  const plugin = new ThemeBuilder().defaults().themes([generateTheme({ isDefault: true }).color('white', 'white')]);
  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-white: 255,255,255
    }
  `);
});

it('generates root theme with multiple colors', async () => {
  const plugin = new ThemeBuilder().defaults().themes([
    generateTheme({ isDefault: true }).colors({
      transparent: 'transparent',
      primary: 'white',
      secondary: '#000',
      tertiary: 'blue',
      quaternary: '#ffffff1e',
    }),
  ]);
  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-transparent: 0,0,0;
      --color-primary: 255,255,255;
      --color-secondary: 0,0,0;
      --color-tertiary: 0,0,255;
      --color-quaternary: 255,255,255
    }
  `);
});

it('generates custom css properties', async () => {
  const plugin = new ThemeBuilder().defaults().themes([
    generateTheme({ isDefault: true })
      .variable('int-var', 1)
      .variable('float-var', 1.2)
      .variable('array-var', ['value1', 'value2', 1, 1.2, 'spaced text', '"spaced quote"'])
      .variable('str-var', 'hello')
      .variable('color-var', '#ffffff')
      .variable('mixed-var', '3px 6px rgb(20, 32, 54)')
      .variable('differentCaseVar', 'hello'),
  ]);
  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --int-var: 1;
      --float-var: 1.2;
      --array-var: value1,value2,1,1.2,spaced text,"spaced quote";
      --str-var: hello;
      --color-var: #ffffff;
      --mixed-var: 3px 6px rgb(20, 32, 54);
      --different-case-var: hello
    }
  `);
});

it('generates a tailwind configuration extension', async () => {
  const plugin = new ThemeBuilder().defaults();
  const theme = new Theme()
    .default()
    .variable('title', ['Roboto', '"Segoe UI"'], 'fontFamily', 'font')
    .variable('huge', '64px', 'spacing', 'spacing');

  plugin.themes([theme]);

  const css = await generatePluginCss(plugin, undefined, true, true, true, [ 'fontFamily' ]);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --font-title: Roboto,"Segoe UI";
      --spacing-huge: 64px
    }
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" }
    .font-serif { font-family: Georgia, Cambria, "Times New Roman", Times, serif }
    .font-mono { font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace }
    .font-title { font-family: var(--font-title) }
  `);
});

it('generates utilities with multiple colors', async () => {
  const plugin = new ThemeBuilder().defaults().themes([
    generateTheme({ isDefault: true }).colors({
      transparent: 'transparent',
      primary: 'white',
      secondary: '#000',
      tertiary: 'blue',
      quaternary: '#ffffff1e',
    }),
  ]);
  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-transparent: 0,0,0;
      --color-primary: 255,255,255;
      --color-secondary: 0,0,0;
      --color-tertiary: 0,0,255;
      --color-quaternary: 255,255,255
    }
    .text-transparent { color: rgba(var(--color-transparent), 0) }
    .text-primary { color: rgb(var(--color-primary)) }
    .text-secondary { color: rgb(var(--color-secondary)) }
    .text-tertiary { color: rgb(var(--color-tertiary)) }
    .text-quaternary { color: rgba(var(--color-quaternary), 0.11764705882352941) }
  `);
});

it('generates utilities with multiple colors and their variants', async () => {
  const plugin = new ThemeBuilder().defaults().themes([
    new Theme()
      .default()
      .colors({
        transparent: 'transparent',
        primary: 'white',
        secondary: '#000',
        tertiary: 'blue',
        quaternary: '#ffffff1e',
      })
      .colorVariant('actually-black', 'black')
      .colorVariant('darker', 'gray', ['primary'])
      .opacityVariant('disabled', 0)
      .opacityVariant('less-opaque', 0.7, ['secondary', 'tertiary']),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-transparent: 0, 0, 0;
      --color-primary: 255, 255, 255;
      --color-secondary: 0, 0, 0;
      --color-tertiary: 0, 0, 255;
      --color-quaternary: 255, 255, 255;
      --color-variant-actually-black: 0, 0, 0;
      --opacity-variant-disabled: 0;
      --color-variant-darker: 128, 128, 128;
      --opacity-variant-less-opaque: 0.7
    }
    .text-transparent { color: rgba(var(--color-transparent), 0) } 
    .text-transparent-actually-black { color: rgb(var(--color-variant-actually-black)) } 
    .text-transparent-disabled { color: rgba(var(--color-transparent), var(--opacity-variant-disabled)) } 
    .text-primary { color: rgb(var(--color-primary)) } 
    .text-primary-actually-black { color: rgb(var(--color-variant-actually-black)) } 
    .text-primary-darker { color: rgb(var(--color-variant-darker)) } 
    .text-primary-disabled { color: rgba(var(--color-primary), var(--opacity-variant-disabled)) } 
    .text-secondary { color: rgb(var(--color-secondary)) } 
    .text-secondary-actually-black { color: rgb(var(--color-variant-actually-black)) } 
    .text-secondary-disabled { color: rgba(var(--color-secondary), var(--opacity-variant-disabled)) } 
    .text-secondary-less-opaque { color: rgba(var(--color-secondary), var(--opacity-variant-less-opaque)) } 
    .text-tertiary { color: rgb(var(--color-tertiary)) } 
    .text-tertiary-actually-black { color: rgb(var(--color-variant-actually-black)) } 
    .text-tertiary-disabled { color: rgba(var(--color-tertiary), var(--opacity-variant-disabled)) } 
    .text-tertiary-less-opaque { color: rgba(var(--color-tertiary), var(--opacity-variant-less-opaque)) } 
    .text-quaternary { color: rgba(var(--color-quaternary), 0.11764705882352941) } 
    .text-quaternary-actually-black { color: rgb(var(--color-variant-actually-black)) } 
    .text-quaternary-disabled { color: rgba(var(--color-quaternary), var(--opacity-variant-disabled)) }`);
});

it("generates default theme's variants when it has multiple themes", async () => {
  const plugin = new ThemeBuilder();
  plugin.themes([
    new Theme()
      .default()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
        error: '#BF616A',
        'on-error': '#2E3440',
      })
      .colorVariant('hover', '#3B4252', ['on-background', 'on-surface'])
      .colorVariant('active', '#434C5E', ['on-background', 'on-surface'])
      .opacityVariant('high-emphasis', 0.81)
      .opacityVariant('medium-emphasis', 0.6)
      .opacityVariant('muted', 0.3)
      .opacityVariant('disabled', 0.3)
      .opacityVariant('slightly-visible', 0.1),
    new Theme()
      .name('night')
      .dark()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
        error: '#BF616A',
        'on-error': '#D8DEE9',
      })
      .colorVariant('hover', '#E5E9F0', ['on-background', 'on-surface'])
      .colorVariant('active', '#ECEFF4', ['on-background', 'on-surface'])
      .opacityVariant('high-emphasis', 0.81)
      .opacityVariant('medium-emphasis', 0.6)
      .opacityVariant('muted', 0.3)
      .opacityVariant('disabled', 0.3)
      .opacityVariant('slightly-visible', 0.1),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
  :root {
    --color-background: 236,239,244;
    --color-surface: 216,222,233;
    --color-on-background: 46,52,64;
    --color-on-surface: 46,52,64;
    --color-error: 191,97,106;
    --color-on-error: 46,52,64;
    --opacity-variant-high-emphasis: 0.81;
    --opacity-variant-medium-emphasis: 0.6;
    --opacity-variant-muted: 0.3;
    --opacity-variant-disabled: 0.3;
    --opacity-variant-slightly-visible: 0.1;
    --color-variant-hover: 59,66,82;
    --color-variant-active: 67,76,94
  }

  @media (prefers-color-scheme: dark) {
    [night] {
      --color-background: 46,52,64;
      --color-surface: 59,66,82;
      --color-on-background: 216,222,233;
      --color-on-surface: 216,222,233;
      --color-error: 191,97,106;
      --color-on-error: 216,222,233;
      --opacity-variant-high-emphasis: 0.81;
      --opacity-variant-medium-emphasis: 0.6;
      --opacity-variant-muted: 0.3;
      --opacity-variant-disabled: 0.3;
      --opacity-variant-slightly-visible: 0.1;
      --color-variant-hover: 229,233,240;
      --color-variant-active: 236,239,244
    }
  }

  .text-background { color: rgb(var(--color-background)) } 
  .text-background-high-emphasis { color: rgba(var(--color-background), var(--opacity-variant-high-emphasis)) } 
  .text-background-medium-emphasis { color: rgba(var(--color-background), var(--opacity-variant-medium-emphasis)) } 
  .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
  .text-background-disabled { color: rgba(var(--color-background), var(--opacity-variant-disabled)) } 
  .text-background-slightly-visible { color: rgba(var(--color-background), var(--opacity-variant-slightly-visible)) } 
  .text-surface { color: rgb(var(--color-surface)) } 
  .text-surface-high-emphasis { color: rgba(var(--color-surface), var(--opacity-variant-high-emphasis)) } 
  .text-surface-medium-emphasis { color: rgba(var(--color-surface), var(--opacity-variant-medium-emphasis)) } 
  .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
  .text-surface-disabled { color: rgba(var(--color-surface), var(--opacity-variant-disabled)) } 
  .text-surface-slightly-visible { color: rgba(var(--color-surface), var(--opacity-variant-slightly-visible)) } 
  .text-on-background { color: rgb(var(--color-on-background)) } 
  .text-on-background-hover { color: rgb(var(--color-variant-hover)) } 
  .text-on-background-active { color: rgb(var(--color-variant-active)) } 
  .text-on-background-high-emphasis { color: rgba(var(--color-on-background), var(--opacity-variant-high-emphasis)) } 
  .text-on-background-medium-emphasis { color: rgba(var(--color-on-background), var(--opacity-variant-medium-emphasis)) } 
  .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
  .text-on-background-disabled { color: rgba(var(--color-on-background), var(--opacity-variant-disabled)) } 
  .text-on-background-slightly-visible { color: rgba(var(--color-on-background), var(--opacity-variant-slightly-visible)) } 
  .text-on-surface { color: rgb(var(--color-on-surface)) } 
  .text-on-surface-hover { color: rgb(var(--color-variant-hover)) } 
  .text-on-surface-active { color: rgb(var(--color-variant-active)) } 
  .text-on-surface-high-emphasis { color: rgba(var(--color-on-surface), var(--opacity-variant-high-emphasis)) } 
  .text-on-surface-medium-emphasis { color: rgba(var(--color-on-surface), var(--opacity-variant-medium-emphasis)) } 
  .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) } 
  .text-on-surface-disabled { color: rgba(var(--color-on-surface), var(--opacity-variant-disabled)) } 
  .text-on-surface-slightly-visible { color: rgba(var(--color-on-surface), var(--opacity-variant-slightly-visible)) } 
  .text-error { color: rgb(var(--color-error)) } 
  .text-error-high-emphasis { color: rgba(var(--color-error), var(--opacity-variant-high-emphasis)) } 
  .text-error-medium-emphasis { color: rgba(var(--color-error), var(--opacity-variant-medium-emphasis)) } 
  .text-error-muted { color: rgba(var(--color-error), var(--opacity-variant-muted)) } 
  .text-error-disabled { color: rgba(var(--color-error), var(--opacity-variant-disabled)) } 
  .text-error-slightly-visible { color: rgba(var(--color-error), var(--opacity-variant-slightly-visible)) } 
  .text-on-error { color: rgb(var(--color-on-error)) } 
  .text-on-error-high-emphasis { color: rgba(var(--color-on-error), var(--opacity-variant-high-emphasis)) } 
  .text-on-error-medium-emphasis { color: rgba(var(--color-on-error), var(--opacity-variant-medium-emphasis)) } 
  .text-on-error-muted { color: rgba(var(--color-on-error), var(--opacity-variant-muted)) } 
  .text-on-error-disabled { color: rgba(var(--color-on-error), var(--opacity-variant-disabled)) } 
  .text-on-error-slightly-visible { color: rgba(var(--color-on-error), var(--opacity-variant-slightly-visible)) }`);
});

it('has a default theme and a default dark theme which is assignable by its name', async () => {
  const plugin = new ThemeBuilder();
  plugin
    .prefix('theme')
    .strategy(Strategy.PrefixedClass)
    .themes([
      new Theme()
        .default()
        .colors({
          background: '#ECEFF4',
          surface: '#D8DEE9',
          'on-background': '#2E3440',
          'on-surface': '#2E3440',
        })
        .opacityVariant('muted', 0.3),
      new Theme()
        .name('night')
        .default()
        .dark()
        .assignable()
        .colors({
          background: '#2E3440',
          surface: '#3B4252',
          'on-background': '#D8DEE9',
          'on-surface': '#D8DEE9',
        })
        .opacityVariant('muted', 0.3),
    ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-background: 236,239,244;
      --color-surface: 216,222,233;
      --color-on-background: 46,52,64;
      --color-on-surface: 46,52,64;
      --opacity-variant-muted: 0.3
    }

    .theme-night {
      --color-background: 46,52,64;
      --color-surface: 59,66,82;
      --color-on-background: 216,222,233;
      --color-on-surface: 216,222,233;
      --opacity-variant-muted: 0.3
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3
      }
    } 
    
    .text-background { color: rgb(var(--color-background)) } 
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
    .text-surface { color: rgb(var(--color-surface)) } 
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
    .text-on-background { color: rgb(var(--color-on-background)) } 
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
    .text-on-surface { color: rgb(var(--color-on-surface)) } 
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('has a default theme and a named dark theme', async () => {
  const plugin = new ThemeBuilder();
  plugin.strategy(Strategy.Attribute).themes([
    new Theme()
      .default()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),
    new Theme()
      .name('night')
      .dark()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-background: 236,239,244;
      --color-surface: 216,222,233;
      --color-on-background: 46,52,64;
      --color-on-surface: 46,52,64;
      --opacity-variant-muted: 0.3
    }
    
    @media (prefers-color-scheme: dark) {
      [night] {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3
      }
    }
    
    .text-background { color: rgb(var(--color-background)) } 
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
    .text-surface { color: rgb(var(--color-surface)) } 
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
    .text-on-background { color: rgb(var(--color-on-background)) } 
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
    .text-on-surface { color: rgb(var(--color-on-surface)) } 
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('has a default theme and a default dark theme', async () => {
  const plugin = new ThemeBuilder();
  plugin.strategy(Strategy.Attribute).themes([
    new Theme()
      .default()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),
    new Theme()
      .default()
      .dark()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-background: 236,239,244;
      --color-surface: 216,222,233;
      --color-on-background: 46,52,64;
      --color-on-surface: 46,52,64;
      --opacity-variant-muted: 0.3
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3
      }
    }
    
    .text-background { color: rgb(var(--color-background)) } 
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
    .text-surface { color: rgb(var(--color-surface)) } 
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
    .text-on-background { color: rgb(var(--color-on-background)) } 
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
    .text-on-surface { color: rgb(var(--color-on-surface)) } 
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('has default themes for both schemes,a default assignable theme, and another theme', async () => {
  const plugin = new ThemeBuilder();
  plugin.strategy(Strategy.Attribute).themes([
    // A default, named and assignable theme
    new Theme()
      .default()
      .assignable()
      .name('black-and-white')
      .colors({
        background: 'dark',
        surface: 'gray',
        'on-background': 'white',
        'on-surface': 'white',
      })
      .opacityVariant('muted', 0.3),

    // A default light theme, not assignable
    new Theme()
      .default()
      .light()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),

    // A default dark scheme, not assignable
    new Theme()
      .default()
      .dark()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),

    // Another assignable theme
    new Theme()
      .name('white')
      .colors({
        background: 'white',
        surface: 'gray',
        'on-background': 'black',
        'on-surface': 'black',
      })
      .opacityVariant('muted', 0.3),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
  :root {
    --color-background: 0,0,0;
    --color-surface: 128,128,128;
    --color-on-background: 255,255,255;
    --color-on-surface: 255,255,255;
    --opacity-variant-muted: 0.3
  }

  [black-and-white] {
    --color-background: 0,0,0;
    --color-surface: 128,128,128;
    --color-on-background: 255,255,255;
    --color-on-surface: 255,255,255;
    --opacity-variant-muted: 0.3
  }

  @media (prefers-color-scheme: light) {
    :root {
      --color-background: 236,239,244;
      --color-surface: 216,222,233;
      --color-on-background: 46,52,64;
      --color-on-surface: 46,52,64;
      --opacity-variant-muted: 0.3
    }
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: 46,52,64;
      --color-surface: 59,66,82;
      --color-on-background: 216,222,233;
      --color-on-surface: 216,222,233;
      --opacity-variant-muted: 0.3
    }
  }

  [white] {
    --color-background: 255,255,255;
    --color-surface: 128,128,128;
    --color-on-background: 0,0,0;
    --color-on-surface: 0,0,0;
    --opacity-variant-muted: 0.3
  } 

  .text-background { color: rgb(var(--color-background)) } 
  .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
  .text-surface { color: rgb(var(--color-surface)) } 
  .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
  .text-on-background { color: rgb(var(--color-on-background)) } 
  .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
  .text-on-surface { color: rgb(var(--color-on-surface)) } 
  .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('has a default theme and a dark theme which is the dark schemes default theme', async () => {
  const plugin = new ThemeBuilder();
  plugin.strategy(Strategy.Attribute).themes([
    new Theme()
      .default()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),
    new Theme()
      .name('dark')
      .dark()
      .default()
      .assignable()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),
  ]);

  const css = await generatePluginCss(plugin, {}, true, true, true, ['textColor']);

  // @ts-ignore
  expect(css).toMatchCss(`
  :root {
    --color-background: 236,239,244;
    --color-surface: 216,222,233;
    --color-on-background: 46,52,64;
    --color-on-surface: 46,52,64;
    --opacity-variant-muted: 0.3
  }

  [dark] {
    --color-background: 46,52,64;
    --color-surface: 59,66,82;
    --color-on-background: 216,222,233;
    --color-on-surface: 216,222,233;
    --opacity-variant-muted: 0.3
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: 46,52,64;
      --color-surface: 59,66,82;
      --color-on-background: 216,222,233;
      --color-on-surface: 216,222,233;
      --opacity-variant-muted: 0.3
    }
  }
  
  .text-background { color: rgb(var(--color-background)) } 
  .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
  .text-surface { color: rgb(var(--color-surface)) } 
  .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
  .text-on-background { color: rgb(var(--color-on-background)) } 
  .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
  .text-on-surface { color: rgb(var(--color-on-surface)) } 
  .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('has as default assignable theme', async () => {
  const plugin = new ThemeBuilder();
  plugin
    .prefix('theme')
    .strategy(Strategy.PrefixedClass)
    .themes([
      new Theme()
        .default()
        .assignable()
        .colors({
          background: '#ECEFF4',
        }),
    ]);

  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-background: 236,239,244;
    }
    .theme-default {
      --color-background: 236,239,244;
    }`);
});

it('has a default themes using ThemeBuilder helper', async () => {
  const plugin = new ThemeBuilder()
    .default(new Theme().color('main', 'gray'))
    .light(new Theme().color('main', 'white'))
    .dark(new Theme().color('main', 'black'));

  const css = await generatePluginCss(plugin);

  // @ts-ignore
  expect(css).toMatchCss(`
    :root {
      --color-main: 128,128,128
    }
  
    [light] {
      --color-main: 255,255,255
    }
  
    @media (prefers-color-scheme: light) {
      :root {
        --color-main: 255,255,255
      }
    }
  
    [dark] {
      --color-main: 0,0,0
    }
  
    @media (prefers-color-scheme: dark) {
      :root {
        --color-main: 0,0,0
      }
    }`);
});
