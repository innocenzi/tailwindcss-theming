import { TwoLevelColorObject, ColorObject } from './colorObject';
import { isColorInput } from './isColorInput';
import _ from 'lodash';

/**
 * Flattens the given color object, the Tailwind way.
 * Thanks, Adam.
 *
 * @export
 * @param {TwoLevelColorObject} colors
 * @returns
 */
export function flattenColorObject(colors: TwoLevelColorObject): ColorObject {
  const result = _(colors)
    .flatMap((color, name) => {
      if (!_.isObject(color) || isColorInput(color)) {
        return [[name, color]];
      }

      return _.map(color, (value, key) => {
        const suffix = key === 'default' ? '' : `-${key}`;

        return [`${name}${suffix}`, value];
      });
    })
    .fromPairs()
    .value();

  return result;
}
