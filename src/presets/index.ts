import { Nord } from './nord';

/**
 * The list of presets available.
 */
export const presets = {
  nord: Nord,
};

/**
 * The possible presets.
 */
export type Preset = keyof typeof presets;
