import { ThemeManager, Theme } from '../../src/theme/theme';

describe('The theme manager...', () => {
  it('can have default theme', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const manager = new ThemeManager().setDefaultTheme(defaultTheme);

    expect(manager.getDefaultTheme().getName()).toBe(defaultTheme.getName());
  });

  it('can have default light theme', () => {
    const defaultLightTheme = new Theme().setName('defaultLightTheme');
    const manager = new ThemeManager().setDefaultLightTheme(defaultLightTheme);

    expect(manager.getDefaultLightTheme().getName()).toBe(defaultLightTheme.getName());
  });

  it('can have default dark theme', () => {
    const defaultDarkTheme = new Theme().setName('defaultDarkTheme');
    const manager = new ThemeManager().setDefaultDarkTheme(defaultDarkTheme);

    expect(manager.getDefaultDarkTheme().getName()).toBe(defaultDarkTheme.getName());
  });

  it('can have a default theme, a default light theme and a default dark theme', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const defaultDarkTheme = new Theme().setName('defaultDarkTheme');
    const defaultLightTheme = new Theme().setName('defaultLightTheme');
    const manager = new ThemeManager()
      .setDefaultTheme(defaultTheme)
      .setDefaultLightTheme(defaultLightTheme)
      .setDefaultDarkTheme(defaultDarkTheme);

    expect(manager.getDefaultTheme().getName()).toBe(defaultTheme.getName());
    expect(manager.getDefaultLightTheme().getName()).toBe(defaultLightTheme.getName());
    expect(manager.getDefaultDarkTheme().getName()).toBe(defaultDarkTheme.getName());
  });

  it('can have a default theme and multiple other non-schemed ones', () => {
    const defaultTheme = new Theme().setName('defaultTheme');
    const theme1 = new Theme().setName('theme1');
    const theme2 = new Theme().setName('theme2');

    const manager = new ThemeManager()
      .setDefaultTheme(defaultTheme)
      .addTheme(theme1)
      .addTheme(theme2);

    expect(manager.getDefaultTheme().getName()).toBe(defaultTheme.getName());
    expect(manager.getThemes().map(t => t.getName())).toStrictEqual([
      theme1.getName(),
      theme2.getName(),
    ]);
    expect(manager.getAllThemes().map(t => t.getName())).toStrictEqual([
      defaultTheme.getName(),
      theme1.getName(),
      theme2.getName(),
    ]);
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

    expect(manager.getDefaultLightTheme().getName()).toStrictEqual(
      defaultLightTheme.getName()
    );
    expect(manager.getDefaultDarkTheme().getName()).toStrictEqual(
      defaultDarkTheme.getName()
    );
    expect(manager.getLightThemes().map(t => t.getName())).toStrictEqual([
      theme1.getName(),
      theme2.getName(),
    ]);
    expect(manager.getDarkThemes().map(t => t.getName())).toStrictEqual([
      theme3.getName(),
    ]);
    expect(manager.getAllThemes().map(t => t.getName())).toStrictEqual([
      defaultLightTheme.getName(),
      defaultDarkTheme.getName(),
      theme1.getName(),
      theme2.getName(),
      theme3.getName(),
    ]);
  });
});
