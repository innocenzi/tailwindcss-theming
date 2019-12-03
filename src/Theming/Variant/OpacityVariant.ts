import { Variant } from "./Variant";

export class OpacityVariant extends Variant {
  opacity: number;

  constructor(name: string, value: number, colors?: string[]) {
    super(name, colors);

    this.opacity = value;
  }
}
