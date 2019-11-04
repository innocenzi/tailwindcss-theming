import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';
import { ColorVariant } from '../Variant/ColorVariant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { getDefaultTheme, getColorVariantCssConfiguration, getColorCssConfiguration, getOpacityVariantCssConfiguration } from './utils';

export function getColorConfiguration(themes: Theme[], config: Configuration) {
  const colorConfiguration: any = {};
  const theme = getDefaultTheme(themes);

  theme.getColors().forEach(color => {
    colorConfiguration[color.keyName] = colorConfiguration[color.keyName] || {};
    let variants = theme.variantsOf(color.keyName);

    // we add the value in the default key
    colorConfiguration[color.keyName]['default'] = getColorCssConfiguration(color, config);

    // variants, we add a key and variant subkeys
    if (variants.length > 0) {
      variants.forEach(variant => {
        if (variant instanceof ColorVariant) {
          colorConfiguration[color.keyName][variant.name] = getColorVariantCssConfiguration(variant, config);
        } else if (variant instanceof OpacityVariant) {
          colorConfiguration[color.keyName][variant.name] = getOpacityVariantCssConfiguration(color, variant, config);
        } else {
          throw new Error('Unknown color variant.');
        }
      });
    }
  });

  return colorConfiguration;
}
