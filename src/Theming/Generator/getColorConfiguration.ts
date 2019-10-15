import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { getDefaultTheme, getColorVariantVariableName, getColorVariableName, getOpacityVariantVariableName } from './utils';

export function getColorConfiguration(themes: Theme[], config: Configuration) {
  const colorConfiguration: any = {};
  const theme = getDefaultTheme(themes);

  theme.getColors().forEach(color => {
    colorConfiguration[color.keyName] = colorConfiguration[color.keyName] || {};
    let variants = theme.variantsOf(color.keyName);

    // variants, we add a key and variant subkeys
    if (variants.length > 0) {
      variants.forEach(variant => {
        if (variant instanceof ColorVariant) {
          if (variant.color.a > 0) {
            colorConfiguration[color.keyName][variant.name] = `rgb(var(${getColorVariantVariableName(variant, config)}))`;
          } else {
            colorConfiguration[color.keyName][variant.name] = `rgba(var(${getColorVariantVariableName(variant, config)}), ${variant.color.a})`;
          }
        } else if (variant instanceof OpacityVariant) {
          colorConfiguration[color.keyName][variant.name] = `rgba(var(${getColorVariableName(color, config)}), var(${getOpacityVariantVariableName(variant, config)}))`;
        } else {
          throw new Error('Unknown color variant.');
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

  
  return colorConfiguration;
}
