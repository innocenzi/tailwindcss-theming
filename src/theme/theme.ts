import {
  ColorVariant,
  OpacityVariant,
  Variant,
  VariantType,
  VariantTransformer,
  ColorScheme,
  VariableColor,
} from '../api';
import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import { TwoLevelColorObject } from './colors/colorObject';
import { flattenColorObject } from './colors/flattenColorObject';
import _ from 'lodash';

export class Theme {
  private _name?: string;
  private _default: boolean;
  private _colorScheme: ColorScheme;
  private _targetable: boolean;
  private _colors: VariableColor[];
  private _globalVariants: Variant[];

  /**
   * Creates a new theme.
   */
  constructor() {
    // We don't want a theme to be targetable by default since it does
    // not have a default name.
    this._targetable = false;

    // Whether or not this theme is the default is changed by the theme
    // manager. This is still accessible to user-land but as an advanced
    // toggle.
    this._default = false;

    // By default, a theme has no specific color scheme. It's the theme
    // manager's responsibility to set one, even though the option is
    // accessible to user-land as an advanced feature.
    this._colorScheme = ColorScheme.Undefined;

    // We set the colors and variants.
    this._colors = [];
    this._globalVariants = [];
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
  getName(): string | undefined {
    return this._name;
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
    return ColorScheme.Undefined === this._colorScheme;
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

  addColors(colorObject: TwoLevelColorObject): this {
    const colors = flattenColorObject(colorObject);

    Object.entries(colors).forEach(color => {
      this._colors.push(new VariableColor(...color));
    });

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

    return this._colors.filter(color => colors?.includes(color.getName()));
  }

  /*
  |--------------------------------------------------------------------------
  | Variants
  |--------------------------------------------------------------------------
  */

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
    return this.addVariant(new Variant(name, transformer), colorNames);
  }

  /**
   * Add the given variant to a color or a list of colors.
   *
   * @param name The variant name.
   * @param colorNames The color name, or list of color names.
   */
  addVariant(variant: Variant, colorNames?: string | string[]): this {
    // If no color name is used, adding to all colors.
    if (!colorNames) {
      colorNames = this._colors.map(color => color.getName());
    }

    if (!Array.isArray(colorNames)) {
      colorNames = [colorNames];
    }

    // Running through each color name to add the variant to it.
    colorNames.forEach(colorName => {
      const predicate = (color: VariableColor) => color.getName() === colorName;
      const index = this._colors.findIndex(predicate);

      if (-1 !== index) {
        this._colors[index].addVariant(variant);
      } else {
        throw new Error(
          `Could not find the color ${colorName} on which to add variant ${name}.`
        );
      }
    });

    return this;
  }

  /**
   * Get all variants.
   */
  getVariants(): Variant[] {
    return _.flatten(this._colors.map(color => color.getVariants()));
  }

  /**
   * Get all color variants.
   */
  getColorVariants(): ColorVariant[] {
    return _.flatten(
      this._colors.map(color =>
        color.getVariants().filter(variant => variant.getType() === VariantType.Color)
      )
    ) as ColorVariant[];
  }

  /**
   * Get all opacity variants.
   */
  getOpacityVariants(): ColorVariant[] {
    return _.flatten(
      this._colors.map(color =>
        color.getVariants().filter(variant => variant.getType() === VariantType.Opacity)
      )
    ) as ColorVariant[];
  }

  /**
   * Get all custom variants.
   */
  getCustomVariants(): Variant[] {
    return _.flatten(
      this._colors.map(color =>
        color
          .getVariants()
          .filter(variant => variant.getType() === VariantType.Unspecified)
      )
    ) as Variant[];
  }
}
