import { Color } from '../Color/Color';
import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';

/**
 * Get the default theme out of an array of themes.
 *
 * @export
 * @param {Theme[]} themes
 * @returns {Theme}
 */
export function getDefaultTheme(themes: Theme[]): Theme {
  let defaults = themes.filter(theme => theme.isDefault());

  if (defaults.length > 1) {
    throw new Error('There are multiple default themes.');
  }

  if (defaults.length === 0) {
    throw new Error('There is no default theme.');
  }

  return defaults[0];
}

/**
 * Get the name of the CSS variable for given color.
 *
 * @export
 * @param {Color} color
 * @param {Configuration} config
 * @returns {string}
 */
export function getColorVariableName(color: Color, config: Configuration): string {
  return `--${config.colorVariablePrefix}-${color.keyName}`;
}

/**
 * Get the name of the CSS variable for a color variant.
 *
 * @export
 * @param {ColorVariant} variant
 * @param {Configuration} config
 * @returns {string}
 */
export function getColorVariantVariableName(variant: ColorVariant, config: Configuration): string {
  return `--color-variant-${variant.name}`;
}

/**
 * Get the name of the CSS variable for an opacity variant.
 *
 * @export
 * @param {ColorVariant} variant
 * @param {Configuration} config
 * @returns {string}
 */
export function getOpacityVariantVariableName(variant: OpacityVariant, config: Configuration): string {
  return `--opacity-variant-${variant.name}`;
}
