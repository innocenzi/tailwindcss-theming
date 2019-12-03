import { ThemeScheme } from './ThemeScheme';
import { Color } from '../Color/Color';
import { parseColorObject } from '../Parser/Color/parseColorObject';
import { Colors } from '../Parser/Color/Colors';
import { Variant } from '../Variant/Variant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { ColorVariant } from '../Variant/ColorVariant';
import { CustomProperty, CustomPropertyValueType } from '../CustomProperty/CustomProperty';

export const DEFAULT_THEME_NAME = 'default';

export class Theme {
  private _name?: string;
  private _scheme?: ThemeScheme;
  private _colors: Color[];
  private _customProperties: CustomProperty[];
  private _variants: Variant[];
  private _assignable: boolean;
  private _default!: boolean;

  constructor() {
    this._assignable = false;
    this._colors = [];
    this._customProperties = [];
    this._variants = [];
  }

  /**
   * Sets this theme the default theme.
   *
   * @returns {this}
   * @memberof Theme
   */
  default(): this {
    this._default = true;
    this._name = this._name || DEFAULT_THEME_NAME;

    return this;
  }

  /**
   * Defines if this theme must be assignable by strategy.
   *
   * @returns {this}
   * @memberof Theme
   */
  assignable(): this {
    this._assignable = true;

    return this;
  }

  /**
   * Sets the name of this theme.
   *
   * @param {string} [name]
   * @returns {(this | string)}
   * @memberof Theme
   */
  name(name: string): this {
    this._name = name;

    return this;
  }

  /**
   * Defines this theme as a light theme.
   *
   * @returns {this}
   * @memberof Theme
   */
  light(): this {
    this._scheme = ThemeScheme.Light;

    return this;
  }

  /**
   * Defines this theme as a dark theme.
   *
   * @returns {this}
   * @memberof Theme
   */
  dark(): this {
    this._scheme = ThemeScheme.Dark;

    return this;
  }

  /**
   * Sets a variable on this theme.
   *
   * @param {string} name
   * @param {CustomPropertyValueType} value
   * @param {string} [extend]
   * @param {string|false} [prefix]
   * @param {boolean} [parse=true]
   * @returns {this}
   * @memberof Theme
   */
  customProperty(name: string, value: CustomPropertyValueType, extend?: string, prefix?: string | false, parse: boolean = true): this {
    this._customProperties.push(new CustomProperty(name, value, extend, prefix, parse));

    return this;
  }

  /**
   * Sets a variable on this theme.
   *
   * @param {string} name
   * @param {CustomPropertyValueType} value
   * @param {string} [extend]
   * @param {string|false} [prefix]
   * @param {boolean} [parse=true]
   * @returns {this}
   * @memberof Theme
   */
  variable(name: string, value: CustomPropertyValueType, extend?: string, prefix?: string | false, parse: boolean = true): this {
    return this.customProperty(name, value, extend, prefix, parse);
  }

  /**
   * Sets a color on this theme.
   *
   * @param {string} name
   * @param {string} value
   * @returns {this}
   * @memberof Theme
   */
  color(name: string, value: string): this {
    this._colors.push(new Color().name(name).value(value));

    return this;
  }

  /**
   * Sets the colors of this theme.
   *
   * @param {(Colors | Color[])} colors
   * @returns {(this | string)}
   * @memberof Theme
   */
  colors(colors: Colors | Color[]): this {
    if (Array.isArray(colors)) {
      this._colors = colors;
    } else {
      this._colors = parseColorObject(colors);
    }

    return this;
  }

  /**
   * Adds an opacity variant.
   *
   * @param {string} name Name of the variant.
   * @param {number} value Value of the variant.
   * @param {string[]} [colors] The color keys to be associated to. If empty, this will be a general variant.
   * @returns {this}
   * @memberof Theme
   */
  opacityVariant(name: string, value: number, colors?: string[] | string): this {
    this.checkVariantUniqueness(name, colors, true);
    this._variants.push(new OpacityVariant(name, value, !colors ? [] : Array.isArray(colors) ? colors : [colors]));

    return this;
  }

  /**
   * Adds a color variant.
   *
   * @param {string} name Name of the variant.
   * @param {number} value Value of the variant.
   * @param {string[]} [colors] The color keys to be associated to. If empty, this will be a general variant.
   * @returns {this}
   * @memberof Theme
   */
  colorVariant(name: string, value: string, colors?: string[] | string): this {
    this.checkVariantUniqueness(name, colors, true);
    this._variants.push(new ColorVariant(name, value, !colors ? [] : Array.isArray(colors) ? colors : [colors]));

    return this;
  }

  /**
   * Checks if a variant exists on this theme.
   *
   * @param {string} name Variant name.
   * @param {boolean} [throws=false] Throws an error if the variant exists.
   * @throws If `throws` is set to `true` and the variant exists.
   * @returns {boolean}
   * @memberof Theme
   */
  hasVariant(name: string, throws: boolean = false): boolean {
    let exists = this._variants.find(v => v.name === name);

    if (exists && throws) {
      throw new Error(`Variant ${name} already exists.`);
    }

    return !!exists;
  }

  /**
   * Checks if a variant exists for a color on this theme.
   *
   * @param {string} name Variant name.
   * @param {(string[] | string)} [colors] Colors.
   * @param {boolean} [throws=false] Throws an exception.
   * @returns {boolean}
   * @memberof Theme
   */
  checkVariantUniqueness(name: string, colors?: string[] | string, throws: boolean = false): boolean {
    if (typeof colors === 'string' || (Array.isArray(colors) && 1 === colors.length)) {
      let color = Array.isArray(colors) ? colors[0] : colors;
      let exists = this._variants.find(v => v.name === name && v.colors.length === 1 && v.colors[0] === color);

      if (exists && throws) {
        throw new Error(`Variant ${name} already exists for the color '${color}'.`);
      }

      return !!exists;
    }

    return this.hasVariant(name, true);
  }

  /**
   * Gets the variants of the given color.
   *
   * @param {string} color
   * @returns {Variant[]}
   * @memberof Theme
   */
  variantsOf(color: string): Variant[] {
    return this._variants.filter(variant => variant.colors.includes(color) || 0 === variant.colors.length);
  }

  /**
   * Checks if this theme is set as the default theme.
   *
   * @returns {boolean}
   * @memberof Theme
   */
  isDefault(): boolean {
    return this._default;
  }

  /**
   * Returns this theme's name.
   *
   * @returns {string}
   * @memberof Theme
   */
  getName(): string | null {
    return this._name || null;
  }

  /**
   * Returns this theme's colors.
   *
   * @returns {Color[]}
   * @memberof Theme
   */
  getColors(): Color[] {
    return this._colors;
  }

  /**
   * Return this theme's custom properties.
   *
   * @returns {CustomProperty[]}
   * @memberof Theme
   */
  getCustomProperties(): CustomProperty[] {
    return this._customProperties;
  }

  /**
   * Gets this theme's scheme.
   *
   * @returns {ThemeScheme}
   * @memberof Theme
   */
  getScheme(): ThemeScheme | null {
    return this._scheme || null;
  }

  /**
   * Gets if this theme has a defined name.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  hasName(): boolean {
    return undefined !== this._name && this._name.length > 0;
  }

  /**
   * Gets if this theme must be assignable by strategy.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  isAssignable(): boolean {
    return this._assignable;
  }

  /**
   * Checks if this theme has a color scheme.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  hasScheme(): boolean {
    return undefined !== this._scheme;
  }
}
