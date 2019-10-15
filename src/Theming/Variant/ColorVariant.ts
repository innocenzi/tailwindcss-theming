import { TinyColor } from "@ctrl/tinycolor";
import { Variant } from "./Variant";

export class ColorVariant extends Variant {
  originalInput: string;
  color: TinyColor;

  constructor(name: string, value: string) {
    super(name);

    this.originalInput = value;
    this.color = new TinyColor(value);
  }
}
