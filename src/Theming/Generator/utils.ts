import { Color } from '../Color/Color';
import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { ThemeScheme } from '../Theme/ThemeScheme';
import { CustomProperty } from '../CustomProperty/CustomProperty';

/**
 * Get the default theme out of an array of themes.
 *
 * @export
 * @param {Theme[]} themes
 * @returns {Theme}
 */
export function getDefaultTheme(themes: Theme[]): Theme {
  let defaultsWithoutScheme = themes.filter(theme => theme.isDefault() && !theme.hasScheme());
  let defaultsDarkScheme = themes.filter(theme => theme.isDefault() && theme.getScheme() === ThemeScheme.Dark);
  let defaultsLightScheme = themes.filter(theme => theme.isDefault() && theme.getScheme() === ThemeScheme.Light);
  let unamed = themes.filter(theme => !theme.hasName() && !theme.isDefault());

  if (unamed.length > 0) {
    throw new Error(`Some themes don't have names.`);
  }

  if (defaultsWithoutScheme.length === 0) {
    throw new Error('There is no default theme.');
  }

  if (defaultsWithoutScheme.length > 1) {
    throw new Error('There are multiple default themes.');
  }

  if (defaultsDarkScheme.length > 1 || defaultsLightScheme.length > 1) {
    throw new Error('There are multiple default themes for a scheme.');
  }

  return defaultsWithoutScheme[0];
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
  return `--${[config.colorVariablePrefix, color.keyName].filter(Boolean).join('-')}`;
}

/**
 * Get the name of the CSS variable for a color variant.
 *
 * @export
 * @param {ColorVariant} variant
 * @param {Configuration} config
 * @returns {string}
 */
export function getColorVariantVariableName(variant: ColorVariant): string {
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
export function getOpacityVariantVariableName(variant: OpacityVariant): string {
  return `--opacity-variant-${variant.name}`;
}

/**
 * Get the name of the CSS custom property.
 *
 * @export
 * @param {CustomProperty} property
 * @returns {string}
 */
export function getCustomPropertyVariableName(property: CustomProperty): string {
  return `--${property.getPrefix()}${getPascalCase(property.getName())}`;
}

/**
 * Gets the CSS value for a color variant.
 *
 * @export
 * @param {ColorVariant} variant
 * @param {Configuration} config
 * @returns {string}
 */
export function getColorVariantCssConfiguration(variant: ColorVariant, config: Configuration): string {
  if (variant.color.a !== 1) {
    return `rgba(var(${getColorVariantVariableName(variant)}), ${variant.color.a})`;
  } else {
    return `rgb(var(${getColorVariantVariableName(variant)}))`;
  }
}

/**
 * Gets the CSS variable value for a color variant.
 *
 * @export
 * @param {ColorVariant} variant
 * @returns {string}
 */
export function getColorVariantCssVariableValue(variant: ColorVariant): string {
  if (variant.color.a !== 1) {
    return `${variant.color.r},${variant.color.g},${variant.color.b},${variant.color.a}`;
  } else {
    return `${variant.color.r},${variant.color.g},${variant.color.b}`;
  }
}

/**
 * Gets the CSS value for an opacity variant.
 *
 * @export
 * @param {Color} color
 * @param {OpacityVariant} variant
 * @param {Configuration} config
 * @returns {string}
 */
export function getOpacityVariantCssConfiguration(color: Color, variant: OpacityVariant, config: Configuration): string {
  return `rgba(var(${getColorVariableName(color, config)}), var(${getOpacityVariantVariableName(variant)}))`;
}

/**
 * Gets the CSS value for a color.
 *
 * @export
 * @param {Color} color
 * @param {Configuration} config
 * @returns {string}
 */
export function getColorCssConfiguration(color: Color, config: Configuration): string {
  if (color.computed.a !== 1) {
    return `rgba(var(${getColorVariableName(color, config)}), ${color.computed.a})`;
  } else {
    return `rgb(var(${getColorVariableName(color, config)}))`;
  }
}

/**
 * Gets the CSS variable value for a color.
 *
 * @export
 * @param {Color} color
 * @returns {string}
 */
export function getColorCssVariableValue(color: Color): string {
  return `${color.computed.r},${color.computed.g},${color.computed.b}`;
}

/**
 * Gets the pascal case version of the string.
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
export function getPascalCase(str: string): string {
  return str && (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).map(x => x.toLowerCase()).join('-');
}
