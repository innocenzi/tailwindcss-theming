import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import {
  CustomVariant,
  IVariant,
  ColorVariant,
  VariantType,
  OpacityVariant,
  VariantTransformer,
} from '../../api';

export class Color {
  private _name!: string;
  private _value!: ColorInput;
  private _computed!: TinyColor;

  /**
   * Creates a color.
   */
  constructor(name: string, value: ColorInput) {
    this.setName(name);
    this.setValue(value);
  }

  /**
   * Gets the color's name.
   */
  getName(): string {
    return this._name;
  }

  /**
   * Sets the color's name.
   */
  setName(name: string): this {
    this._name = name;

    return this;
  }

  /**
   * Get the computed color value.
   */
  getValue(): TinyColor {
    return this._computed;
  }

  /**
   * Set the color.
   */
  setValue(value: ColorInput): this {
    this._value = value;
    this._computed = new TinyColor(value);

    return this;
  }

  /**
   * Gets the original value.
   */
  getOriginalValue(): ColorInput {
    return this._value;
  }
}

/**
 * A color that may be affected by multiple variants.
 */
export class VariableColor extends Color {
  private _variants: CustomVariant[];

  constructor(name: string, value: ColorInput) {
    super(name, value);

    this._variants = [];
  }

  /**
   * Adds a variant to that color.
   */
  setVariant(variant: CustomVariant): this {
    this._variants.push(variant);

    return this;
  }

  /**
   * Sets a color variant for that color.
   */
  setColorVariant(name: string, value: ColorInput): this {
    this._variants.push(new ColorVariant(name, value));

    return this;
  }

  /**
   * Sets a color variant for that color.
   */
  setOpacityVariant(name: string, value: number): this {
    this._variants.push(new OpacityVariant(name, value));

    return this;
  }

  /**
   * Sets a custom variant for that color.
   */
  setCustomVariant(name: string, transformer: VariantTransformer): this {
    this._variants.push(new CustomVariant(name, transformer));

    return this;
  }

  /**
   * Gets every variants for this color.
   */
  getVariants(): CustomVariant[] {
    return this._variants;
  }

  /**
   * Gets every color variant for this color.
   */
  getColorVariants(): ColorVariant[] {
    return this.getVariantsByType(VariantType.Color) as ColorVariant[];
  }

  /**
   * Gets every opacity variant for this color.
   */
  getOpacityVariants(): OpacityVariant[] {
    return this.getVariantsByType(VariantType.Opacity) as OpacityVariant[];
  }

  /**
   * Gets every custom variant for this color.
   */
  getCustomVariants(): CustomVariant[] {
    return this.getVariantsByType(VariantType.Custom) as CustomVariant[];
  }

  /**
   * Gets every variant of the specified type.
   */
  getVariantsByType(type: VariantType): IVariant[] {
    return this._variants.filter(variant => variant.getType() === type) as IVariant[];
  }
}
