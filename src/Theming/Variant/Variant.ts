import { Color } from "../Color/Color";

export const DEFAULT_VARIANT_NAME = 'default';

export abstract class Variant {
  name: string;
  colors: string[];

  constructor(name?: string, colors?: string[]) {
    this.name = name || DEFAULT_VARIANT_NAME;
    this.colors = colors || [];
  }
}
