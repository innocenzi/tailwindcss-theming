import { TinyColor } from '@ctrl/tinycolor';

export class Color {
  private _name!: string;
  private _value!: string;
  private _computed!: TinyColor;

  constructor(name?: string, value?: string) {
    this.name(name || 'transparent');
    this.value(value || 'transparent');
  }

  /**
   * Gets the color name.
   *
   * @readonly
   * @type {string}
   * @memberof Color
   */
  get keyName(): string {
    return this._name;
  }

  /**
   * Sets the name of this color.
   * @param name Color name.
   *
   * @returns self
   */
  name(name: string): this {
    this._name = name;

    return this;
  }

  /**
   * Sets the value of this color.
   * @param name Color name.
   *
   * @returns self
   */
  value(value: string): this {
    this._value = value;
    this._computed = new TinyColor(value);

    return this;
  }

  /**
   * Gets the color.
   *
   * @return TinyColor
   */
  get color() {
    return this._computed;
  }

  /**
   * Gets the computed color.
   *
   * @readonly
   * @memberof Color
   */
  get computed(): TinyColor {
    return this._computed;
  }

  /**
   * Gets the original value.
   *
   * @readonly
   * @memberof Color
   */
  get original(): string {
    return this._value;
  }
}
