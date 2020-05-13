import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import _ from 'lodash';

export function isColorInput(colorObject: any): colorObject is ColorInput {
  const objects = [
    ['r', 'g', 'b'],
    ['r', 'g', 'b', 'a'],
    ['h', 's', 'l'],
    ['h', 's', 'l', 'a'],
    ['h', 's', 'v'],
    ['h', 's', 'v', 'a'],
  ];

  return (
    // Check if the color object is an instance of TinyColor
    colorObject instanceof TinyColor ||
    // We check if one of the arrays from `objects` has the same keys as
    // the color object
    objects.some(props => _.isEqual(Object.keys(colorObject), props)) ||
    // We check if the color object is in fact a string
    _.isString(colorObject)
  );
}
