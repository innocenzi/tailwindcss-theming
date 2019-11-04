import { Theme } from '../Theme/Theme';
import { getDefaultTheme, getColorVariableName, getColorVariantVariableName, getOpacityVariantVariableName, getColorVariantCssVariableValue, getColorCssVariableValue } from './utils';
import { Variant } from '../Variant/Variant';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { Strategy } from '../Strategy';

function getCssThemeName(theme: Theme, config: Configuration, keepName: boolean = false): string {
  if (!keepName && theme.isDefault()) {
    return ':root';
  }

  let name = theme.getName(); // tailwind should pascal-case this

  switch (config.strategy) {
    case Strategy.Attribute:
      return `[${name}]`;
    case Strategy.PrefixedAttribute:
      if (config.prefix) {
        return `[${config.prefix}-${name}]`;
      } else {
        throw new Error('Strategy is set to prefixed attribute but no prefix is defined.');
      }
    case Strategy.DataThemeAttribute:
      return `[data-theme=${name}]`;
    case Strategy.DataAttribute:
      return `[data-${name}]`;
    case Strategy.Class:
      return `.${name}`;
    case Strategy.PrefixedClass:
      if (config.prefix) {
        return `.${config.prefix}-${name}`;
      } else {
        throw new Error('Strategy is set to prefixed class but no prefix is defined.');
      }
    default:
      throw new Error(`Unknown strategy: ${config.strategy}.`);
  }
}

export function getCssConfiguration(themes: Theme[], config: Configuration): Theme {
  const defaultTheme = getDefaultTheme(themes);
  const cssConfiguration: any = {};
  const variants: Variant[] = [];

  // Set themes
  themes.forEach(theme => {
    let thisThemeConfig: any = {};

    // Define colors
    theme.getColors().forEach(color => {
      thisThemeConfig[getColorVariableName(color, config)] = getColorCssVariableValue(color);
      variants.push(...theme.variantsOf(color.keyName));

      // Warn if color is not defined in default theme
      if (!defaultTheme.getColors().find(defaultThemeColor => defaultThemeColor.keyName === color.keyName)) {
        console.warn(`Color ${color.keyName} is not defined in the main theme and won't be available in Tailwind utilities.`);
      }
    });

    // Define variants
    variants.forEach(variant => {
      if (variant instanceof ColorVariant) {
        thisThemeConfig[getColorVariantVariableName(variant, config)] = getColorVariantCssVariableValue(variant);
      } else if (variant instanceof OpacityVariant) {
        thisThemeConfig[getOpacityVariantVariableName(variant, config)] = variant.opacity.toString();
      } else {
        throw new Error(`Unknown variant type for '${variant.name}'.`);
      }
    });

    // Theme is not under a preference scheme, so we put it in the css and rename it to
    // :root if needed
    if (!theme.hasScheme()) {
      cssConfiguration[getCssThemeName(theme, config)] = thisThemeConfig;
    }

    // Theme needs to be assignable, so we keep a version outside of the media queries and
    // we don't rename it to :root if it's the default theme
    if (theme.isAssignable()) {
      cssConfiguration[getCssThemeName(theme, config, true)] = thisThemeConfig;
    }

    // Theme is under a media query, so we set it under that media query.
    if (theme.hasScheme()) {
      let query: string = `@media (prefers-color-scheme: ${theme.getScheme()})`;
      cssConfiguration[query] = cssConfiguration[query] || {};
      cssConfiguration[query][getCssThemeName(theme, config)] = thisThemeConfig;
    }
  });

  return cssConfiguration;
}
