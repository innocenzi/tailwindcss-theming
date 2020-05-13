import { Nord, NordVanilla } from './nord';

/**
 * The list of presets available.
 */
export const presets = {
  nord: Nord,
  'nord-vanilla': NordVanilla,
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
