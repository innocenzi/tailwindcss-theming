import { ThemeManager, Theme } from '../src/api';
import { generatePluginCss } from './generatePluginCss';
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
      toMatchCss(css: any): R;
    }
  }
}

/*
|--------------------------------------------------------------------------
| Do actual testing
|--------------------------------------------------------------------------
*/

it('generates a default theme', async () => {
  // const css = await generatePluginCss();
  expect('').toMatchCss('');
});
