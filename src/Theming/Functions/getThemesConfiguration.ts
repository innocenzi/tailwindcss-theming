import { Configuration } from '../Configuration';
import { ThemeConfiguration } from '../ThemeConfiguration';
import { TinyColor } from '@ctrl/tinycolor';
import { OpacityVariant } from '../OpacityVariant';
import { Themes } from '../Theme';

export function getThemesConfiguration(themes: Themes, config: Configuration): ThemeConfiguration {
  let themeConfig: ThemeConfiguration = { ':root': {} };
  let variants: OpacityVariant[] = [];

  if (!themes.default) {
    throw new Error(`There should be a default theme.`);
  }

  // adds every theme's color
  for (let [name, theme] of Object.entries(themes)) {
    let currentThemeConfig: any = (themeConfig[name] = {});

    // handles colors
    theme.colors.forEach(color => {
      // ads the color to the theme
      let format = new TinyColor(color.value);
      let rgb = format.toRgb();

      if ('rgb' === color.outputFormat) {
        currentThemeConfig[`--${config.colorVariablePrefix}-${color.name}`] = `${rgb.r},${rgb.g},${rgb.b}`;
      } else if ('text' === color.outputFormat) {
        if (!format.toName()) {
          throw new Error(`Color ${color.name} has no name.`);
        }
        currentThemeConfig[`--${config.colorVariablePrefix}-${color.name}`] = format.toName();
      } else {
        throw new Error(`Invalid output format: ${color.outputFormat}`);
      }

      // adds variants that are actually used to a list
      color.opacityVariants.forEach(variant => {
        let match = variants.find(list => list.name === variant.name);
        if (!match) {
          variants.push(variant);
        }
      });
    });

    // handles variants
    variants.forEach(variant => {
      currentThemeConfig[`--${variant.name}`] = variant.value.toString();
    });

    themeConfig[name] = currentThemeConfig;
  }

  // replace any accepted key by the :root key
  Object.defineProperty(themeConfig, ':root', <PropertyDescriptor>Object.getOwnPropertyDescriptor(themeConfig, 'default'));
  delete themeConfig['default'];

  return themeConfig;
}
