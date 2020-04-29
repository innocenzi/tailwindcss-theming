import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import { Color } from '../../api';

export type CustomVariantTransformer = (color: TinyColor) => TinyColor;

export enum VariantType {
  /**
   * Replaces totally the color.
   */
  Color,

  /**
   * Changes the opacity of the color.
   */
  Opacity,

  /**
   * A custom, user-defined variant.
   */
  Custom,
}

export interface Variant {
  /**
   * Gets the type of the variant.
   */
  type: VariantType;

  /**
   * Gets the name of the variant.
   */
  getName: () => string;

  /**
   * Sets the name of the variant.
   */
  setName: (name: string) => void;

  /**
   * Gets the value of the variant.
   */
  getValue: () => any;

  /**
   * Sets the value of the variant.
   */
  setValue: (value: any) => void;
}

/**
 * A variant that replaces a color.
 */
export class ColorVariant extends Color implements Variant {
  constructor(name: string, value: ColorInput) {
    super(name, value);
  }

  get type(): VariantType {
    return VariantType.Color;
  }
}

/**
 * A variant that changes the opacity of a color.
 */
export class OpacityVariant implements Variant {
  private _name!: string;
  private _value!: number;

  constructor(name: string, value: number) {
    this.setName(name);
    this.setValue(value);
  }

  getValue(): number {
    return this._value;
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;

    return this;
  }

  setValue(value: number): this {
    this._value = value;

    return this;
  }

  get type(): VariantType {
    return VariantType.Opacity;
  }
}

/**
 * A custom variant that applies custom logic to a color.
 */
export class CustomVariant implements Variant {
  private _name: string;
  private _value?: TinyColor;
  private _transformer: CustomVariantTransformer;

  constructor(name: string, transformer: CustomVariantTransformer) {
    this._name = name;
    this._transformer = transformer;
  }

  getValue(): TinyColor {
    if (!this._value) {
      throw new Error(`The ${this._name} custom variant's value has not been defined.`);
    }

    return this._value;
  }

  setValue(color: TinyColor): this {
    this._value = this._transformer(color);

    return this;
  }

  getName(): string {
    return this._name;
  }

  setName(name: string): this {
    this._name = name;

    return this;
  }

  get type(): VariantType {
    return VariantType.Custom;
  }
}
