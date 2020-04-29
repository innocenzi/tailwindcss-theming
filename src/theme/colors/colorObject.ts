import { ColorInput } from '@ctrl/tinycolor';

export interface ColorObject {
  [name: string]: ColorInput;
}

export interface TwoLevelColorObject {
  [name: string]: ColorInput | ColorObject;
}
