import { Theme } from '../..';
import { Configuration } from '../Configuration';
import { getDefaultTheme, getCustomPropertyVariableName } from './utils';
import { set } from './get';

export function getExtendedConfiguration(themes: Theme[], config: Configuration) {
  const extendConfiguration: any = {};
  const properties = getDefaultTheme(themes)
    .getCustomProperties()
    .filter(prop => prop.extends());

  properties.forEach(prop => {
    set(extendConfiguration, prop.extendPath, `var(${getCustomPropertyVariableName(prop)})`);
  });

  return extendConfiguration;
}
