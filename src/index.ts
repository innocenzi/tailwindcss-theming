import plugin from 'tailwindcss/plugin';
import {
  ThemingPluginOptions,
  getOptions,
  getThemeManager,
  VariantPluginOptions,
} from './plugin';
import { TailwindPluginHelpers } from 'tailwindcss';
import { schemeVariant, theming } from './plugins';

/**
 * Exports a Tailwind plugin, which overrides the config and
 * takes optional options.
 */
export = plugin.withOptions(
  /**
   * Returns the actual Tailwind plugin, and takes as parameters
   * the plugin's options.
   */
  function (options: ThemingPluginOptions) {
    const { themes, preset, variants } = getOptions(options);
    const manager = getThemeManager(themes, preset);

    // The Tailwind plugin.
    return function (helpers: TailwindPluginHelpers) {
      // Applies the scheme variant plugin
      schemeVariant(helpers, variants as VariantPluginOptions);

      // Applies the theming plugin
      if (manager) {
        theming(helpers, manager.getCssConfiguration());
      }
    };
  },

  /**
   * Returns a configuration that replaces the user's Tailwind configuration.
   * Takes as parameters the plugin's options.
   */
  function (options: ThemingPluginOptions) {
    const { themes, preset } = getOptions(options);
    const manager = getThemeManager(themes, preset);

    // Overrides some of the user's configuration.
    return manager ? manager.getTailwindConfiguration() : {};
  }
);
