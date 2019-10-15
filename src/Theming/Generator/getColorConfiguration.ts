import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';
import { Color } from '../Color/Color';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';

function getColorVariableName(color: Color, config: Configuration) {
  return `--${config.colorVariablePrefix}-${color.keyName}`;
}

function getColorVariantVariableName(color: ColorVariant, config: Configuration) {
  return `--color-variant-${color.name}`;
}

function getOpacityVariantVariableName(color: OpacityVariant, config: Configuration) {
  return `--opacity-variant-${color.name}`;
}

function getDefaultTheme(themes: Theme[]): Theme {
  let defaults = themes.filter(theme => theme.isDefault());

  if (defaults.length > 1) {
    console.warn('There are multiple default themes.');
  }

  if (defaults.length === 0) {
    throw new Error('There is no default theme.');
  }

  return defaults[0];
}

export function getColorConfiguration(themes: Theme[], config: Configuration) {
  const colorConfiguration: any = {};
  const theme = getDefaultTheme(themes);

  theme.getColors().forEach(color => {
    colorConfiguration[color.keyName] = colorConfiguration[color.keyName] || {};
    let variants = theme.variantsOf(color.keyName);

    // variants, we add a key and variant subkeys
    if (variants) {
      variants.forEach(variant => {
        if (variant instanceof ColorVariant) {
          if (variant.color.a > 0) {
            colorConfiguration[color.keyName][variant.name] = `rgb(var(${getColorVariantVariableName(variant, config)}))`;
          } else {
            colorConfiguration[color.keyName][variant.name] = `rgba(var(${getColorVariantVariableName(variant, config)}), ${variant.color.a})`;
          }
        } else if (variant instanceof OpacityVariant) {
          colorConfiguration[color.keyName][variant.name] = `rgba(var(${getColorVariableName(color, config)}), var(${getOpacityVariantVariableName(variant, config)}))`;
        }
      });
    }

    // no variant, we add the value directly to the key
    else {
      if (color.computed.a > 0) {
        colorConfiguration[color.keyName] = `rgb(var(${getColorVariableName(color, config)}))`;
      } else {
        colorConfiguration[color.keyName] = `rgba(var(${getColorVariableName(color, config)}), ${color.computed.a})`;
      }
    }
  });

  return {
    colors: colorConfiguration,
  };
}
