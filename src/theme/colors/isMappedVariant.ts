import { MappedVariant } from '../../api';
import { isColorInput } from './isColorInput';
import _ from 'lodash';

/**
 * Determines if the given object is a mapped variant.
 */
export function isMappedVariant(object: any): object is MappedVariant {
  if (!_.isObjectLike(object)) {
    return false;
  }

  return (
    'variant' in object &&
    'colors' in object &&
    (_.isString(object.colors) || _.isArray(object.colors)) &&
    (isColorInput(object.variant) ||
      _.isNumber(object.variant) ||
      _.isFunction(object.variant))
  );
}
