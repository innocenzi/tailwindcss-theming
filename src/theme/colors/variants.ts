import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import { Color } from '../../api';

// ------

export enum NVariantType {
  Unspecified,
  Color,
  Opacity,
}

export type VariantTransformer = (color: TinyColor) => TinyColor;

export interface NVariantInterface {
  getType(): NVariantType;
  getName(): string;
  apply(input: ColorInput): TinyColor;
}

export class NVariant implements NVariantInterface {
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
  getType(): NVariantType {
    return NVariantType.Unspecified;
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

export class NColorVariant extends NVariant {
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
  getType(): NVariantType {
    return NVariantType.Color;
  }
}

export class NOpacityVariant extends NVariant {
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
  getType(): NVariantType {
    return NVariantType.Opacity;
  }
}
