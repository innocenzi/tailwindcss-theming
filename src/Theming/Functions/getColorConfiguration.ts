import { Color } from '../Color';
import { Configuration } from '../Configuration';
import { ColorConfiguration } from '../ColorConfiguration';
import { Themes } from '../Theme';

export function getColorConfiguration(themes: Themes, config: Configuration): ColorConfiguration {
   return getColorsConfiguration(themes.default.colors, config);
}

export function getColorsConfiguration(colors: Color[], config: Configuration): ColorConfiguration {
  let colorConfig: any = {};

  colors.forEach(color => {
    colorConfig[color.name] = colorConfig[color.name] || {};

    // if the output format is text, we can't use rgb/rgba
    if ('text' === color.outputFormat) {
      if (config.useVariants && color.opacityVariants.length) {
        color.opacityVariants.forEach(variant => {
          colorConfig[color.name][variant.name] = `var(--${config.colorVariablePrefix}-${color.name}))`;
        });
      } else {
        colorConfig[color.name] = `var(--${config.colorVariablePrefix}-${color.name}))`;
      }
    }

    // if we use variants, we have to get a sub-object
    else if (config.useVariants && color.opacityVariants.length) {
      color.opacityVariants.forEach(variant => {
        colorConfig[color.name][
          variant.name
        ] = `rgba(var(--${config.colorVariablePrefix}-${color.name}), var(--${variant.name}))`;
      });
    }

    // else, we get a simple rgb
    else {
      colorConfig[color.name] = `rgb(var(--${config.colorVariablePrefix}-${color.name}))`;
    }
  });

  return { colors: colorConfig };
}
