import { Configuration, ColorConfiguration } from 'tailwindcss';
import { ThemeManager } from '../api';
import { Errors } from '../errors';
import { VariableColor } from '../theme/colors/color';
import { Variant } from '../theme/colors/variants';

/**
 * Generates a CSS configuration.
 *
 * @param themeManager
 */
export function generateCssConfiguration(themeManager: ThemeManager): any {
  const cssConfiguration: any = {};
  const root = getRootCss(themeManager);

  // Set the root configuration
  cssConfiguration[':root'] = root;

  return cssConfiguration;
}

function getRootCss(themeManager: ThemeManager): any {
  const root: any = {};
  const defaultTheme = themeManager.getDefaultTheme();

  // Registers a color variable
  const registerColor = (color: VariableColor) => {
    const name = color.getCssVariableName();
    const value = color.getCssVariableValue();

    root[name] = value;
  };

  // Registers a variant variable, thanks to its color name
  const registerVariant = (color: VariableColor, variant: Variant) => {
    const name = variant.getCssVariableName(color);
    const value = variant.getCssVariableValue(color);

    root[name] = value;
  };

  // Register all default theme's variables
  defaultTheme?.getColors().forEach(color => {
    // Registers color variables
    registerColor(color);

    // Register variant variables
    color.getVariants().forEach(variant => {
      registerVariant(color, variant);
    });
  });

  return root;
}
