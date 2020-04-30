import { ThemeManager } from './theme/themeManager';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

/**
 * The default plugin options.
 */
const defaultOptions: ThemingPluginOptions = {
  path: 'theme.config.js',
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
   * The path to the theme file.
   */
  path: string;

  /**
   * A given preset.
   */
  preset?: ThemeManager;

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
 * @param {string} configPath
 * @returns {ThemeManager}
 */
function getThemeManager(configPath: string): ThemeManager {
  const resolved = path.resolve(configPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`Could not find the theme configuration file. Tried '${resolved}'.`);
  }

  return require(resolved)?.default as ThemeManager;
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

export { defaultOptions, getThemeManager, getOptions };
