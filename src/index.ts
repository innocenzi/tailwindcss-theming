import plugin from 'tailwindcss/plugin';
import { ThemingPluginOptions, getOptions, getThemeBuilder } from './plugin';

/**
 * Exports a Tailwind plugin, which overrides the config and
 * takes optional options.
 */
export = plugin.withOptions(
  /**
   * Function that returns another function, which is the Tailwind
   * plugin. The first function takes the user options in paramters.
   */
  (options: ThemingPluginOptions) => {
    const { path } = getOptions(options);
    const themes = getThemeBuilder(path);

    // The Tailwind plugin.
    return function ({ addBase }) {
      addBase({
        // ...
      });
    };
  },

  /**
   * Function that returns a Tailwind configuration object,
   * which overrides the user's. The user options are passed in
   * parameters.
   */
  (options: ThemingPluginOptions) => {
    const { path } = getOptions(options);
    const themes = getThemeBuilder(path);

    // Overrides some of the user's configuration.
    return {
      theme: {},
    };
  }
);
