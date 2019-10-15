import { DEFAULT_THEME_NAME } from "../Theme/Theme";

const DEFAULT_VARIANT_NAME = 'default';

export abstract class Variant {
  name: string;

  constructor(name?: string) {
    this.name = name || DEFAULT_THEME_NAME;
  }
}
