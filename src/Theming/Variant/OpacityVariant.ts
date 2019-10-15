import { Variant } from "./Variant";

export class OpacityVariant extends Variant {
  opacity: number;

  constructor(name: string, value: number) {
    super(name);

    this.opacity = value;
  }
}
