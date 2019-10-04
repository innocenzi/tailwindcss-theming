import { ColorConfiguration } from "./ColorConfiguration";
import { PluginHelpers } from "../Plugin/PluginHelpers";
import { Themes } from "./Theme";
import { Configuration } from "./Configuration";
import { DefaultThemes, DefaultConfiguration } from "..";
import { getThemesConfiguration } from "./Functions/getThemesConfiguration";
import { getColorConfiguration } from "./Functions/getColorConfiguration";
import { ThemeConfiguration } from "./ThemeConfiguration";

export class ThemingPlugin {
  private themes: Themes;
  private pluginConfig: Configuration;
  private themeConfiguration: ThemeConfiguration;
  private colorConfiguration: ColorConfiguration;

  constructor(themes?: Themes, pluginConfig?: Configuration) {
    this.themes = themes || DefaultThemes;
    this.pluginConfig = { ...DefaultConfiguration, ...pluginConfig};
    this.themeConfiguration = getThemesConfiguration(this.themes, this.pluginConfig);
    this.colorConfiguration = getColorConfiguration(this.themes, this.pluginConfig);
  }

  getTheme() {
    return {
      colors: this.colorConfiguration
    };
  }

  getTailwind() {
    return ({ addComponents, config }: PluginHelpers): void => {
      addComponents(this.themeConfiguration, config);
    }
  }
}
