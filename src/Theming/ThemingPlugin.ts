import { ColorConfiguration } from "./ColorConfiguration";
import { PluginHelpers } from "../Plugin/PluginHelpers";

export interface ThemingPlugin {
  theme: {
    colors: ColorConfiguration
  }
  plugin: (args: PluginHelpers) => void
}
