import { VariantPluginOptions, ThemingPluginOptions } from '../../src/plugin';
import { ThemeManager, Theme, VariantsObject } from '../../src/api';
import { generatePluginCss } from '../generatePluginCss';
import cssMatcher from 'jest-matcher-css';
import _ from 'lodash';
import { Errors } from '../../src/errors';

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

it('generates a single default theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager().setDefaultTheme(
        new Theme().addColors({ primary: 'white' })
      ),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root { --color-primary: 255, 255, 255 }
    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates a single default assignable theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager().setDefaultTheme(
        new Theme().addColors({ primary: 'white' }).targetable()
      ),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root, [data-theme-default] { --color-primary: 255, 255, 255 }
    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates a default and a dark theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager()
        .setDefaultTheme(new Theme().addColors({ primary: 'white' }))
        .setDefaultDarkTheme(new Theme().addColors({ primary: 'black' })),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255 
    }

    @media (prefers-color-scheme: dark) {
      :root { 
        --color-primary: 0, 0, 0 
      }
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates a default and an assignable dark theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager()
        .setDefaultTheme(new Theme().addColors({ primary: 'white' }))
        .setDefaultDarkTheme(new Theme().targetable().addColors({ primary: 'black' })),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255 
    }

    @media (prefers-color-scheme: dark) {
      :root, [data-theme-dark] { 
        --color-primary: 0, 0, 0 
      }
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('warns if no default theme is available', async () => {
  const check = async () =>
    await generatePluginCss(
      {
        themes: new ThemeManager().addTheme(new Theme().addColors({ primary: 'white' })),
      },
      noScreenConfig()
    );

  await expect(check()).rejects.toThrow(Errors.NO_DEFAULT_THEME);
});

it('warns if no strategy is defined when there is a targetable theme', async () => {
  const check = async () =>
    await generatePluginCss(
      {
        themes: new ThemeManager()
          .setStrategy(null)
          .setDefaultTheme(new Theme().targetable().addColors({ primary: 'white' })),
      },
      noScreenConfig()
    );

  await expect(check()).rejects.toThrow(Errors.UNKNOWN_STRATEGY);
});
