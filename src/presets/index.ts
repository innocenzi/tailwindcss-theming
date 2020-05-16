import { Nord, NordVanilla } from './nord';
import { TailwindVanilla } from './tailwind';

/**
 * The list of presets available.
 */
export const presets = {
  nord: Nord,
  'nord-vanilla': NordVanilla,
  'tailwind-vanilla': TailwindVanilla,
};

/**
 * A type representing the possible presets.
 */
export type Preset = keyof typeof presets;

/**
 * The Nord theme color palette.
 * https://www.nordtheme.com/docs/colors-and-palettes
 */
export { NordPalette } from './nord';

/**
 * The Tailwind CSS color palette.
 * https://tailwindcss.com/docs/customizing-colors#default-color-palette
 */
export { TailwindPalette } from './tailwind';
