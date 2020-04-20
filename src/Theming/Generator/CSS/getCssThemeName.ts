import { Theme } from '../../Theme/Theme';
import { Strategy } from '../../Strategy';
import { Configuration } from '../../Configuration';

export function getCssThemeName(theme: Theme, config: Configuration, keepName: boolean = false): string {
  if (!keepName && theme.isDefault()) {
    return ':root';
  }

  let name = theme.getName(); // tailwind should pascal-case this

  switch (config.strategy) {
    case Strategy.Attribute:
      return `[${name}]`;
    case Strategy.PrefixedAttribute:
      if (config.prefix) {
        return `[${config.prefix}-${name}]`;
      } else {
        throw new Error('Strategy is set to prefixed attribute but no prefix is defined.');
      }
    case Strategy.DataThemeAttribute:
      return `[data-theme=${name}]`;
    case Strategy.DataAttribute:
      return `[data-${name}]`;
    case Strategy.Class:
      return `.${name}`;
    case Strategy.PrefixedClass:
      if (config.prefix) {
        return `.${config.prefix}-${name}`;
      } else {
        throw new Error('Strategy is set to prefixed class but no prefix is defined.');
      }
    default:
      throw new Error(`Unknown strategy: ${config.strategy}.`);
  }
}
