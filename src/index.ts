import { Color } from './Theming/Color';
import { Configuration } from './Theming/Configuration';
import { OpacityVariant } from './Theming/OpacityVariant';
import { Themes } from './Theming/Theme';
import { PluginHelpers } from './Plugin/PluginHelpers';
import { getThemesConfiguration } from './Theming/Functions/getThemesConfiguration';
import { getColorConfiguration } from './Theming/Functions/getColorConfiguration';
import { ThemingPlugin } from './Theming/ThemingPlugin';

export const DefaultOpacityVariants: OpacityVariant[] = [
  { name: 'default', value: 1 },
  { name: 'lower-emphasis', value: 0.87 },
  { name: 'lowest-emphasis', value: 0.6 },
  { name: 'inactive', value: 0.6 },
  { name: 'disabled', value: 0.38 },
  { name: 'muted', value: 0.425 },
  { name: 'selection', value: 0.25 },
  { name: 'slightly-visible', value: 0.1 },
];

export const DefaultColors: Color[] = [
  { name: 'transparent', value: 'transparent', opacityVariants: [], outputFormat: 'text' },
  { name: 'primary', value: '#2196f3', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'primary-variant', value: '#1565c0', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'secondary', value: '#039be5', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'secondary-variant', value: '#0288d1', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'background', value: '#f4f4f4', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'surface', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'error', value: '#b00020', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'success', value: '#3ab577', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'warning', value: '#e65100', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'info', value: '#2481ea', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-primary', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-secondary', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-background', value: '#585851', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-surface', value: '#3c3c3c', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-error', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-success', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-warning', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-info', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
];

export const DefaultThemes: Themes = {
  default: { colors: DefaultColors }
}

export const DefaultConfiguration: Configuration = {
  colorVariablePrefix: 'color',
  useVariants: true
};

export default function(themes?: Themes, pluginConfig?: Configuration): ThemingPlugin {
  themes = { ...DefaultThemes, ...themes};
  pluginConfig = { ...DefaultConfiguration, ...pluginConfig};

  let themeConfig = getThemesConfiguration(themes, pluginConfig);
  let colorConfig = getColorConfiguration(themes, pluginConfig);

  return {
    theme: {
      ...colorConfig
    },
    plugin: function({ addComponents, config }: PluginHelpers): void {
      addComponents(themeConfig, config);
    }
  }
}
