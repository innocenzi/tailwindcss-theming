import { ColorInput } from '@ctrl/tinycolor';
import {
  ColorObject,
  ColorScheme,
  VariableColor,
  VariantsObject,
  VariantInput,
  ColorVariant,
  OpacityVariant,
  VariantTransformer,
  CustomVariant,
  Variant,
  VariantType,
} from './color';
import { flattenColorObject } from '../util/flattenColorObject';
import { isMappedVariant } from '../util/isMappedVariant';
import { VariableInput, Variable } from './variable';
import { generateTailwindConfiguration } from '../util/generateTailwindConfiguration';
import { generateCssConfiguration } from '../util/generateCssConfiguration';
import { Strategy } from './strategy';
import _ from 'lodash';
import { isColorInput } from '../util/isColorInput';

/**
 * The plugin's theme builder. It is an object that contains the
 * configured themes for the application, as well as other settings needed
 * to generate anything the user wants to be customized.
 */
export class ThemeManager {
  private _themes: Theme[];
  private _strategy?: Strategy;
  private _prefix?: string;

  /**
   * Creates a theme manager.
   */
  constructor() {
    this._themes = [];
  }

  /*
  |--------------------------------------------------------------------------
  | Default Theme Setters
  |--------------------------------------------------------------------------
  */

  /**
   * Defines the default theme for every color scheme.
   */
  setDefaultTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    // We can't have more than one default theme.
    if (this.getDefaultTheme()) {
      throw new Error('Tried to set a default theme, but there was already one.');
    }

