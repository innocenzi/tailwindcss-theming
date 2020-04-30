import { VariantPluginOptions } from '../../src/plugin';
import { ThemeManager, Theme } from '../../src/api';
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

function twoColorsAndVariantConfig(variants: string[]) {
  return {
    theme: {
      colors: {
        white: '#ffffff',
        black: '#000000',
      },
    },
    corePlugins: ['textColor'],
    variants: {
      textColor: variants,
    },
  };
}

function noThemeConfig(variants: Partial<VariantPluginOptions>) {
  return {
    path: './test/stubs/no-theme.config.js',
    variants,
  };
}

it('generates dark variant only', async () => {
  const css = await generatePluginCss(
    noThemeConfig({ dark: true }),
    twoColorsAndVariantConfig(['dark'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }

    @media (prefers-color-scheme: dark) {
      .dark\\:text-white { color: #ffffff }
      .dark\\:text-black { color: #000000 }
    }
  `);
});

it('generates light variant only', async () => {
  const css = await generatePluginCss(
    noThemeConfig({ light: true }),
    twoColorsAndVariantConfig(['light'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }

    @media (prefers-color-scheme: light) {
      .light\\:text-white { color: #ffffff }
      .light\\:text-black { color: #000000 }
    }
  `);
});

it('generates no-preference variant only', async () => {
  const css = await generatePluginCss(
    noThemeConfig({ noPreference: true }),
    twoColorsAndVariantConfig(['no-preference'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }

    @media (prefers-color-scheme: no-preference) {
      .no-preference\\:text-white { color: #ffffff }
      .no-preference\\:text-black { color: #000000 }
    }
  `);
});

it('generates multiple variants', async () => {
  const css = await generatePluginCss(
    noThemeConfig({
      dark: true,
      light: true,
      noPreference: true,
    }),
    twoColorsAndVariantConfig(['dark', 'light', 'no-preference'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }
    
    @media (prefers-color-scheme: dark) {
      .dark\\:text-white { color: #ffffff }
      .dark\\:text-black { color: #000000 }
    }
    
    @media (prefers-color-scheme: light) {
      .light\\:text-white { color: #ffffff }
      .light\\:text-black { color: #000000 }
    }

    @media (prefers-color-scheme: no-preference) {
      .no-preference\\:text-white { color: #ffffff }
      .no-preference\\:text-black { color: #000000 }
    }
    
  `);
});

it('uses custom selector name', async () => {
  const css = await generatePluginCss(
    noThemeConfig({
      dark: true,
      selectorName: variant => `${variant}-mode`,
    }),
    twoColorsAndVariantConfig(['dark'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }

    @media (prefers-color-scheme: dark) {
      .dark-mode\\:text-white { color: #ffffff }
      .dark-mode\\:text-black { color: #000000 }
    }
  `);
});

it('uses custom variant name', async () => {
  const css = await generatePluginCss(
    noThemeConfig({
      dark: true,
      variantName: variant => `scheme`,
    }),
    twoColorsAndVariantConfig(['scheme'])
  );

  expect(css).toMatchCss(`
    .text-white { color: #ffffff }
    .text-black { color: #000000 }

    @media (prefers-color-scheme: dark) {
      .dark\\:text-white { color: #ffffff }
      .dark\\:text-black { color: #000000 }
    }
  `);
});
