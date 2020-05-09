import { VariantPluginOptions, ThemingPluginOptions } from '../../src/plugin';
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

function monoColorConfig(): Partial<ThemingPluginOptions> {
  return {
    themes: new ThemeManager().setDefaultTheme(
      new Theme().addColors({
        primary: 'white',
      })
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

it('generates dark variant only', async () => {
  const css = await generatePluginCss(nestedColorsConfig(), noScreenConfig());

  expect(css).toMatchCss(`
    .text-primary { color: rgba(var(--color-primary), 1) }
    .text-primary-hover { color: rgba(var(--color-primary-hover), 0.5) }
  `);
});
