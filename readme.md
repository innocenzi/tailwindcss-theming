# Theming Plugin for Tailwind CSS

This plugin helps with theming your application. Thanks to a simple configuration, you will be able to have CSS variables exported to your CSS file, as well as Tailwind's utilities to use them.

## Installation

```console
$ npm install tailwindcss-theming
$ yarn add tailwindcss-theming
```

## Usage

Since this is a theming plugin, you need to override Tailwind's default color palette with your own. There is a default palette if you don't want to spend time creating one, but you will still need to override Tailwind's.

```js
import { ThemingPlugin } from 'tailwindcss-theming';
const plugin = new ThemingPlugin();

module.exports = {
  theme: {
    ...plugin.getTheme(),
  },
  plugins: [plugin.getTailwind()],
};
```

This two-time usage is necessary, as a plugin cannot internally override the theme configuration.

## Customizing

The `ThemingPlugin` class can take two arguments. The first is an object containing a list of `Theme`s, the second is the plugin's configuration.
The default configuration is the following:

```typescript
const DefaultConfiguration: Configuration = {
  themeTypeKey: 'color-scheme',
  colorVariablePrefix: 'color',
  useVariants: true,
  outputThemePrefix: 'theme',
};
```

A theme object has a `type` key, which can be set to either `light` or `dark`, and a `colors` key, which must be an array of `Color` object.

Here is an example of a `Color` object:

```typescript
const color = {
  name: 'primary',
  value: '#fff', // any color that TinyColor can handle
  opacityVariants: [], // OpacityVariant[]
  outputFormat: 'rgb', // 'rgb' or 'text'
};
```

The `name` property is the name of the CSS variable and the Tailwind color. In this example, you will have a `--color-primary: 255,255,255;` CSS variable and a `text-primary` utility which will be generated into a `color: rgb(var(--color-primary))` CSS rule.

The `Color` object also has an `opacityVariants` key, which is an array of `OpacityVariant` objects.

An `OpacityVariant` object has is described as the following:

```typescript
interface OpacityVariant {
  name: string;
  value: number;
}
```

The `name` property will be the name of the exported CSS variable, as well as the suffix to any `Color` it is applied to. The `value` must be a `number` between `0` and `1`, since it will be used as the fourth argument of the CSS's `rgba` function.

If you want to keep the default variants, you can export them from the plugin module:

```typescript
import { DefaultOpacityVariants } from 'tailwindcss-theming';
```

The `DefaultColors`, `DefaultThemes` and `DefaultConfiguration` objects are also available to facilitate customization using default values.

> **NOTE** - Only the default theme's color are exported and taken into account. It means every theme's color and their variants have to match the default theme's ones.

## Examples

### Your own palette

```javascript
import { ThemingPlugin, DefaultOpacityVariants } from 'tailwindcss-theming';

const palette = [
  { name: 'transparent', value: 'transparent', opacityVariants: [], outputFormat: 'text' },
  { name: 'primary', value: '#2196f3', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'primary-variant', value: '#1565c0', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'secondary', value: '#039be5', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'secondary-variant', value: '#0288d1', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'background', value: '#f4f4f4', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'surface', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'error', value: '#b00020', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'success', value: '#3ab577', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'warning', value: '#e65100', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'info', value: '#2481ea', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-primary', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-secondary', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-background', value: '#585851', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-surface', value: '#3c3c3c', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-error', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-success', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-warning', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
  { name: 'on-info', value: '#ffffff', opacityVariants: DefaultOpacityVariants, outputFormat: 'rgb' },
];

const spined = palette.filter(color => {
  // don't do anything for the transparent color
  if (color.name === 'transparent') {
    return color;
  }

  // convert color to the oposite color
  return {
    name: color.name,
    value: new TinyColor(color.value).spin(180),
    opacityVariants: color.opacityVariants,
    outputFormat: color.outputFormat
  }
})

const themes = {
  default: { type: 'light', colors: palette },
  spin: { type: 'dark', colors: spined }
};

const plugin = new ThemingPlugin(themes);

module.exports = {
  theme: {
    ...plugin.getTheme(),
  },
  plugins: [plugin.getTailwind()],
};
```

With this, you will be able to use the following in your templates:

```html
<div class="bg-background">
    <span class="text-on-background">Normal text</span>
    <span class="text-on-background-muted">Muted text</span>
    <span class="text-error">Error text</span>
</div>

<div class="bg-error">
    <span class="text-on-error">An error occured.</span>
</div>

<div class="bg-info">
    <span class="text-on-info">Hey, good news!</span>
</div>
```

And if you change your `<body>`'s class to `.theme-spin`, the theme will change.

### Keeping configuration clean

Since this plugin will most likely require a big configuration, you should separate its config and Tailwind's config. 
I recommend you create a `.theme.js` file in the same directory as `tailwind.config.js`.

You can then put the following, and change it as you need:

```javascript
// theme.js
const { ThemingPlugin } = require('tailwindcss-theming');

const variants = [
  { name: 'default', value: 1 },
  { name: 'high-emphasis', value: 0.87 },
  { name: 'medium-emphasis', value: 0.6 },
  { name: 'inactive', value: 0.6 },
  { name: 'disabled', value: 0.38 },
  { name: 'muted', value: 0.425 },
  { name: 'selection', value: 0.25 },
  { name: 'slightly-visible', value: 0.1 },
];

const palette = [
  { name: 'transparent', value: 'transparent', opacityVariants: [], outputFormat: 'text' },
  { name: 'primary', value: '#2196f3', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'primary-variant', value: '#1565c0', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'secondary', value: '#039be5', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'secondary-variant', value: '#0288d1', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'background', value: '#f4f4f4', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'surface', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'error', value: '#b00020', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'success', value: '#3ab577', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'warning', value: '#e65100', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'info', value: '#2481ea', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-primary', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-secondary', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-background', value: '#585851', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-surface', value: '#3c3c3c', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-error', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-success', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-warning', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
  { name: 'on-info', value: '#ffffff', opacityVariants: variants, outputFormat: 'rgb' },
];

const themes = {
  default: { type: 'light', colors: palette },
};

const config = {
  themeTypeKey: 'color-scheme',
  colorVariablePrefix: 'color',
  useVariants: true,
  outputThemePrefix: 'theme'
};

module.exports = new ThemingPlugin(themes, config);
```

Your `tailwind.config.js` should now look like this:

```javascript
// tailwind.config.js
const theming = require('./theme');

module.exports = {
  theme: {
    ...theming.getTheme().colors,
  },
  plugins: [
    theming.getTailwind(),
  ],
};
```

Cleaner, right?
