import { ThemeManager, Theme } from '../../src/theme/theme';

describe('The theme manager...', () => {
  it('can have default theme', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const manager = new ThemeManager().setDefaultTheme(defaultTheme);

    expect(manager.getDefaultTheme()).toBe(defaultTheme);
  });

  it('can have default light theme', () => {
    const defaultLightTheme = new Theme().setName('defaultLightTheme');
    const manager = new ThemeManager().setDefaultLightTheme(defaultLightTheme);

    expect(manager.getDefaultLightTheme()).toBe(defaultLightTheme);
  });

  it('can have default dark theme', () => {
    const defaultDarkTheme = new Theme().setName('defaultDarkTheme');
    const manager = new ThemeManager().setDefaultDarkTheme(defaultDarkTheme);

    expect(manager.getDefaultDarkTheme()).toBe(defaultDarkTheme);
  });

  it('can have a default theme, a default light theme and a default dark theme', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const defaultDarkTheme = new Theme().setName('defaultDarkTheme');
    const defaultLightTheme = new Theme().setName('defaultLightTheme');
    const manager = new ThemeManager()
      .setDefaultTheme(defaultTheme)
      .setDefaultLightTheme(defaultLightTheme)
      .setDefaultDarkTheme(defaultDarkTheme);

    expect(manager.getDefaultTheme()).toBe(defaultTheme);
    expect(manager.getDefaultLightTheme()).toBe(defaultLightTheme);
    expect(manager.getDefaultDarkTheme()).toBe(defaultDarkTheme);
  });

  it('can have a default theme and multiple other non-schemed ones', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const theme1 = new Theme().setName('theme1');
    const theme2 = new Theme().setName('theme2');

    const manager = new ThemeManager()
      .setDefaultTheme(defaultTheme)
      .addTheme(theme1)
      .addTheme(theme2);

    expect(manager.getDefaultTheme()).toBe(defaultTheme);
    expect(manager.getThemes()).toStrictEqual([theme1, theme2]);
    expect(manager.getAllThemes()).toStrictEqual([defaultTheme, theme1, theme2]);
  });

  it('can have a default schemed theme and multiple other schemed ones', () => {
    const defaultLightTheme = new Theme().setName('defaultLightTheme');
    const defaultDarkTheme = new Theme().setName('defaultDarkTheme');
    const theme1 = new Theme().setName('theme1');
    const theme2 = new Theme().setName('theme2');
    const theme3 = new Theme().setName('theme3');

    const manager = new ThemeManager()
      .setDefaultLightTheme(defaultLightTheme)
      .setDefaultDarkTheme(defaultDarkTheme)
      .addLightTheme(theme1)
      .addLightTheme(theme2)
      .addDarkTheme(theme3);

    expect(manager.getDefaultLightTheme()).toBe(defaultLightTheme);
    expect(manager.getDefaultDarkTheme()).toBe(defaultDarkTheme);
    expect(manager.getLightThemes()).toStrictEqual([theme1, theme2]);
    expect(manager.getDarkThemes()).toStrictEqual([theme3]);
    expect(manager.getAllThemes()).toStrictEqual([
      defaultLightTheme,
      defaultDarkTheme,
      theme1,
      theme2,
      theme3,
    ]);
  });
});
