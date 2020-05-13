import { generatePluginCss } from '../generatePluginCss';
import { ThemeManager, Theme } from '../../src/api';
import { Errors } from '../../src/errors';
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

function fontFamilyEnabledConfig() {
  return {
    theme: {
      screens: false,
      fontFamily: {
        serif: ['sans-serif'],
      },
    },
    corePlugins: ['textColor', 'fontFamily'],
    variants: {
      textColor: false,
      fontFamily: false,
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
    :root, [data-theme='default'] { --color-primary: 255, 255, 255 }
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

    [data-theme='dark'] {
      --color-primary: 0, 0, 0 
    }

    @media (prefers-color-scheme: dark) {
      :root, [data-theme='dark'] { 
        --color-primary: 0, 0, 0 
      }
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates a default theme and another named theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager()
        .setDefaultTheme(new Theme().addColors({ primary: 'white' }))
        .addTheme(
          new Theme().targetable().setName('dark').addColors({ primary: 'black' })
        ),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255 
    }

    [data-theme='dark'] {
      --color-primary: 0, 0, 0 
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
  `);
});

it('generates a default theme, a default assignable dark theme and another one', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager()
        .setDefaultTheme(new Theme().addColors({ primary: 'white' }))
        .setDefaultDarkTheme(new Theme().targetable().addColors({ primary: 'black' }))
        .addDarkTheme(
          new Theme().targetable().setName('blueish').addColors({ primary: 'blue' })
        ),
    },
    noScreenConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255 
    }

    [data-theme='dark'] {
      --color-primary: 0, 0, 0 
    }

    @media (prefers-color-scheme: dark) {
      :root, [data-theme='dark'] { 
        --color-primary: 0, 0, 0 
      }

      [data-theme='blueish'] {
        --color-primary: 0, 0, 255 
      }
    }

    [data-theme='blueish'] {
      --color-primary: 0, 0, 255 
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
          // @ts-ignore
          .setStrategy('unknown-strategy')
          .setDefaultTheme(new Theme().targetable().addColors({ primary: 'white' })),
      },
      noScreenConfig()
    );

  await expect(check()).rejects.toThrow(Errors.UNKNOWN_STRATEGY);
});

it('extends Tailwind with variables on a default theme', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager().setDefaultTheme(
        new Theme()
          .addColors({ primary: 'white' })
          .setVariable('sans', ['Roboto', 'Segoe UI'], 'fontFamily', 'font')
      ),
    },
    fontFamilyEnabledConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255;
      --font-sans: Roboto, "Segoe UI"
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
    .font-serif { font-family: sans-serif }
    .font-sans { font-family: var(--font-sans) }
  `);
});

it('extends Tailwind with variables on a all themes', async () => {
  const css = await generatePluginCss(
    {
      themes: new ThemeManager()
        .setDefaultTheme(
          new Theme()
            .addColors({ primary: 'white' })
            .setVariable('sans', ['Roboto', 'Segoe UI'], 'fontFamily', 'font')
        )
        .setDefaultDarkTheme(
          new Theme()
            .addColors({ primary: 'black' })
            .setVariable('sans', ['Inter'], 'fontFamily', 'font')
        ),
    },
    fontFamilyEnabledConfig()
  );

  expect(css).toMatchCss(`
    :root { 
      --color-primary: 255, 255, 255;
      --font-sans: Roboto, "Segoe UI"
    }

    @media (prefers-color-scheme: dark) {
      :root { 
        --color-primary: 0, 0, 0;
        --font-sans: Inter
      }
    }

    .text-primary { color: rgba(var(--color-primary), 1) }
    .font-serif { font-family: sans-serif }
    .font-sans { font-family: var(--font-sans) }
  `);
});
