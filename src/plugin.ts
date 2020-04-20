import { ThemeBuilder } from './Theming/ThemeBuilder';
import path from 'path';

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
}

/**
 * Get the ThemeBuilder from the user theme file.
 *
 * @export
 * @param {string} configPath
 * @returns {ThemeBuilder}
 */
function getThemeBuilder(configPath: string): ThemeBuilder {
  return require(path.resolve(configPath))?.default as ThemeBuilder;
}

/**
 * Get a complete object of options, including defaults.
 *
 * @param {Partial<ThemingPluginOptions>} options
 * @returns {ThemingPluginOptions}
 */
function getOptions(options: Partial<ThemingPluginOptions>): ThemingPluginOptions {
  return {
    ...options,
    ...defaultOptions,
  };
}

export { defaultOptions, getThemeBuilder, getOptions };
