import { ThemeManager, Theme } from '../theme/theme';
import { Strategy } from '../theme/strategy';
import { Errors } from '../errors';
import _ from 'lodash';

/**
 * Gets the selector for the gien theme.
 */
export function getThemeSelector(manager: ThemeManager, theme: Theme): string {
  const prefix = manager.getPrefix() ?? 'theme';
  const strategy = manager.getStrategy() ?? Strategy.DataThemeAttribute;
  const name = _.kebabCase(theme.getName());

  const map = {
    [Strategy.Attribute]: () => `[${name}]`,
    [Strategy.PrefixedAttribute]: (prefix: string) => `[${prefix}-${name}]`,
    [Strategy.DataThemeAttribute]: () => `[data-theme-${name}]`,
    [Strategy.DataAttribute]: () => `[data-${name}]`,
    [Strategy.Class]: () => `.${name}`,
    [Strategy.PrefixedClass]: (prefix: string) => `.${prefix}-${name}`,
  };

  const selectorize = map[strategy];

  if (!selectorize) {
    throw new Error(Errors.UNKNOWN_STRATEGY);
  }

  return selectorize(prefix);
}
