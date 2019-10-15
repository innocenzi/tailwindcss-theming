import { ThemeScheme } from './ThemeScheme';
import { Color } from '../Color/Color';
import { parseColorObject } from '../Parser/Color/parseColorObject';
import { Colors } from '../Parser/Color/Colors';
import { Variant } from '../Variant/Variant';
import { OpacityVariant } from '../Variant/OpacityVariant';
import { ColorVariant } from '../Variant/ColorVariant';

export const DEFAULT_THEME_NAME = 'default';

/**
 * Maps variants to a list of colors.
 *
 * @export
 * @interface VariantMap
 */
export interface VariantMap {
  [variantName: string]: string[];
}

export class Theme {
  private _name!: string;
  private _scheme!: ThemeScheme;
  private _colors: Color[];
  private _variants: Variant[];
  private _variantMap: VariantMap;
  private _schemeDefault: boolean;
  private _keep: boolean;

  constructor() {
    this.default();
    this._keep = false;
    this._schemeDefault = false;
    this._colors = [];
    this._variants = [];
    this._variantMap = {};
  }

  /**
   * Sets this theme the default theme.
   *
   * @returns {this}
   * @memberof Theme
   */
  default(): this {
    this._name = DEFAULT_THEME_NAME;
    this.keep();
    this.schemeDefault();

    return this;
  }

  /**
   * Let the theme be set inside and outside the scheme media query.
   *
   * @returns {this}
   * @memberof Theme
   */
  keep(): this {
    this._keep = true;

    return this;
  }

  /**
   * Sets this theme as the default theme for the current scheme.
   *
   * @returns {this}
   * @memberof Theme
   */
  schemeDefault(): this {
    this._schemeDefault = true;

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
    this.hasVariant(name, true);
    this._variants.push(new OpacityVariant(name, value));
    this.mapVariant(name, colors);

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
    this.hasVariant(name, true);
    this._variants.push(new ColorVariant(name, value));
    this.mapVariant(name, colors);

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
   * Map a variant name to a list of color names. If the color list is empty, it will be mapped to every color.
   *
   * @param {string} name
   * @param {string[]} [colors]
   * @returns {this}
   * @memberof Theme
   */
  mapVariant(name: string, colors?: string[] | string): this {
    if (typeof colors === 'string') {
      colors = [ colors ];
    }

    if (!colors || !Array.isArray(colors)) {
      colors = this._colors.map<string>(color => color.keyName);
    }

    if (!(name in this._variantMap)) {
      this._variantMap[name] = [];
    }

    this._variantMap[name].push(...colors);

    return this;
  }

  /**
   * Gets the variants of the given color.
   *
   * @param {string} color
   * @returns {Variant[]}
   * @memberof Theme
   */
  variantsOf(color: string): Variant[] {
    return <Variant[]>Object.entries(this._variantMap).map<Variant | undefined>(([variantName, colors]) => {
      if (colors.find(m => m === color)) {
        return this._variants.find(v => v.name === variantName);
      }
    }).filter(Boolean);
  }

  /**
   * Checks if this theme is set as the default theme.
   *
   * @returns {boolean}
   * @memberof Theme
   */
  isDefault(): boolean {
    return this._name === DEFAULT_THEME_NAME;
  }

  /**
   * Checks if this theme is this scheme's default.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  isSchemeDefault(): boolean {
    return this._schemeDefault;
  }

  /**
   * Returns this theme's name.
   *
   * @returns {string}
   * @memberof Theme
   */
  getName(): string {
    return this._name;
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
   * Gets this theme's scheme.
   *
   * @returns {ThemeScheme}
   * @memberof Theme
   */
  get scheme(): ThemeScheme {
    return this._scheme;
  }

  /**
   * Defines if the theme has to stay outside its scheme media query.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  get kept(): boolean {
    return this._keep;
  }

  /**
   * Checks if this theme has a color scheme.
   *
   * @readonly
   * @type {boolean}
   * @memberof Theme
   */
  get hasScheme(): boolean {
    return undefined !== this._scheme;
  }

  /**
   * Gets the variant map.
   *
   * @readonly
   * @type {VariantMap}
   * @memberof Theme
   */
  get variantMap(): VariantMap {
    return this._variantMap;
  }
}
