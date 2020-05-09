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

    colorConfiguration[name] = value;
  });

  return {
    theme: {
      colors: colorConfiguration,
    },
  };
}
