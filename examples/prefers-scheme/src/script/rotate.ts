import theming from '../../theme.config.js';
import _ from 'lodash';

const themes = theming._themes.map((theme: any) => theme._name);
const strategyPrefix = theming._config.prefix;
const strategy = theming._config.strategy;

/*
 |--------------------------------------------------------------------------
 | Theme Rotation
 |--------------------------------------------------------------------------
 |
 | This script exports a function which will rotate through the themes 
 | found in your `theme.config.js` file.
 | You can see this as an example of how to use your theme config
 | to avoid repeating code (especially theme names).
 | If you wish to support more strategies, you can write your own rotate
 | function and change the `export` value of this file.
 |
 */

/**
 * Rotate through themes using the `data-theme-attribute` strategy.
 */
function rotateDataThemeStrategy(includesDefault: boolean = true) {
  let found = false;

  if ('theme' in document.body.dataset) {
    let current = document.body.dataset.theme;
    for (let i = 0; i < themes.length; i++) {
      if (current === themes[i]) {
        found = true;
        delete document.body.dataset.theme;

        if (i + 1 < themes.length) {
          document.body.dataset.theme = themes[i + 1];
        }
        break;
      }
    }
  }

  if (!includesDefault && !document.body.dataset.theme) {
    document.body.dataset.theme = themes[0];
  } else if (!found && themes.length > 0) {
    document.body.dataset.theme = themes[0];
  }
}

/**
 * Rotate through themes using the `prefixed-class` strategy.
 */
function rotatePrefixedClassStrategy(usePrefix: boolean = true, includesDefault: boolean = true) {
  let found = false;
  let prefix = usePrefix ? `${strategyPrefix}-` : '';

  for (let i = 0; i < themes.length; i++) {
    if (document.body.classList.contains(`${prefix}${themes[i]}`)) {
      found = true;
      document.body.classList.remove(`${prefix}${themes[i]}`);

      if (i + 1 < themes.length) {
        document.body.classList.add(`${prefix}${themes[i + 1]}`);
      }
      break;
    }
  }

  if (!includesDefault && !_.some(document.body.classList, (item: any) => _.includes(themes, item))) {
    document.body.classList.add(`${prefix}${themes[0]}`);
  } else if (!found && themes.length > 0) {
    document.body.classList.add(`${prefix}${themes[0]}`);
  }
}

/**
 * Rotate through themes using the `class` strategy.
 */
function rotateClassStrategy(includesDefault: boolean = true) {
  return rotatePrefixedClassStrategy(false, includesDefault);
}

function rotate(includesDefault: boolean = true) {
  switch (strategy) {
    case 'class':
      return rotateClassStrategy(includesDefault);
    case 'prefixed-class':
      return rotatePrefixedClassStrategy(true, includesDefault);
    case 'data-theme-attribute':
      return rotateDataThemeStrategy(includesDefault);
    default:
      return () => console.warn(`The strategy roation method for ${strategy} is not supported, please write your own.`);
  }
}

export default rotate;
