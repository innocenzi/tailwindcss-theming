import { ThemeBuilder } from '../src';
import cssMatcher from 'jest-matcher-css';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { Theme } from '../src/Theming/Theme/Theme';
import { Color } from '../src/Theming/Color/Color';
import { Strategy } from '../src/Theming/Strategy';

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
  const plugin = new ThemeBuilder().defaults().themes([new Theme().default().color('white', 'white')]);

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
    new Theme().default().colors({
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

it('generates utilities with multiple colors', async () => {
  const plugin = new ThemeBuilder().defaults().themes([
    new Theme().default().colors({
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
    .text-quaternary { color: rgb(var(--color-quaternary)) }
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
      --opacity-variant-less-opaque: 0.7px
    }
    .text-transparent-actually-black { color: rgb(var(--color-variant-actually-black)) }  
    .text-transparent-disabled { color: rgba(var(--color-transparent), var(--opacity-variant-disabled)) }  
    .text-primary-actually-black { color: rgb(var(--color-variant-actually-black)) }  
    .text-primary-darker { color: rgb(var(--color-variant-darker)) }  
    .text-primary-disabled { color: rgba(var(--color-primary), var(--opacity-variant-disabled)) }  
    .text-secondary-actually-black { color: rgb(var(--color-variant-actually-black)) }  
    .text-secondary-disabled { color: rgba(var(--color-secondary), var(--opacity-variant-disabled)) }  
    .text-secondary-less-opaque { color: rgba(var(--color-secondary), var(--opacity-variant-less-opaque)) }  
    .text-tertiary-actually-black { color: rgb(var(--color-variant-actually-black)) }  
    .text-tertiary-disabled { color: rgba(var(--color-tertiary), var(--opacity-variant-disabled)) }  
    .text-tertiary-less-opaque { color: rgba(var(--color-tertiary), var(--opacity-variant-less-opaque)) }  
    .text-quaternary-actually-black { color: rgb(var(--color-variant-actually-black)) }  
    .text-quaternary-disabled { color: rgba(var(--color-quaternary), var(--opacity-variant-disabled)) }`);
});

it('respects multiple theme configuration and their variants', async () => {
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
    --opacity-variant-high-emphasis: 0.81px;
    --opacity-variant-medium-emphasis: 0.6px;
    --opacity-variant-muted: 0.3px;
    --opacity-variant-disabled: 0.3px;
    --opacity-variant-slightly-visible: 0.1px;
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
      --opacity-variant-high-emphasis: 0.81px;
      --opacity-variant-medium-emphasis: 0.6px;
      --opacity-variant-muted: 0.3px;
      --opacity-variant-disabled: 0.3px;
      --opacity-variant-slightly-visible: 0.1px;
      --color-variant-hover: 229,233,240;
      --color-variant-active: 236,239,244
    }
  }

  .text-background-high-emphasis { color: rgba(var(--color-background), var(--opacity-variant-high-emphasis)) } 
  .text-background-medium-emphasis { color: rgba(var(--color-background), var(--opacity-variant-medium-emphasis)) } 
  .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) } 
  .text-background-disabled { color: rgba(var(--color-background), var(--opacity-variant-disabled)) } 
  .text-background-slightly-visible { color: rgba(var(--color-background), var(--opacity-variant-slightly-visible)) } 
  .text-surface-high-emphasis { color: rgba(var(--color-surface), var(--opacity-variant-high-emphasis)) } 
  .text-surface-medium-emphasis { color: rgba(var(--color-surface), var(--opacity-variant-medium-emphasis)) } 
  .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) } 
  .text-surface-disabled { color: rgba(var(--color-surface), var(--opacity-variant-disabled)) } 
  .text-surface-slightly-visible { color: rgba(var(--color-surface), var(--opacity-variant-slightly-visible)) } 
  .text-on-background-hover { color: rgb(var(--color-variant-hover)) } 
  .text-on-background-active { color: rgb(var(--color-variant-active)) } 
  .text-on-background-high-emphasis { color: rgba(var(--color-on-background), var(--opacity-variant-high-emphasis)) } 
  .text-on-background-medium-emphasis { color: rgba(var(--color-on-background), var(--opacity-variant-medium-emphasis)) } 
  .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) } 
  .text-on-background-disabled { color: rgba(var(--color-on-background), var(--opacity-variant-disabled)) } 
  .text-on-background-slightly-visible { color: rgba(var(--color-on-background), var(--opacity-variant-slightly-visible)) } 
  .text-on-surface-hover { color: rgb(var(--color-variant-hover)) } 
  .text-on-surface-active { color: rgb(var(--color-variant-active)) } 
  .text-on-surface-high-emphasis { color: rgba(var(--color-on-surface), var(--opacity-variant-high-emphasis)) } 
  .text-on-surface-medium-emphasis { color: rgba(var(--color-on-surface), var(--opacity-variant-medium-emphasis)) } 
  .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) } 
  .text-on-surface-disabled { color: rgba(var(--color-on-surface), var(--opacity-variant-disabled)) } 
  .text-on-surface-slightly-visible { color: rgba(var(--color-on-surface), var(--opacity-variant-slightly-visible)) } 
  .text-error-high-emphasis { color: rgba(var(--color-error), var(--opacity-variant-high-emphasis)) } 
  .text-error-medium-emphasis { color: rgba(var(--color-error), var(--opacity-variant-medium-emphasis)) } 
  .text-error-muted { color: rgba(var(--color-error), var(--opacity-variant-muted)) } 
  .text-error-disabled { color: rgba(var(--color-error), var(--opacity-variant-disabled)) } 
  .text-error-slightly-visible { color: rgba(var(--color-error), var(--opacity-variant-slightly-visible)) } 
  .text-on-error-high-emphasis { color: rgba(var(--color-on-error), var(--opacity-variant-high-emphasis)) } 
  .text-on-error-medium-emphasis { color: rgba(var(--color-on-error), var(--opacity-variant-medium-emphasis)) } 
  .text-on-error-muted { color: rgba(var(--color-on-error), var(--opacity-variant-muted)) } 
  .text-on-error-disabled { color: rgba(var(--color-on-error), var(--opacity-variant-disabled)) } 
  .text-on-error-slightly-visible { color: rgba(var(--color-on-error), var(--opacity-variant-slightly-visible)) }`);
});

it('sets scheme media query set as default and keep outside if asked', async () => {
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
        .dark()
        .keep()
        .schemeDefault()
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
      --opacity-variant-muted: 0.3px
    }

    .theme-night {
      --color-background: 46,52,64;
      --color-surface: 59,66,82;
      --color-on-background: 216,222,233;
      --color-on-surface: 216,222,233;
      --opacity-variant-muted: 0.3px
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3px
      }
    } 
    
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) }
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) }
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) }
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('sets scheme media query set as default', async () => {
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
        .dark()
        .schemeDefault()
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
      --opacity-variant-muted: 0.3px
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3px
      }
    } 
    
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) }
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) }
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) }
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('set scheme media query', async () => {
  const plugin = new ThemeBuilder();
  plugin
    .strategy(Strategy.Attribute)
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
      --opacity-variant-muted: 0.3px
    }
    
    @media (prefers-color-scheme: dark) {
      [night] {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3px
      }
    }
    
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) }
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) }
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) }
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});

it('set scheme media query with attribute strategy and as default for dark scheme', async () => {
  const plugin = new ThemeBuilder();
  plugin
    .strategy(Strategy.Attribute)
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
        .dark()
        .schemeDefault()
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
      --opacity-variant-muted: 0.3px
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: 46,52,64;
        --color-surface: 59,66,82;
        --color-on-background: 216,222,233;
        --color-on-surface: 216,222,233;
        --opacity-variant-muted: 0.3px
      }
    }
    
    .text-background-muted { color: rgba(var(--color-background), var(--opacity-variant-muted)) }
    .text-surface-muted { color: rgba(var(--color-surface), var(--opacity-variant-muted)) }
    .text-on-background-muted { color: rgba(var(--color-on-background), var(--opacity-variant-muted)) }
    .text-on-surface-muted { color: rgba(var(--color-on-surface), var(--opacity-variant-muted)) }`);
});
