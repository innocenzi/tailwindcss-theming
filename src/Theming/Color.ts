import { OpacityVariant } from "./OpacityVariant";

export interface Color {
  name: string;
  value: string;
  opacityVariants: OpacityVariant[];
  outputFormat: 'rgb' | 'text';
}
