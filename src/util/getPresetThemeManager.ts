import { ThemeManager } from '../theme/theme';
import { presets, Preset } from '../presets';
import { Errors } from '../errors';
import _ from 'lodash';

/**
 * Gets the Theme Manager of a preset.
 * @param name The preset name.
 */
export function getPresetThemeManager(name: Preset): ThemeManager {
  if (!_.has(presets, name)) {
    throw new Error(
      Errors.UNKOWN_PRESET + ` Try one of these: ${Object.keys(presets).join(', ')}.`
    );
  }

  return presets[name];
}
