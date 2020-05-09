import { getThemeSelector } from './getThemeSelector';
import { ThemeManager, Theme, Variant, VariableColor } from '../api';
import { Errors } from '../errors';
import _ from 'lodash';
import { Variable } from '../theme/variable';

/**
 * Generates a CSS configuration.
 */
export function generateCssConfiguration(manager: ThemeManager): any {
  const cssConfiguration: any = {};

  // Gets the default theme. If there is no default theme,
  // that's an issue: we can't know the variables we have to generate.
  const defaultTheme = manager.getDefaultTheme();

  // We throw if no default theme.
  if (!defaultTheme) {
    throw new Error(Errors.NO_DEFAULT_THEME);
  }

  // Get all of the themes.
  const themes = manager.getAllThemes();

  // For each theme, determine how they have to be added.
  themes.forEach(theme => {
    // Get the selector for this theme.
    const selector = [
      ...(theme.isDefault() ? [':root'] : []),
      ...(theme.isTargetable() ? [getThemeSelector(manager, theme)] : []),
    ].join(', ');

    // Themes with no schemes.
    if (theme.hasNoScheme() && selector) {
      cssConfiguration[selector] = getThemeCss(theme);
    }

    // A theme with a scheme will be under the media query
    if (theme.hasScheme() && selector) {
      const query = `@media (prefers-color-scheme: ${theme.getColorScheme()})`;

      // Get the themes under the media query, or an empty object
      // if there is none.
      let schemedThemes = cssConfiguration[query] ?? {};

      // Apply the theme on the selector.
      schemedThemes[selector] = getThemeCss(theme);

      // Apply the themes.
      cssConfiguration[query] = schemedThemes;
    }
  });

  return cssConfiguration;
}

function getThemeCss(theme: Theme): any {
  const css: any = {};

  // Registers a CSS variable
  const registerVariable = (variable: Variable | VariableColor) => {
    const name = variable.getCssVariableName();
    const value = variable.getCssVariableValue();

    css[name] = value;
  };

  // Registers a variant variable, thanks to its color name
  const registerVariant = (color: VariableColor, variant: Variant) => {
    const name = variant.getCssVariableName(color);
    const value = variant.getCssVariableValue(color);

    css[name] = value;
  };

  // Register all colors
  theme.getColors().forEach(color => {
    // Registers color variables
    registerVariable(color);

    // Register variant variables
    color.getVariants().forEach(variant => {
      registerVariant(color, variant);
    });
  });

  // Register all variables
  theme.getVariables().forEach(variable => {
    registerVariable(variable);
  });

  return css;
}
