import { TailwindPluginHelpers } from 'tailwindcss';

/**
 * Plugin that creates CSS themes depending on the given configuration.
 *
 * @param cssConfiguration The tailwind plugin helpers.
 */
export function theming({ addBase }: TailwindPluginHelpers, cssConfiguration: any) {
  addBase(cssConfiguration);
}
