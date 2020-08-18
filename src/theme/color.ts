import { ColorInput, TinyColor } from '@ctrl/tinycolor';
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
  getVariants(): Variant[] {
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
    return this._variants.filter((variant) => variant.getType() === type) as Variant[];
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
    // opacity utilities instead of being hardcoded in its value
    const alpha = parseFloat(this.getValue().a.toFixed(8));
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

export interface ColorObject {
  [name: string]: ColorInput | ColorObject;
}

export interface TwoLevelColorObject {
  [name: string]: ColorInput | ColorObject;
}

/**
 * Represents the color schemes usable by the themes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export enum ColorScheme {
  /**
   * Indicates that the theme has no specified color scheme.
   */
  Undefined = 'no-preference',

  /**
   * Indicates that the theme is created for light themes.
   */
  Light = 'light',

  /**
   * Indicates that the theme is created for dark themes.
   */
  Dark = 'dark',
}

/**
 * Represents the possible types of variants.
 */
export enum VariantType {
  /**
   * A normal variant.
   */
  Custom,
  /**
   * A variant that replaces the color by another.
   */
  Color,

  /**
   * A variant that changes the opacity of the color.
   */
  Opacity,
}

/**
 * Takes a color and returns a possibly transformed color.
 */
export type VariantTransformer = (color: TinyColor) => TinyColor;

/**
 * Represents a variant.
 */
export interface Variant {
  /**
   * The type of the variant.
   */
  getType(): VariantType;

  /**
   * The name of the variant.
   */
  getName(): string;

  /**
   * Gets the variant type name for registering CSS variables.
   */
  getVariantTypeName(): string;

  /**
   * Applies the variant on a color.
   *
   * @param input The color to apply the variant on.
   */
  apply(input: ColorInput): TinyColor;

  /**
   * Gets the name of the variant key for the Tailwind configuration.
   */
  getTailwindConfigurationName(): string;

  /**
   * Gets the value for this variant for the Tailwind configuration.
   */
  getTailwindConfigurationValue(color: VariableColor): string;

  /**
   * Gets the name of the CSS variable for this variant.
   */
  getCssVariableName(color: VariableColor): string;

  /**
   * Gets the value of the CSS variable for this variant.
   */
  getCssVariableValue(color: VariableColor): string;
}

/**
 * A variant that replaces its color thanks to a given logic.
 */
export class CustomVariant implements Variant {
  private _name: string;
  private _transformer: VariantTransformer;

  /**
   * Creates a variant.
   *
   * @param {string} name The variant's name.
   * @param {VariantTransformer} transformer The method to transform the color.
   */
  constructor(name: string, transformer: VariantTransformer) {
    this._name = name;
    this._transformer = transformer;
  }

  getType(): VariantType {
    return VariantType.Custom;
  }

  getName(): string {
    return this._name;
  }

  getVariantTypeName(): string {
    return 'custom-variant';
  }

  getTailwindConfigurationName(): string {
    return _.kebabCase(this.getName());
  }

  getCssVariableName(color: VariableColor): string {
    const variantTypeName = this.getVariantTypeName();
    const colorName = color.getTailwindConfigurationName(); // kebab-cased name
    const variantName = this.getTailwindConfigurationName(); // kebab-case name

    return `--${variantTypeName}-${colorName}-${variantName}`;
  }

  /**
   * Gets the computed value of the color.
   */
  apply(input: ColorInput): TinyColor {
    return this._transformer(new TinyColor(input));
  }

  /**
   * Gets an RGBA value separated by comas.
   */
  getCssVariableValue(color: VariableColor): string {
    const { r, g, b, a } = this.apply(color.getValue());
    const alpha = parseFloat(a.toFixed(8));

    return `${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha}`;
  }

  /**
   * Gets an RGBA value with the name of this variant's variable as a parameter.
   */
  getTailwindConfigurationValue(color: VariableColor): string {
    const variantVariable = `var(${this.getCssVariableName(color)})`;

    return `rgba(${variantVariable})`;
  }
}

/**
 * A variant that replaces its color by another color.
 */
export class ColorVariant extends CustomVariant {
  private _replacement: ColorInput;

  /**
   * Creates a color variant.
   *
   * @param name This variant's name.
   * @param replacement The replacement color.
   */
  constructor(name: string, replacement: ColorInput) {
    super(name, () => new TinyColor(replacement));

    this._replacement = replacement;
  }

  getType(): VariantType {
    return VariantType.Color;
  }

  getVariantTypeName(): string {
    return 'color-variant';
  }

  /**
   * Gets the replacement color.
   */
  getReplacement(): ColorInput {
    return this._replacement;
  }
}

/**
 * A variant that changes the opacity of its color.
 */
export class OpacityVariant extends CustomVariant {
  private _opacity: number;

  /**
   * Creates an opacity variant.
   *
   * @param name This variant's name.
   * @param opacity The new opacity.
   */
  constructor(name: string, opacity: number) {
    super(name, (color) => new TinyColor(color).setAlpha(opacity));

    this._opacity = opacity;
  }

  getType(): VariantType {
    return VariantType.Opacity;
  }

  getVariantTypeName(): string {
    return 'opacity-variant';
  }

  /**
   * Gets the opacity.
   */
  getOpacity(): number {
    return this._opacity;
  }

  /**
   * Gets an RGB value separated by comas.
   */
  getCssVariableValue(color: VariableColor): string {
    return parseFloat(this.getOpacity().toFixed(8)).toString();
  }

  /**
   * Gets an RGBA value with the name of the color variable as
   * the first parameter and this variant's variable as the second
   */
  getTailwindConfigurationValue(color: VariableColor): string {
    const colorVariable = `var(${color.getCssVariableName()})`;
    const opacityVariable = `var(${this.getCssVariableName(color)})`;

    return `rgba(${colorVariable}, ${opacityVariable})`;
  }
}

/**
 * Represents all the types accepted for an object-based variant value.
 */
export type VariantInput = ColorInput | VariantTransformer | number;

/**
 * An object that contains multiple variants of multiple types.
 */
export interface VariantsObject {
  [variantName: string]: VariantInput | MappedVariant;
}

/**
 * Represents a variant mapped to one or multiple colors.
 */
export interface MappedVariant {
  variant: VariantInput;
  colors: string | string[];
}
