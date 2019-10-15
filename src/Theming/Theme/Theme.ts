import { ThemeType } from './ThemeType';
import { Color } from '../Color/Color';
import { parseColorObject } from '../Parser/Color/parseColorObject';
import { Colors } from '../Parser/Color/Colors';

export const DEFAULT_THEME_NAME = 'default';

export class Theme {
  private _name!: string;
  private _type!: ThemeType;
  private _colors: Color[];

  constructor() {
    this.name();
    this.light();
    this._colors = [];
  }

  /**
   * 
   * @param name 
   */
  name(name?: string) {
    this._name = name || DEFAULT_THEME_NAME;

    return this;
  }

  /**
   * Defines this theme as a light theme.
   * 
   * @returns self
   */
  light(): this {
    this._type = ThemeType.Light;

    return this;
  }

  /**
   * Defines this theme as a dark theme.
   * 
   * @returns self
   */
  dark(): this {
    this._type = ThemeType.Dark;

    return this;
  }

  /**
   * Sets the colors of this theme.
   * @param colors 
   * 
   * @returns self
   */
  colors(colors: Colors | Color[]): this {
    if (Array.isArray(colors)) {
      this._colors = colors;
    } else {
      this._colors = parseColorObject(colors);
    }

    return this;
  }
}
