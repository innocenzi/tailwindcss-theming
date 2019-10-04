export interface Configuration {
  /**
   * The key that will contain the theme's type value.
   */
  themeTypeKey: string;

  /**
   * The prefix of every color variable.
   */
  colorVariablePrefix: string;

  /**
   * If set to false, will disable the variants.
   */
  useVariants: boolean;

  /**
   * The prefix of the generated theme classes.
   */
  outputThemePrefix: string | false;
}