    // The default theme has no color scheme.
    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Undefined));

    return this;
  }

  setDefaultLightTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    // We can't have more than one default light theme.
    if (this.getDefaultLightTheme()) {
      throw new Error('Tried to set a default light theme, but there was already one.');
    }

    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Light));

    return this;
  }

  setDefaultDarkTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    // We can't have more than one default dark theme.
    if (this.getDefaultDarkTheme()) {
      throw new Error('Tried to set a default dark theme, but there was already one.');
    }

    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Dark));

    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | Other Theme Adders
  |--------------------------------------------------------------------------
  */

  /**
   * Add a theme.
   */
  addTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    this._themes.push(theme);

    return this;
  }

  /**
   * Add a light theme.
   */
  addLightTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    return this.addTheme(theme.setColorScheme(ColorScheme.Light));
  }

  /**
   * Add a dark theme.
   */
  addDarkTheme(theme: Theme): this {
    theme = _.cloneDeep(theme);

    return this.addTheme(theme.setColorScheme(ColorScheme.Dark));
  }

  /*
  |--------------------------------------------------------------------------
  | Theme getters.
  |--------------------------------------------------------------------------
  */

  /**
   * Gets every themes.
   */
  getAllThemes(): Theme[] {
    return this._themes;
  }

  /**
   * Get every theme, except the default one.
   */
  getThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Undefined);
  }

  /**
   * Get light-schemed themes, except the default one.
   */
  getLightThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Light);
  }

  /**
   * Get dark-schemed themes, except the default one.
   */
  getDarkThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Dark);
  }

  /**
   * Gets the default theme.
   */
  getDefaultTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Undefined);
  }

  /**
   * Gets the default light theme.
   */
  getDefaultLightTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Light);
  }

  /**
   * Gets the default dark theme.
   */
  getDefaultDarkTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Dark);
  }

  /**
   * Gets the default theme for the given scheme.
   */
  private getDefaultThemeFor(scheme: ColorScheme): Theme | undefined {
    return this._themes.find(
      (theme) => theme.isDefault() && scheme === theme.getColorScheme()
    );
  }

  /**
   * Gets all themes for the given scheme, except the default one.
   */
  private getThemesFor(scheme: ColorScheme): Theme[] {
    return this._themes.filter(
      (theme) => !theme.isDefault() && scheme === theme.getColorScheme()
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Strategy-related
  |--------------------------------------------------------------------------
  */

  /**
   * Defines the prefix used for the strategy.
   */
  setPrefix(prefix: string): this {
    this._prefix = prefix;

    return this;
  }

  /**
   * Gets the prefix used for the strategy.
   */
  getPrefix(): string | undefined {
    return this._prefix;
  }

  /**
   * Defines the strategy used for theme selection.
   */
  setStrategy(strategy: Strategy): this {
    this._strategy = strategy;

    return this;
  }

  /**
   * Gets the strategy used for theme selection.
   */
  getStrategy(): Strategy | undefined {
    return this._strategy;
  }

  /*
  |--------------------------------------------------------------------------
  | Strategies
  |--------------------------------------------------------------------------
  */

  /**
   * Each theme will be exported as a `data-theme` attribute.
   * You will be able to use a theme by setting the attribute `data-theme` with the value `<themeName>` on a node.
   * The CSS rule will be `[data-theme=<themeName>]`.
   */
  asDataThemeAttributes(): this {
    this.setStrategy(Strategy.DataThemeAttribute);

    return this;
  }

  /**
   * Each theme will be exported as a data attribute.
   * You will be able to use a theme by setting the attribute `data-<themeName>` on a node. The CSS rule will be `[data-<themeName>]`.
   */
  asDataAttributes(): this {
    this.setStrategy(Strategy.DataAttribute);

    return this;
  }

  /**
   * Each theme will be exported in a class.
   * You will be able to use a theme by applying the class `.<themeName>` on a node. The CSS rule will be `.<themeName>`.
   */
  asClasses(): this {
    this.setStrategy(Strategy.Class);

    return this;
  }

  /**
   * Each theme will be exported as an attribute with a prefix.
   * You will be able to use a theme by setting the attribute `<choosenPrefix>-<themeName>` on a node.
   * The CSS rule will be `[<choosenPrefix>-<themeName>]`.
   */
  asPrefixedAttributes(prefix: string = 'theme'): this {
    this.setStrategy(Strategy.PrefixedAttribute);
    this.setPrefix(prefix);

    return this;
  }

  /**
   * Each theme will be exported in a class with a prefix.
   * You will be able to use a theme by applying the class `.<choosenPrefix>-<themeName>` on a node.
   * The CSS rule will be `.<choosenPrefix>-<themeName>`.
   */
  asPrefixedClasses(prefix: string = 'theme'): this {
    this.setStrategy(Strategy.PrefixedClass);
    this.setPrefix(prefix);

    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | Plugin
  |--------------------------------------------------------------------------
  */

  /**
   * Gets the Tailwind configuration for this theme manager.
   */
  getTailwindConfiguration(): any {
    return generateTailwindConfiguration(this);
  }

  /**
   * Gets an object that generates the themes' CSS inside the addBase helper.
   */
  getCssConfiguration(): any {
    return generateCssConfiguration(this);
  }
}

export class Theme {
  private _name?: string;
  private _default: boolean;
  private _colorScheme: ColorScheme;
  private _targetable: boolean;
  private _colors: VariableColor[];
  private _variables: Variable[];

  /**
   * Creates a new theme.
   */
  constructor() {
    // We don't want a theme to be targetable by default.
    this._targetable = false;

    // Whether or not this theme is the default is changed by the theme
    // manager. This is still accessible to user-land but as an advanced
    // toggle.
    this._default = false;

    // By default, a theme has no specific color scheme. It's the theme
    // manager's responsibility to set one, even though the option is
    // accessible to user-land as an advanced feature.
    this._colorScheme = ColorScheme.Undefined;

    // We set the colors and variables.
    this._colors = [];
    this._variables = [];
  }

  /*
  |--------------------------------------------------------------------------
  | Name
  |--------------------------------------------------------------------------
  */

  /**
   * Defines this theme's name.
   */
  setName(name: string): this {
    this._name = name;

    return this;
  }

  /**
   * Gets this theme's name.
   */
  getName(): string {
    return this._name ?? (this.hasScheme() ? this.getColorScheme() : 'default');
  }

  /*
  |--------------------------------------------------------------------------
  | Targetable
  |--------------------------------------------------------------------------
  */

  /**
   * Defines this theme as targetable, which means it can be selected
   * with a CSS selector.
   */
  targetable(): this {
    this._targetable = true;

    return this;
  }

  /**
   * Defines this theme as untargetable, which means it can not be selected
   * with a CSS selector.
   */
  untargetable(): this {
    this._targetable = false;

    return this;
  }

  /**
   * Determines if this theme is targetable.
   */
  isTargetable(): boolean {
    return this._targetable;
  }

  /*
  |--------------------------------------------------------------------------
  | Default
  |--------------------------------------------------------------------------
  */

  /**
   * Defines whether or not this theme is the default for
   * its color scheme.
   */
  setDefault(shouldBeDefault: boolean = true): this {
    this._default = shouldBeDefault;

    return this;
  }

  /**
   * Determines if this theme is the default for its color
   * scheme.
   */
  isDefault(): boolean {
    return this._default;
  }

  /*
  |--------------------------------------------------------------------------
  | Color Schemes
  |--------------------------------------------------------------------------
  */

  /**
   * Defines the color scheme of this theme.
   */
  setColorScheme(colorScheme: ColorScheme): this {
    this._colorScheme = colorScheme;

    return this;
  }

  /**
   * Gets the color scheme of this theme.
   */
  getColorScheme(): ColorScheme {
    return this._colorScheme;
  }

  /**
   * Determines if the theme is for a light scheme.
   */
  isLight(): boolean {
    return ColorScheme.Light === this._colorScheme;
  }

  /**
   * Determines if the theme is for a dark scheme.
   */
  isDark(): boolean {
    return ColorScheme.Dark === this._colorScheme;
  }

  /**
   * Determines if the theme has no color scheme.
   */
  hasNoScheme(): boolean {
    return !this.hasScheme();
  }

  /**
   * Determines if the theme has a color scheme.
   */
  hasScheme(): boolean {
    return ColorScheme.Undefined !== this._colorScheme;
  }

  /**
   * Sets this theme's color scheme to light.
   */
  light(): this {
    this.setColorScheme(ColorScheme.Light);

    return this;
  }

  /**
   * Sets this theme's color scheme to dark.
   */
  dark(): this {
    this.setColorScheme(ColorScheme.Dark);

    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | Colors
  |--------------------------------------------------------------------------
  */

  /**
   * Adds the given colors to the theme.
   *
   * @param colorObject An object of colors, the same format as Tailwind's, but any TinyColor value can be used.
   */
  addColors(colorObject: ColorObject): this {
    const colors = flattenColorObject(colorObject);

    Object.entries(colors).forEach((color) => {
      this.color(...color);
    });

    return this;
  }

  /**
   * Adds a color to the theme.
   *
   * @param name The name of the color. Will be used for class names.
   * @param color
   */
  color(name: string, color: ColorInput): this {
    this._colors.push(new VariableColor(name, color));

    return this;
  }

  /**
   * Gets all colors in the theme.
   *
   * @param colors A string or an array of color names to filter.
   */
  getColors(colors?: string | string[]): VariableColor[] {
    if (!colors) {
      return this._colors;
    }

    if (!Array.isArray(colors)) {
      colors = [colors];
    }

    return this._colors.filter((color) => colors?.includes(color.getName()));
  }

  /*
  |--------------------------------------------------------------------------
  | Variants
  |--------------------------------------------------------------------------
  */

  /**
   * Adds the given variants.
   *
   * @param variants A variant object.
   */
  addVariants(variants: VariantsObject): this {
    // Detects the type of the variant depending of its
    // content, and adds it
    const detectAndAddVariant = (
      name: string,
      value: VariantInput,
      colors?: string | string[]
    ) => {
      // It's a custom one
      if (_.isFunction(value)) {
        return this.addCustomVariant(name, value, colors);
      }

      // It's an opacity one
      if (_.isNumber(value)) {
        return this.addOpacityVariant(name, value, colors);
      }

      // It's a color one
      if (_.isString(value)) {
        return this.addColorVariant(name, value, colors);
      }

      throw new Error(`Unrecoginized variant '${name}' of value '${value}'.`);
    };

    // Loop through the variants
    Object.entries(variants).forEach(([name, value]) => {
      // If it's an object, it's mapped to some colors
      if (isMappedVariant(value)) {
        return detectAndAddVariant(name, value.variant, value.colors);
      }

      // It's a scalar value
      detectAndAddVariant(name, value);
    });

    return this;
  }

  /**
   * Add the given color variant to a color or a list of colors.
   *
   * @param name The variant name.
   * @param value The variant value.
   * @param colorNames The color name, or list of color names.
   */
  addColorVariant(name: string, value: ColorInput, colorNames?: string | string[]): this {
    return this.addVariant(new ColorVariant(name, value), colorNames);
  }

  /**
   * Add the given opacity variant to a color or a list of colors.
   *
   * @param name The variant name.
   * @param opacity The opacity value.
   * @param colorNames The color name, or list of color names.
   */
  addOpacityVariant(name: string, opacity: number, colorNames?: string | string[]): this {
    return this.addVariant(new OpacityVariant(name, opacity), colorNames);
  }

  /**
   * Add the given custom variant to a color or a list of colors.
   *
   * @param name The variant name.
   * @param value The variant value.
   * @param colorNames The color name, or list of color names.
   */
  addCustomVariant(
    name: string,
    transformer: VariantTransformer,
    colorNames?: string | string[]
  ): this {
    return this.addVariant(new CustomVariant(name, transformer), colorNames);
  }

  /**
   * Add the given variant to a color or a list of colors.
   *
   * @param name The variant name.
   * @param colorNames The color name, or list of color names.
   */
  addVariant(variant: CustomVariant, colorNames?: string | string[]): this {
    // If no color name is used, adding to all colors.
    if (!colorNames) {
      colorNames = this._colors.map((color) => color.getName());
    }

    if (!Array.isArray(colorNames)) {
      colorNames = [colorNames];
    }

    // Running through each color name to add the variant to it.
    colorNames.forEach((colorName) => {
      const predicate = (color: VariableColor) => color.getName() === colorName;
      const index = this._colors.findIndex(predicate);

      if (-1 !== index) {
        this._colors[index].setVariant(variant);
      } else {
        throw new Error(
          `Could not find the color '${colorName}' on which to add variant '${variant.getName()}'.`
        );
      }
    });

    return this;
  }

  /**
   * Get all variants.
   */
  getVariants(): Variant[] {
    return _.flatten(this._colors.map((color) => color.getVariants()));
  }

  /**
   * Get all color variants.
   */
  getColorVariants(): ColorVariant[] {
    return _.flatten(
      this._colors.map((color) =>
        color.getVariants().filter((variant) => variant.getType() === VariantType.Color)
      )
    ) as ColorVariant[];
  }

  /**
   * Get all opacity variants.
   */
  getOpacityVariants(): ColorVariant[] {
    return _.flatten(
      this._colors.map((color) =>
        color.getVariants().filter((variant) => variant.getType() === VariantType.Opacity)
      )
    ) as ColorVariant[];
  }

  /**
   * Get all custom variants.
   */
  getCustomVariants(): CustomVariant[] {
    return _.flatten(
      this._colors.map((color) =>
        color.getVariants().filter((variant) => variant.getType() === VariantType.Custom)
      )
    ) as CustomVariant[];
  }

  /*
  |--------------------------------------------------------------------------
  | Variables
  |--------------------------------------------------------------------------
  */

  /**
   * Adds an arbitrary variable to the theme.
   *
   * @param name The name of the variable.
   * @param value The value of the variable.
   * @param path An optional path to a Tailwind configuration key.
   * @param prefix An optional prefix to be appended to the variable name.
   */
  setVariable(
    name: string,
    value: VariableInput | VariableInput[],
    path?: string,
    prefix?: string
  ): this {
    this._variables.push(new Variable(name, value, path, prefix));

    return this;
  }

  /**
   * Gets every variable.
   */
  getVariables(): Variable[] {
    return this._variables;
  }
}
