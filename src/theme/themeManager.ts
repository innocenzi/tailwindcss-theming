import { Theme } from './theme';
import { ColorScheme } from './colors/colorScheme';

/**
 * The plugin's theme builder. It is an object that contains the
 * configured themes for the application, as well as other settings needed
 * to generate anything the user wants to be customized.
 */
export class ThemeManager {
  private _themes: Theme[];

  /**
   * Creates a theme manager.
   */
  constructor() {
    this._themes = [];
  }

  /*
  |--------------------------------------------------------------------------
  | Default Theme Setters
  |--------------------------------------------------------------------------
  */

  /**
   * Defines the default theme for every color scheme.
   */
  setDefaultTheme(theme: Theme): this {
    // We can't have more than one default theme.
    if (this.getDefaultTheme()) {
      throw new Error('Tried to set a default theme, but there was already one.');
    }

    // The default theme has no color scheme.
    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Undefined));

    return this;
  }

  setDefaultLightTheme(theme: Theme): this {
    // We can't have more than one default light theme.
    if (this.getDefaultLightTheme()) {
      throw new Error('Tried to set a default light theme, but there was already one.');
    }

    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Light));

    return this;
  }

  setDefaultDarkTheme(theme: Theme): this {
    // We can't have more than one default dark theme.
    if (this.getDefaultDarkTheme()) {
      throw new Error('Tried to set a default dark theme, but there was already one.');
    }

    this._themes.push(theme.setDefault().setColorScheme(ColorScheme.Dark));

    return this;
  }

  /*
  |--------------------------------------------------------------------------
  | Other Theme Adders
  |--------------------------------------------------------------------------
  */

  /**
   * Add a theme.
   */
  addTheme(theme: Theme): this {
    this._themes.push(theme);

    return this;
  }

  /**
   * Add a light theme.
   */
  addLightTheme(theme: Theme): this {
    return this.addTheme(theme.setColorScheme(ColorScheme.Light));
  }

  /**
   * Add a dark theme.
   */
  addDarkTheme(theme: Theme): this {
    return this.addTheme(theme.setColorScheme(ColorScheme.Dark));
  }

  /*
  |--------------------------------------------------------------------------
  | Theme getters.
  |--------------------------------------------------------------------------
  */

  /**
   * Gets every themes.
   */
  getAllThemes(): Theme[] {
    return this._themes;
  }

  /**
   * Get every theme, except the default one.
   */
  getThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Undefined);
  }

  /**
   * Get light-schemed themes, except the default one.
   */
  getLightThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Light);
  }

  /**
   * Get dark-schemed themes, except the default one.
   */
  getDarkThemes(): Theme[] {
    return this.getThemesFor(ColorScheme.Dark);
  }

  /**
   * Gets the default theme.
   */
  getDefaultTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Undefined);
  }

  /**
   * Gets the default light theme.
   */
  getDefaultLightTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Light);
  }

  /**
   * Gets the default dark theme.
   */
  getDefaultDarkTheme(): Theme | undefined {
    return this.getDefaultThemeFor(ColorScheme.Dark);
  }

  /**
   * Gets the default theme for the given scheme.
   */
  private getDefaultThemeFor(scheme: ColorScheme): Theme | undefined {
    return this._themes.find(
      theme => theme.isDefault() && scheme === theme.getColorScheme()
    );
  }

  /**
   * Gets all themes for the given scheme, except the default one.
   */
  private getThemesFor(scheme: ColorScheme): Theme[] {
    return this._themes.filter(
      theme => !theme.isDefault() && scheme === theme.getColorScheme()
    );
  }
}
