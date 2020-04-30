import plugin from 'tailwindcss/plugin';
import {
  ThemingPluginOptions,
  getOptions,
  getThemeManager,
  VariantPluginOptions,
} from './plugin';
import { TailwindPluginHelpers } from 'tailwindcss';
import { schemeVariant } from './plugins/schemeVariants';

/**
 * Exports a Tailwind plugin, which overrides the config and
 * takes optional options.
 */
export = plugin.withOptions(
  /**
   * Returns the actual Tailwind plugin, and takes as parameters
   * the plugin's options.
   */
  (options: ThemingPluginOptions) => {
    const { path, preset, variants } = getOptions(options);
    const themes = preset ?? getThemeManager(path);

    // The Tailwind plugin.
    return function (helpers: TailwindPluginHelpers) {
      // Applies the scheme variant plugin
      schemeVariant(helpers, variants as VariantPluginOptions);

      // Applies the theming plugin
      // TODO
    };
  },

  /**
   * Returns a configuration that replaces the user's Tailwind configuration.
   * Takes as parameters the plugin's options.
   */
  (options: ThemingPluginOptions) => {
    const { path, preset } = getOptions(options);
    const themes = preset ?? getThemeManager(path);

    // Overrides some of the user's configuration.
    return {
      theme: {},
    };
  }
);
