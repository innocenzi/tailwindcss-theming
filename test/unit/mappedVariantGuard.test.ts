import { MappedVariant, VariantTransformer } from '../../src/theme/color';
import { isMappedVariant } from '../../src/util/isMappedVariant';
import { ColorInput } from '@ctrl/tinycolor';
import _ from 'lodash';

const objects: Array<[
  boolean,
  Partial<MappedVariant> | number | ColorInput | VariantTransformer
]> = [
  [true, { variant: 'blue', colors: ['color1'] }],
  [true, { variant: 0.5, colors: ['color1'] }],
  [true, { variant: color => color.brighten(), colors: ['color1'] }],
  [false, { variant: 'blue' }],
  [false, { variant: 0.5 }],
  [false, { variant: color => color.brighten() }],
  [false, {}],
  [false, 'blue'],
  [false, 0.5],
  [false, color => color.brighten()],
];

objects.forEach(([is, item], i) => {
  it(`determines if the object is a mapped variant (${i})`, () => {
    expect(isMappedVariant(item)).toBe(is);
  });
});
