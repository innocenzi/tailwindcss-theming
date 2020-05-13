import { ThemeManager } from './theme/theme';
import { Preset } from './presets';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { getPresetThemeManager } from './util/getPresetThemeManager';

/**
 * Possible types for the theme option.
 */
type ThemeOption = string | ThemeManager | false;

/**
 * The default plugin options.
 */
const defaultOptions: ThemingPluginOptions = {
  themes: 'theme.config.js',
  variants: {
    light: false,
    dark: false,
    noPreference: false,
    variantName: scheme => scheme,
    selectorName: scheme => scheme,
  },
};

/**
 * The options that a user can pass to the plugin.
 */
export interface ThemingPluginOptions {
  /**
   * Either a path to a file that exports a Theme Manager,
   * a Theme Manager,
   * or false to explicitly disable themes.
   */
  themes: ThemeOption;

  /**
   * A given preset.
   */
  preset?: Preset;

  /**
   * Configuration for the variant plugin.
   */
  variants: Partial<VariantPluginOptions>;
}

export interface VariantPluginOptions {
  /**
   * Enables the `light` variant.
   */
  light: boolean;

  /**
   * Enables the `dark` variant.
   */
  dark: boolean;

  /**
   * Enables the `no-preference` variant.
   */
  noPreference: boolean;

  /**
   * Defines the name of the variant's selector.
   *
   * @param {string} scheme The scheme name.
   */
  selectorName: (scheme: string) => string;

  /**
   * Defines the name of the variant.
   *
   * @param {string} scheme The scheme name.
   */
  variantName: (scheme: string) => string;
}

/**
 * Get the ThemeManager from the user theme file.
 *
 * @export
 * @param {string} themes
 * @returns {ThemeManager}
 */
function getThemeManagerFromThemeOption(themes: ThemeOption): ThemeManager | null {
  if (false === themes) {
    return null;
  }

  if (themes instanceof ThemeManager) {
    return themes;
  }

  const resolved = path.resolve(themes);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Could not find the theme configuration file. Tried '${resolved}'.`);
  }

  const config = require(resolved);

  if (!(config instanceof ThemeManager)) {
    throw new Error(`No theme manager found in the configuration file "${resolved}".`);
  }

  return <ThemeManager>config;
}

function getThemeManager(themes: ThemeOption, preset?: Preset): ThemeManager | null {
  return preset
    ? getPresetThemeManager(preset)
    : themes
    ? getThemeManagerFromThemeOption(themes)
    : null;
}

/**
 * Get a complete object of options, including defaults.
 *
 * @param {Partial<ThemingPluginOptions>} options
 * @returns {ThemingPluginOptions}
 */
function getOptions(options: Partial<ThemingPluginOptions>): ThemingPluginOptions {
  // Deep cloning is required, because somehow the defaultOptions are
  // merged with options and subsequent calls are merged with them too.
  return _.merge(_.cloneDeep(defaultOptions), _.cloneDeep(options));
}

export { defaultOptions, getThemeManagerFromThemeOption, getThemeManager, getOptions };
