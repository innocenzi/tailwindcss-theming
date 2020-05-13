import { ThemeManager, Theme } from '../theme/theme';
import { TinyColor } from '@ctrl/tinycolor';
import _ from 'lodash';

const palette = {
  // Polar night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434c5e',
  nord3: '#4C566A',

  // Snow storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',

  // Frost
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',

  // Aurora
  nord11: '#BF616A',
  nord12: '#D08770',
  nord13: '#EBCB8B',
  nord14: '#A3BE8C',
  nord15: '#B48EAD',

  // Other
  white: 'white',
};

// The vanilla theme.
const vanilla = new Theme()
  .setName('nord')
  .targetable()
  .addColors({ ...palette });

// The light theme.
// prettier-ignore
const light = new Theme()
  .addColors({
    'background': palette.nord4,
    'on-background': palette.nord0,
    'surface': palette.nord5,
    'on-surface': palette.nord1,
    'foreground': palette.nord6,
    'on-foreground': palette.nord2,
    'attention': {
      'primary': palette.nord7,
      'secondary': palette.nord8,
      'tertiary': palette.nord9,
      'quaternary': palette.nord10,
    },
    'error': palette.nord11,
    'on-error': new TinyColor(palette.nord11).darken(40),
    'danger': palette.nord12,
    'on-danger': new TinyColor(palette.nord12).darken(40),
    'warning': palette.nord13, 
    'on-warning': new TinyColor(palette.nord13).darken(40), 
    'success': palette.nord14, 
    'on-success': new TinyColor(palette.nord14).darken(40), 
    'uncommon': palette.nord15, 
    'on-uncommon': palette.nord0,
    
    'polar-night': {
      0: palette.nord0,
      1: palette.nord1,
      2: palette.nord2,
      3: palette.nord3,
    },
    
    'snow-storm': {
      0: palette.nord4,
      1: palette.nord5,
      2: palette.nord6,
    },
    
    'frost': {
      0: palette.nord7,
      1: palette.nord8,
      2: palette.nord9,
      3: palette.nord10,
    },
    
    'aurora': {
      0: palette.nord11,
      1: palette.nord12,
      2: palette.nord13,
      3: palette.nord14,
      4: palette.nord15,
    }
  })
  .addColorVariant('subtle', palette.nord3, ['on-background'])
  .addColorVariant('muted', new TinyColor(palette.nord3).lighten(), ['on-background'])
  .addColorVariant('active', palette.nord1, ['on-background'])
  .addColorVariant('hover', palette.nord2, ['on-background'])
  .addColorVariant('focus', palette.nord3, ['on-background'])

// The dark theme.
// prettier-ignore
const dark = new Theme()
  .addColors({
    'background': palette.nord0,
    'on-background': palette.nord6,
    'surface': palette.nord1,
    'on-surface': palette.nord6,
    'foreground': palette.nord2,
    'on-foreground': palette.nord6,
    'attention': {
      'primary': palette.nord7,
      'secondary': palette.nord8,
      'tertiary': palette.nord9,
      'quaternary': palette.nord10,
    },
  })
  .addColorVariant('subtle', new TinyColor(palette.nord5), ['on-background'])
  .addColorVariant('muted', new TinyColor(palette.nord4).darken(), ['on-background'])
  .addColorVariant('active', palette.nord5, ['on-background'])
  .addColorVariant('hover', palette.nord4, ['on-background'])
  .addColorVariant('focus', new TinyColor(palette.nord4).darken(), ['on-background'])

/**
 * The Nord preset.
 */
export const Nord = new ThemeManager()
  .setDefaultTheme(light.targetable())
  .setDefaultLightTheme(light.setName('light').targetable())
  .setDefaultDarkTheme(dark.setName('dark').targetable());

/**
 * The Nord theme, with its vanilla color names.
 */
export const NordVanilla = new ThemeManager().setDefaultTheme(vanilla);

/**
 * Let access to the Nord color palette.
 */
export const NordPalette = palette;
