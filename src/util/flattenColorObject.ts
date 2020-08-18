import { SingleLevelColorObject, ColorObject } from '../theme/color';
import { isColorInput } from './isColorInput';
import _ from 'lodash';

/**
 * Flattens the given color object, the Tailwind way.
 * Thanks, Adam.
 *
 * @export
 * @param {ColorObject} colors
 * @returns
 */
export function flattenColorObject(colors: ColorObject): SingleLevelColorObject {
  const result = _(colors)
    .flatMap((color, name) => {
      if (!_.isObject(color) || isColorInput(color)) {
        return [[name, color]];
      }

      return _.map(flattenColorObject(color), (value, key) => {
        const suffix = key === 'default' ? '' : `-${key}`;

        return [`${name}${suffix}`, value];
      });
    })
    .fromPairs()
    .value();

  return result;
}
