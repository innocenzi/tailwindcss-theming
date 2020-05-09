import { Configuration, ColorConfiguration } from 'tailwindcss';
import { ThemeManager } from '../api';
import { Errors } from '../errors';

/**
 * Generates a Tailwind configuration.
 *
 * @param themeManager
 */
export function generateTailwindConfiguration(themeManager: ThemeManager): Configuration {
  const colorConfiguration: ColorConfiguration = {};
  const defaultTheme = themeManager.getDefaultTheme();

  // A default theme is needed, because only a default theme's colors
  // will be generated for subsequent themes.
  if (!defaultTheme) {
    throw new Error(Errors.NO_DEFAULT_THEME);
  }

  // Add every color to the theme.
  defaultTheme.getColors().forEach(color => {
    const name = color.getTailwindConfigurationName();
    const value = color.getTailwindConfigurationValue();

    // Creates the color under a `default` key, a functionality
    // of Tailwind that omits the `default` key in a color's name
    colorConfiguration[name] = { default: value };

    // For each variant, add a subcolor for this color, with
    // a computed value for the type of variant.
    color.getVariants().forEach(variant => {
      const subname = variant.getTailwindConfigurationName();
      const value = variant.getTailwindConfigurationValue(color);

      (<any>colorConfiguration[name])[subname] = value;
    });
  });

  return {
    theme: {
      colors: colorConfiguration,
    },
  };
}
