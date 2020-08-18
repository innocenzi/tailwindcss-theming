import { Configuration, ColorConfiguration } from 'tailwindcss';
import { ThemeManager } from '../theme/theme';
import { Errors } from '../errors';
import _ from 'lodash';

/**
 * Generates a Tailwind configuration.
 */
export function generateTailwindConfiguration(manager: ThemeManager): Configuration {
  return {
    theme: {
      colors: getColorConfiguration(manager),
      extend: getExtendedConfiguration(manager),
    },
  };
}

function getColorConfiguration(manager: ThemeManager) {
  const colorConfiguration: ColorConfiguration = {};
  const defaultTheme = manager.getDefaultTheme();

  // A default theme should be defined, because only a default theme's colors
  // will be generated for subsequent themes.
  if (!defaultTheme) {
    console.warn(Errors.NO_DEFAULT_THEME);
  }

  // If no default theme can be found, we use the first one in the list.
  const templateTheme = defaultTheme ?? manager.getThemes().shift();

  // If there is no theme at all, we throw.
  if (!templateTheme) {
    throw new Error(Errors.NO_THEME);
  }

  // Add every color to the theme.
  templateTheme.getColors().forEach((color) => {
    const name = color.getTailwindConfigurationName();
    const value = color.getTailwindConfigurationValue();

    // Creates the color under a `default` key, a functionality
    // of Tailwind that omits the `default` key in a color's name
    colorConfiguration[name] = { default: value };

    // For each variant, add a subcolor for this color, with
    // a computed value for the type of variant.
    color.getVariants().forEach((variant) => {
      const subname = variant.getTailwindConfigurationName();
      const value = variant.getTailwindConfigurationValue(color);

      (<any>colorConfiguration[name])[subname] = value;
    });
  });

  return colorConfiguration;
}

function getExtendedConfiguration(manager: ThemeManager) {
  const extendConfiguration: any = {};

  manager
    .getAllThemes()
    .map((theme) => theme.getVariables())
    .reduce((final, current) => final.concat(current), [])
    .filter((property) => property.extends()) // keeps only the ones that extend tailwind
    .forEach((property) => {
      _.set(
        extendConfiguration,
        property.getPath(),
        property.getTailwindConfigurationValue()
      );
    });

  return extendConfiguration;
}
