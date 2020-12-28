import { ColorObject } from '../../src/theme/color';
import { flattenColorObject } from '../../src/util/flattenColorObject';
import _ from 'lodash';

it('flattens color object', () => {
  const c: ColorObject = {
    'some-key': {
      known: 'blue',
      rgb: { r: 1, g: 2, b: 3 },
      hsla: { h: 1, s: 2, l: 3, a: 0 },
    },
    primary: {
      DEFAULT: 'red',
      button: {
        DEFAULT: 'blue',
        hover: 'white',
      },
    },
  };

  expect(flattenColorObject(c)).toStrictEqual({
    'some-key-known': 'blue',
    'some-key-rgb': { r: 1, g: 2, b: 3 },
    'some-key-hsla': { h: 1, s: 2, l: 3, a: 0 },
    primary: 'red',
    'primary-button': 'blue',
    'primary-button-hover': 'white',
  });
});
