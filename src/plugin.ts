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
  const resolved = path.resolve(configPath);

  try {
    return require(resolved)?.default as ThemeBuilder;
  } catch {
    throw new Error(`Could not find the theme configuration file. Tried '${resolved}'.`);
  }
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

export { defaultOptions, getThemeBuilder, getOptions };
