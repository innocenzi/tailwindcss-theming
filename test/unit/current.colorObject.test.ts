import { TwoLevelColorObject } from '../../src/theme/colors/colorObject';
import { flattenColorObject } from '../../src/theme/colors/flattenColorObject';
import _ from 'lodash';

it('flattens color object', () => {
  const c: TwoLevelColorObject = {
    'some-key': {
      // @ts-ignore
      unknown: { u: '' },
      known: 'blue',
      rgb: { r: 1, g: 2, b: 3 },
      hsla: { h: 1, s: 2, l: 3, a: 0 },
    },
  };

  expect(flattenColorObject(c)).toStrictEqual({
    'some-key-known': 'blue',
    'some-key-rgb': { r: 1, g: 2, b: 3 },
    'some-key-hsla': { h: 1, s: 2, l: 3, a: 0 },
    'some-key-unknown': { u: '' },
  });
});
