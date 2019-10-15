import { TinyColor } from "@ctrl/tinycolor";

export class ColorVariant {
  name: string;
  value: string;
  color: TinyColor;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
    this.color = new TinyColor(value);
  }
}
