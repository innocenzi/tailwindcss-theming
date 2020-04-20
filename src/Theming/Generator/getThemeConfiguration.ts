import { getColorConfiguration } from './getColorConfiguration';
import { getExtendedConfiguration } from './getExtendedConfiguration';
import { Theme } from '../Theme/Theme';
import { Configuration } from '../Configuration';

export function getThemeConfiguration(themes: Theme[], config: Configuration) {
  return {
    colors: getColorConfiguration(themes, config),
    extend: getExtendedConfiguration(themes, config),
  };
}
