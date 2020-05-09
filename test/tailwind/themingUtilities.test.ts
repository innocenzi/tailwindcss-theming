import { VariantPluginOptions, ThemingPluginOptions } from '../../src/plugin';
import { ThemeManager, Theme, VariantsObject } from '../../src/api';
import { generatePluginCss } from '../generatePluginCss';
import cssMatcher from 'jest-matcher-css';
import _ from 'lodash';

/*
|--------------------------------------------------------------------------
| Extends Jest to add the CSS matcher
|--------------------------------------------------------------------------
*/

expect.extend({
  toMatchCss: cssMatcher,
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchCss(css: string): R;
    }
  }
}

/*
|--------------------------------------------------------------------------
| Do actual testing
|--------------------------------------------------------------------------
*/

function noScreenConfig() {
  return {
    theme: {
      screens: false,
    },
    corePlugins: ['textColor'],
    variants: {
      textColor: false,
    },
  };
}

function monoColorConfig(variants: VariantsObject = {}): Partial<ThemingPluginOptions> {
  return {
    themes: new ThemeManager().setDefaultTheme(
      new Theme()
        .addColors({
          primary: 'white',
        })
        .addVariants(variants)
    ),
  };
}

function nestedColorsConfig(): Partial<ThemingPluginOptions> {
  return {
    themes: new ThemeManager().setDefaultTheme(
      new Theme().addColors({
        primary: {
          default: 'white',
          hover: 'rgba(255, 255, 255, .5)',
        },
      })
    ),
  };
}

it('generates correct utilities for a single color', async () => {
  const css = await generatePluginCss(monoColorConfig(), noScreenConfig());

  expect(css).toMatchCss(`
    :root {
      --color-primary: 255, 255, 255;  
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates correct utilities for nested colors', async () => {
  const css = await generatePluginCss(nestedColorsConfig(), noScreenConfig());

  expect(css).toMatchCss(`
    :root {
      --color-primary: 255, 255, 255;  
      --color-primary-hover: 255, 255, 255;
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
    .text-primary-hover { color: rgba(var(--color-primary-hover), 0.5) }
  `);
});

it('generates correct utilities for color with color variants', async () => {
  const css = await generatePluginCss(
    monoColorConfig({
      hover: 'blue',
    }),
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root {
      --color-primary: 255, 255, 255;  
      --color-variant-primary-hover: 0, 0, 255, 1;
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
    .text-primary-hover { color: rgba(var(--color-variant-primary-hover)) }
  `);
});

it('generates correct utilities for color with opacity variants', async () => {
  const css = await generatePluginCss(
    monoColorConfig({
      hover: 0.75,
    }),
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root {
      --color-primary: 255, 255, 255;  
      --opacity-variant-primary-hover: 0.75;
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
    .text-primary-hover { color: rgba(var(--color-primary), var(--opacity-variant-primary-hover)) }
  `);
});
