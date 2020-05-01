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

export interface IVariant {
  getType(): VariantType;
  getName(): string;
  apply(input: ColorInput): TinyColor;
}

export class CustomVariant implements IVariant {
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

  /**
   * Gets the type of variant.
   */
  getType(): VariantType {
    return VariantType.Custom;
  }

  /**
   * Gets the name of the variant.
   */
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

  /**
   * Gets the replacement color.
   */
  getReplacement(): ColorInput {
    return this._replacement;
  }

  /**
   * Gets the type of variant.
   */
  getType(): VariantType {
    return VariantType.Color;
  }
}

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

  /**
   * Gets the opacity.
   */
  getOpacity(): number {
    return this._opacity;
  }

  /**
   * Gets the type of variant.
   */
  getType(): VariantType {
    return VariantType.Opacity;
  }
}
