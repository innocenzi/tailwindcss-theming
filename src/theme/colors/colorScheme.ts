/**
 * Represents the color schemes usable by the themes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export enum ColorScheme {
  /**
   * Indicates that the theme has no specified color scheme.
   */
  Undefined = 'undefined',

  /**
   * Indicates that the theme is created for light themes.
   */
  Light = 'light',

  /**
   * Indicates that the theme is created for dark themes.
   */
  Dark = 'dark',
}
