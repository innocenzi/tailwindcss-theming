import { Theme } from '../Theme/Theme';
import { getDefaultTheme, getColorVariableName, getColorVariantVariableName, getOpacityVariantVariableName } from './utils';
import { Variant } from '../Variant/Variant';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { Strategy } from '../Strategy';
import { ThemeScheme } from '../Theme/ThemeScheme';

function getCssThemeName(theme: Theme, config: Configuration, scheme: boolean = false): string {
  if (theme.isDefault() || (scheme && theme.isSchemeDefault())) {
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
      thisThemeConfig[getColorVariableName(color, config)] = `${color.computed.r},${color.computed.g},${color.computed.b}`;
      variants.push(...theme.variantsOf(color.keyName));

      // Warn if color is not defined in default theme
      if (!defaultTheme.getColors().find(defaultThemeColor => defaultThemeColor.keyName === color.keyName)) {
        console.warn(`Color ${color.keyName} is not defined in the main theme and won't be available in Tailwind utilities.`);
      }
    });

    // Define variants
    variants.forEach(variant => {
      if (variant instanceof ColorVariant) {
        thisThemeConfig[getColorVariantVariableName(variant, config)] = `${variant.color.r},${variant.color.g},${variant.color.b}`;
      } else if (variant instanceof OpacityVariant) {
        thisThemeConfig[getOpacityVariantVariableName(variant, config)] = variant.opacity;
      } else {
        throw new Error(`Unknown variant type for '${variant.name}'.`);
      }
    });

    // If the theme has no scheme, adds it
    if (!theme.hasScheme || theme.kept) {
      cssConfiguration[getCssThemeName(theme, config)] = thisThemeConfig;
    }

    // If the theme has a scheme, sets the theme under the corresponding color scheme media query
    if (theme.hasScheme) {
      let query: string = `@media (prefers-color-scheme: ${theme.scheme})`;
      cssConfiguration[query] = cssConfiguration[query] || {};
      cssConfiguration[query][getCssThemeName(theme, config, true)] = thisThemeConfig;
    } 
    
  });

  return cssConfiguration;
}
