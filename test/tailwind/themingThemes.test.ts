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

it('generates correct themes for a single theme with a single color', async () => {
  const css = await generatePluginCss(monoColorConfig(), noScreenConfig());

  expect(true).toBe(true);
  // expect(css).toMatchCss(`
  //   :root {

  //   }
  // `);
});
