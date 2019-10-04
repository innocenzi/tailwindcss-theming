import { Color } from "./Color";

export interface Theme {
  type: 'light' | 'dark';
  colors: Color[];
}

export interface Themes {
  default: Theme;
  [name: string]: Theme;
}
