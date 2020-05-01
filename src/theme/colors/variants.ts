import { ColorInput, TinyColor } from '@ctrl/tinycolor';

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
   * Applies the variant on a color.
   *
   * @param input The color to apply the variant on.
   */
  apply(input: ColorInput): TinyColor;
}

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

  /**
   * Gets the computed value of the color.
   */
  apply(input: ColorInput): TinyColor {
    return this._transformer(new TinyColor(input));
  }
}

/**
 * A variant that replaces its color.
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
    super(name, color => new TinyColor(color).setAlpha(opacity));

    this._opacity = opacity;
  }

  getType(): VariantType {
    return VariantType.Opacity;
  }

  /**
   * Gets the opacity.
   */
  getOpacity(): number {
    return this._opacity;
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
