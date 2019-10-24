# Theming Plugin for Tailwind CSS

This plugin helps with theming your application. Thanks to a simple and fluent configuration, you will be able to have CSS variables exported to your CSS file, as well as Tailwind's utilities to use them. Your themes will be able to respect the [`prefers-color-scheme`](https://developer.mozilla.org/fr/docs/Web/CSS/@media/prefers-color-scheme) media query, so you can set a dark theme that will be automatically selected depending on the users' browser preferences.

> **Compatibility with IE11**
>
> Please note that [IE11 doesn't support CSS variables (custom properties)](https://caniuse.com/#feat=css-variables). You can still have partial support for IE11 by using the [PostCSS custom properties plugin](https://github.com/postcss/postcss-custom-properties). You won't be able to change theme at runtime, but at least your main theme will work correctly.

# Installation

You can install this plugin thanks to NPM, or you can [build it from source](#build-from-source) and include it in your project yourself.

```console
$ npm install tailwindcss-theming
$ yarn add tailwindcss-theming
```

# Real-world example

Best way to get started would probably be to see how you would use this plugin. 

Here is a good example that you can use as a base for every project. It includes some colors for a light and dark theme. If you want to make the dark theme the default for users who have set their preferred color scheme, uncomment the `.schemeDefault()` line on the second theme definition. More information on that can be found [here](https://developer.mozilla.org/fr/docs/Web/CSS/@media/prefers-color-scheme).

The configuration is made in a separated file for clarity. I think it's better to separate your theme definition from your bundler configuration. Let's name it `theme.config.js`. It should export a `ThemeBuilder` object.

```js
// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');

const mainTheme = new Theme()
  .default()
  .colors({
    // A transparent color, which alpha value will be detected.
    'transparent': 'transparent',

    // Navigation
    'navigation-primary': '#3c4253',
    'navigation-secondary': '#303030',
    'on-navigation': '#9aa2b6',

    // Brand colors
    'brand':'#2196f3',
    'brand-variant':'#1565c0',
    'on-brand':'#ffffff',
    'on-brand-variant':'#ffffff',
    
    // Background colors, but not limited to `bg` utilities.
    'background':'#f4f4f4',
    'surface':'#ffffff',
    'on-background':'#585851',
    'on-surface':'#3c3c3c',
    
    // Event colors.
    'error':'#b00020',
    'on-error':'#ffffff',
    'success':'#3ab577',
    'on-success':'#ffffff',
    'warning':'#e65100',
    'on-warning':'#ffffff',
    'info':'#2481ea',
    'on-info':'#ffffff',
  })

  // Color variants
  .colorVariant('hover', 'white', ['on-navigation'])
;

const darkTheme = new Theme()
// All four options below are already set thanks to `ThemeBuilder`'s `.dark()` method,
//   .name('dark')
//   .default() // Makes this theme the default based on user scheme preference (OS/browser-wide), combine with .dark()
//   .dark() // Set the theme under the `prefers-color-scheme` rule
//   .assignable() // Keep this theme manually assignable
  .colors({
    // We didn't include `transparent`, it will be inherit since it's the same.
    // Navigation
    'navigation-primary': '#282828',
    'navigation-secondary': '#303030',
    'on-navigation': '#9aa2b6',

    // Brand colors
    'brand':'#2196f3',
    'brand-variant':'#1565c0',
    'on-brand':'#ffffff',
    'on-brand-variant':'#ffffff',
    
    // Background colors, but not limited to `bg` utilities.
    'background':'#1f1f1f',
    'surface':'#282828',
    'on-background':'#ffffff',
    'on-surface':'#ffffff',
    
    // Event colors.
    'error':'#e67388',
    'on-error':'#ffffff',
    'success':'#3ab577',
    'on-success':'#ffffff',
    'warning':'#ffa777',
    'on-warning':'#ffffff',
    'info':'#83bdff',
    'on-info':'#ffffff',
  })

  // Color variants
  .colorVariant('hover', 'white', 'on-navigation') // This could be omitted, since it's inherited.
;

module.exports = new ThemeBuilder()
  // .asClass() // => <body class="dark" />
  // .asPrefixedClass('theme') // => <body class="theme-dark" />
  .asDataThemeAttribute() // => <body data-theme="dark" />
  .default(mainTheme)
  .dark(darkTheme);
```

Now, you have a fully-functionnal theme definition with two themes that you can use. Only thing left is to include it as a Tailwind plugin, and you're done!

```js
// tailwind.config.js
module.exports = {
  theme: {
      // ...
  },
  variants: {
    display: ['responsive', 'group-hover', 'hover'],
  },
  plugins: [
    require('./theme.config.js'), 
    // require('tailwindcss-transitions')()
  ],
};
```

Voilà, everything should work. You can use every Tailwind utility that works with colors, such as `.text-<color>`, `.bg-<color>` or even `.border-<color>`. Bonus points if you add [tailwindcss-transitions](https://github.com/benface/tailwindcss-transitions) as a Tailwind plugin, so swithing themes look really smooth.

![](https://raw.githubusercontent.com/hawezo/tailwindcss-theming/master/preview.gif)

# Usage

You will be required to use the `ThemeBuilder` API to setup your themes. Fortunately, this is a fairly easy process. In the first time, you can include `tailwindcss-theming`, instanciate it and add it to your plugin list. 

> **Please note** that any color palette that you set in Tailwind's `theme` will be entirely replaced. You need to setup your colors with the `ThemeBuilder`.

```js
import { ThemeBuilder } from 'tailwindcss-theming';

module.exports = {
  plugins: [
    new ThemeBuilder().plugin()
  ],
};
```

# Configuration

Obviously, you need to build the themes in order to have one. You can start by setting up the plugin's options. 

## Strategy 

This plugin has multiple strategies to export your themes. You can either define your strategy by using the `strategy` method of `ThemeBuilder` and passind the strategy name as an argument, or by using one of the strategy method to set it up.

### Strategy Reference

| Method | Name | Enum Access | Description |
| ------ | ---- | ---- | ----------- |
| `asPrefixedClass()` | `prefixed-class` | `Strategy.PrefixedClass` | Each theme will be exported in a class with a prefix. You will be able to use a theme by applying the class `.<choosenPrefix>-<themeName>` on a node. The CSS rule will be `.<choosenPrefix>-<themeName>`. | 
| `asClass()` | `class` | `Strategy.Class` | Each theme will be exported in a class. You will be able to use a theme by applying the class `.<themeName>` on a node. The CSS rule will be `<themeName>`. | 
| `asDataAttribute()` | `data-attribute` | `Strategy.DataAttribute` | Each theme will be exported as a data-attribute. You will be able to use a theme by setting the attribute `data-<themeName>` on a node. The CSS rule will be `[data-<themeName>]`. | 
| `asPrefixedAttribute()` | `prefixed-attribute` | `Strategy.PrefixedAttribute` | Each theme will be exported as an attribute with a prefix. You will be able to use a theme by setting the attribute `<choosenPrefix>-<themeName>` on a node. The CSS rule will be `[<choosenPrefix>-<themeName>]`. | 
| `asAttribute()` | `attribute` |  `Strategy.Attribute` | Each theme will be exported as an attribute. You will be able to use a theme by setting the attribute `<themeName>` on a node. The CSS rule will be `[<themeName>]`. |
| `asDataThemeAttribute()` | `data-theme-attribute` |  `Strategy.DataThemeAttribute` | Each theme will be exported as a data-theme attribute. You will be able to use a theme by setting the attribute `data-theme` with the value `<themeName>` on a node. The CSS rule will be `[data-theme=<themeName>]`. |

### Using `strategy()`

#### Javascript Example

```javascript
import { ThemeBuilder } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
    .strategy('prefixed-class')
    .prefix('theme');

// Will output `.theme-primary` for a theme named `primary`.

const theme = new ThemeBuilder()
    .strategy('attribute')
    .prefix('theme');

// Will output `[primary]` for a theme named `primary`.
```

#### TypeScript Example

```typescript
import { ThemeBuilder, Strategy } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
    .strategy(Strategy.PrefixedClass)
    .prefix('theme');

// Will output `.theme-primary` for a theme named `primary`.

const theme = new ThemeBuilder()
    .strategy(Strategy.Attribute)
    .prefix('theme');

// Will output `[primary]` for a theme named `primary`.
```

### Using fluent methods

```javascript
import { ThemeBuilder } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
    .asPrefixedClass('theme');

// Will output `.theme-primary` for a theme named `primary`.

const theme = new ThemeBuilder()
    .asAttribute();

// Will output `[primary]` for a theme named `primary`.
```

## Color variables' prefixes

If for some reason you need or want to change the color variables' prefixes, you can use `colorVariablePrefix('prefix')` to change it. You can remove it completely by not passing any parameter, but it could potentially break up things if you have another variable of the same name. 

```javascript
import { ThemeBuilder } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
    .colorVariablePrefix('color');

// Will output `--color-primary` for a variable named `primary`.

const theme = new ThemeBuilder()
    .colorVariablePrefix();

// Will output `--primary` for a variable named `primary`.
```

## Defaults

Although the defaults settings are already set when you call `new ThemeBuilder`, you can explicitly call `.defaults()` to apply them.

```javascript
import { ThemeBuilder } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
    .colorVariablePrefix('color')
    .defaults();

// `colorVariablePrefix` is undefined
```

## Creating themes

You will be able to define one or multiple themes. You will need to have at least one default theme, but you can have many other named themes as you want. However, if you set colors on named themes that are not on the default theme, you won't be able to use theme with Tailwind utilities because this plugin won't generate said utilities for these colors. 

For instance, if you have a `primary` color in your default theme and you have a `primary` and a `secondary` color in a named theme, the `secondary` color utilities won't be generated, and you will only be able to use utilities such as `text-primary`.

### Defining a default theme

There are multiple ways to add a default theme. You can call the `default` method of `ThemeBuilder` with a `Theme` object, or call the `theme` or `themes` method with a `Theme` object as well. 

The `default` method will call a `Theme`'s `default()` method, so it will be explicitly defined as the default theme. The `theme` or `themes` methods will simply add the given `Theme`(s) to the `ThemeBuilder`.

```javascript
import { ThemeBuilder, Theme } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
  .default([ // default theme
    new Theme()
      .name('my-theme') // this name will not be usable unless you call .assignable()
      .colors({
        transparent: 'transparent',
        primary: 'white',
      }),
  ]);
```

### Defining multiple themes

Use the `theme` method to add a single theme or the `themes` method to add multiple themes. 

```javascript
import { ThemeBuilder, Theme } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
  .theme(new Theme()
    .default() // don't forget to always have a default theme
    .assignable()
    .name('main-theme')
    .colors({
      transparent: 'transparent',
      primary: 'white',
    }))
  .themes([
    new Theme()
      .name('another-theme')
      .colors({
        transparent: 'transparent',
        primary: 'black',
      }),
  ]);
```

### Building a theme

A `Theme` has a fluent API that allow an elegant setup. A `Theme` is a collection of `Color` and `Variant` objects. A `Variant` **is not** a Tailwind variant, but a color utility variant. 

Here is a vanilla Tailwind configuration to illustrate what a variant is in this plugin:

```javascript
module.exports = [
  theme: {
    colors: {
      black: '#000000', // this is a color
      primary: {
        default: 'blue', // this is a color, defined by the special 'default' name
        something: 'cyan' // this is a variant
      }
    }
  }
]
```

#### Defining colors

You can add your colors by calling `colors` on a `Theme` object. The `colors` method argument accept either an object of `name`/`value` or an array of `Color` objects.  A `value` can be any color that [TinyColor](https://github.com/TypeCtrl/tinycolor) can understand.

For instance, each of these instanciations will do the exact same:

```javascript
import { Theme } from 'tailwindcss-theming';

new Theme()
  .colors({
    transparent: 'transparent',
    primary: 'white',
  });

new Theme()
  .colors([
    new Color(), // the name and values are `transparent` if you don't set them
    new Color('primary', 'white') // you can use the `Color` constructor to pass the name and value respectively
  ]);

new Theme()
  .colors([
    new Color('transparent').value('transparent'), // you can call `.value()` to set the value
    new Color('primary').value('white')
  ]);

new Theme()
  .colors([
    new Color().name('transparent').value('transparent'), // you can call `.name()` to set the name, and chain the methods
    new Color().name('primary').value('white')
  ]);
```

For a theme definition, it would look like this:

```javascript
import { ThemeBuilder, Theme } from 'tailwindcss-theming';

const theme = new ThemeBuilder()
  .default(new Theme()
    .colors({
      transparent: 'transparent',
      primary: 'white',
      secondary: '#e1e1e1'
    })
  );
```

### Defining variants

#### Opacity variants

An `OpacityVariant` will change the `alpha` value of a color. For instance, an opacity variant named `muted` with the value `0.35` will create a `.text-primary-muted` utility which properties will be `color: rgba(var(--color-primary), var(--opacity-variant-muted))` for a variable named `primary`. 

This utility would set the color to whatever the `primary` color is and the alpha of this color would be `0.35`.

To define an opacity variant, call `opacityVariant` on a `Theme` object.

```javascript
new Theme()
  .colors({
    transparent: 'transparent',
    primary: 'white',
  })
  .opacityVariant('muted', .35);
```

#### Color variants

Sometimes, you can't get the result you want with just an opacity tweak, so you would maybe want to change the whole color. With a `ColorVariant`, you can do this.

> **Please note** that I plan on adding opacity (alpha) support for color variants, but this is not available yet.

A color variant named `lighter` which value is `#3B4252` will generate a `.text-primary-lighter` utility which properties will be `color: rgb(var(--color-variant-lighter))`  for a variable named `property`. 

This utility would replace `primary`'s color. 

To define a color variant, call `colorVariant` on a `Theme` object.

```javascript
new Theme()
  .colors({
    transparent: 'transparent',
    primary: '#2E3440',
  })
  .colorVariant('lighter', '#3B4252');
```

#### Variant scopes

By default, a variant will be added for every color. But this is not what you would always want, especially using the color variants. You can defined for which color a variant is by adding a third argument to `opacityVariant` or `colorVariant`.

```javascript
new Theme()
  .colors({
    transparent: 'transparent',
    primary: '#2E3440',
    secondary: '#434C5E',
  })
  .colorVariant('lighter', '#3B4252', 'primary'); // only for primary
  .colorVariant('even-lighter', '#4C566A', ['primary', 'secondary']); // only for primary and secondary
```

### Color schemes

This plugin can take advantage of the [`prefers-color-scheme`](https://developer.mozilla.org/fr/docs/Web/CSS/@media/prefers-color-scheme) media query to change a theme automatically based on an user's browser preferences. 

Basically, you can setup a theme to be defined in a `dark` or `light` media query. 

#### Defining a default dark (or light) theme

To make a theme its scheme's default, you have to define its `scheme` by calling `dark()` or `light()`, and call `default`. The example below defines two themes. The first one will be the default theme, and the second one will be the dark scheme's default theme.

```javascript
const plugin = new ThemeBuilder()
  .themes([
    new Theme()
      .default()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),
    new Theme()
      .dark()
      .default()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),
  ]);
```

If you wanted the second theme to be assignable (with `.theme-dark` for example), you would have to set a name and make it assignable:

```js
new Theme()
    .dark()
    .default()
    .name('dark')
    .assignable()
    .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
    })
    .opacityVariant('muted', 0.3)
;
```

This would output a `:root` theme in the `prefers-color-scheme: dark` media query, as well as a `.theme-dark` outside of it.

### Defining both scheme's default, a fallback theme, and another assignable one

In this example, you will have a default theme that is also the theme if a user has an explicit `light` scheme, a theme if a user has an explicit `dark` scheme, and two other named themes that need attributes to be applied.

```javascript
const plugin = new ThemeBuilder()
  .themes([

    // A default, named and assignable theme. Used as a fallback if no `prefers-color-scheme` is defined.
    new Theme()
      .default()
      .assignable()
      .name('black-and-white')
      .colors({
        background: 'dark',
        surface: 'gray',
        'on-background': 'white',
        'on-surface': 'white',
      })
      .opacityVariant('muted', 0.3),

    // A default light theme, not assignable
    new Theme()
      .default()
      .light()
      .colors({
        background: '#ECEFF4',
        surface: '#D8DEE9',
        'on-background': '#2E3440',
        'on-surface': '#2E3440',
      })
      .opacityVariant('muted', 0.3),

    // A default dark scheme, not assignable
    new Theme()
      .default()
      .dark()
      .colors({
        background: '#2E3440',
        surface: '#3B4252',
        'on-background': '#D8DEE9',
        'on-surface': '#D8DEE9',
      })
      .opacityVariant('muted', 0.3),

    // Another assignable theme
    new Theme()
      .name('white')
      .colors({
        background: 'white',
        surface: 'gray',
        'on-background': 'black',
        'on-surface': 'black',
      })
      .opacityVariant('muted', 0.3),

  ]);
```

## API reference

### `ThemeBuilder`

| Method | Arguments | Description |
| ------ | --------- | ----------- |
| `defaults()` | None | Applies the default configuration.
| `prefix()` | `prefix?: string` | Sets the prefix used for the export strategies.
| `colorVariablePrefix()` | `prefix?: string` | Sets the color variables' names prefixes.
| `strategy` | [`Strategy`](src/Theming/Strategy.ts) | Sets the export strategy.
| `asPrefixedClass()` | `prefix?: string` | Sets the export strategy to `PrefixedClass`. You can pass a prefix as a parameter to this method.
| `asClass()` | None | Sets the export strategy to `Class`.
| `asDataAttribute()` | None | Sets the export strategy to `DataAttribute`.
| `asDataThemeAttribute()` | None | Sets the export strategy to `DataThemeAttribute`.
| `asPrefixedAttribute()` | `prefix?: string` | Sets the export strategy to `PrefixedAttribute`. You can pass a prefix as a parameter to this method.
| `asAttribute()` | None | Sets the export strategy to `Attribute`.
| `default()` | [`Theme`](src/Theming/Theme/Theme.ts) | Adds a default theme.
| `dark()` | [`Theme`](src/Theming/Theme/Theme.ts), `default: boolean = true`, `assignable: boolean = true` | Adds a dark theme.
| `light()` | [`Theme`](src/Theming/Theme/Theme.ts), `default: boolean = true`, `assignable: boolean = true` | Adds a light theme.
| `theme()` | [`Theme`](src/Theming/Theme/Theme.ts) | Adds a theme.
| `themes()` | [`Theme`](src/Theming/Theme/Theme.ts)`[]` | Adds multiple themes.
| `theming()` | None | Gets the current plugin configuration.
| `config()` | None | Gets the processed Tailwind configuration.
| `handler()` | None | Gets the Tailwind's plugin `handler` method.
| `plugin()` | `{}` | Gets the whole plugin. Use this method to register the plugin.

### `Theme`

| Method | Arguments | Description |
| ------ | --------- | ----------- |
| `default()` | None | Sets the theme as the default theme. Internally, changes its name to `default` if it has no name.
| `assignable()` | None | Let the theme be assignable whether it's the default theme or not.
| `name()` | `string` | Sets the theme's name.
| `light()` | None | Sets the theme's scheme to `light`.
| `dark()` | None | Sets the theme's scheme to `dark`.
| `color()` | `name: string`, `value: string` | Adds a `Color` to the theme.
| `colors()` | `colors: Color[] | {}` | Adds multiple `Color` to the theme. Argument can be an associative object of `name` and `value`s or an array of `Color`.
| `opacityVariant()` | `name: string`, `value: number`, `colors?: string[] | string` | Adds an opacity variant. Add defined color names to the `colors` array to apply the variant only to them.
| `colorVariant()` | `name: string`, `value: string`, `colors?: string[] | string` | Adds a color variant. Add defined color names to the `colors` array to apply the variant only to them.
| `hasVariant()` | `variant: string` | Checks if the given variant name is defined.
| `mapVariant()` | `name: string`,` colors?: string[] | string` | Maps a variant name to a list of color names. If the color list is empty, it will be mapped to every color.
| `variantsOf()` | `color: string[]` | Gets the variants of the given color.
| `isDefault()` | None | Checks if this theme is set as the default theme.
| `getName()` | None | Returns this theme's name.
| `getColors()` | None | Returns this theme's colors.
| `getScheme()` | None | Returns this theme's scheme, or null if it has none.
| `hasName()` | None | Returns if this theme has a name.
| `isAssignable()` | None | Returns if this theme is assignable.
| `hasScheme()` | None | Returns if this theme has a scheme.
| `hasScheme()` | None | Returns if this theme has a scheme.

# Build from source

Clone the repository:

```console
$ git clone https://github.com/hawezo/tailwindcss-theming
$ cd tailwindcss-theming
```

Install dependencies:

```console
$ yarn install
```

Run tests:

```console
$ yarn test
```

Build:

```console
$ yarn build
```

The main file will be `dist/index.js`.
