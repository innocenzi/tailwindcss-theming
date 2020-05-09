import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import {
  CustomVariant,
  Variant,
  ColorVariant,
  VariantType,
  OpacityVariant,
  VariantTransformer,
} from '../../api';
import _ from 'lodash';

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
  getVariantsByType(type: VariantType): Variant[] {
    return this._variants.filter(variant => variant.getType() === type) as Variant[];
  }

  /**
   * Get the name used for the Tailwind configuration. Kebab-cased.
   */
  getTailwindConfigurationName(): string {
    return _.kebabCase(this.getName());
  }

  /**
   * Get the value used for the Tailwind configuration.
   */
  getTailwindConfigurationValue(): string {
    // https://github.com/tailwindcss/tailwindcss/pull/1676
    // If that PR passes, this method will instead return a closure
    // which will have an opacity variable name as a parameter,
    // so that the opacity of this color can be changed via Tailwind CSS
    // opacity utilities instead of being hardcoded

    const { a } = this.getValue();
    const alpha = parseFloat(a.toFixed(8));
    const colorVariable = `var(${this.getCssVariableName()})`;

    return `rgba(${colorVariable}, ${alpha})`;
  }

  /**
   * Get the CSS color variable name generated in the final CSS.
   */
  getCssVariableName(): string {
    return `--color-${this.getTailwindConfigurationName()}`;
  }

  /**
   * Get the CSS variable value used in the final CSS.
   */
  getCssVariableValue(): string {
    // Opacity is hard-coded to the Tailwind configuration, because
    // opacity variants exist, and if this PR passes, Tailwind's opacity
    // utilities can be used instead.
    const { r, g, b } = this.getValue();

    return `${r}, ${g}, ${b}`;
  }
}
