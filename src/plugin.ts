import { ThemeManager } from './theme/themeManager';
import path from 'path';
import fs from 'fs';

/**
 * The default plugin options.
 */
const defaultOptions: ThemingPluginOptions = {
  path: 'theme.config.js',
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
  return {
    ...defaultOptions,
    ...options,
  };
}

export { defaultOptions, getThemeManager, getOptions };
