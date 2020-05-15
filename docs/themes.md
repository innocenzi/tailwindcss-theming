<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Configuring your themes](#configuring-your-themes)
- [Creating a theme](#creating-a-theme)
    - [Colors](#colors)
    - [Variants](#variants)
        - [Opacity variants](#opacity-variants)
        - [Color variants](#color-variants)
        - [Custom variants](#custom-variants)
    - [Extending Tailwind's configuration with CSS variables](#extending-tailwinds-configuration-with-css-variables)
    - [Name and targetability](#name-and-targetability)
- [Exporting your themes](#exporting-your-themes)
    - [Default theme](#default-theme)
    - [Default dark theme](#default-dark-theme)
    - [Default light theme](#default-light-theme)
    - [Additional themes](#additional-themes)
- [← Back](../readme.md)

## Configuring your themes

We assume that you have at least read the [Changing the theme file](configuration.md#changing-the-theme-file) part of the documentation. 

A theme is built with a `Theme` object that you can import from `tailwindcss-theming/api`. Multiple `Theme` object can be added to a `ThemeManager` object, which needs to be the only export of your theme file.

```js
// theme.config.js

const { Theme, ThemeManager } = require('tailwindcss-theming/api');

// This is your main theme.
const base = new Theme();

// This is how you export `ThemeManager`.
module.exports = new ThemeManager()
  .setDefaultTheme(base);
```

## Creating a theme

### Colors 

A `Theme` contains a list of `colors`, among other things. Use the `addColors` method to define your theme's colors. This method takes an object similair to [Tailwind's color object syntax](https://tailwindcss.com/docs/customizing-colors/#nested-object-syntax) as a parameter. A color value can be any valid [`TinyColor` input](https://github.com/TypeCtrl/tinycolor#accepted-string-input).

```js
const base = new Theme()
  .addColors({
    background: '#212121',
    'on-background': '#ffffff'
  })
``` 

Every color will be added as a CSS variable to your themes. For instance, in the above configuration, assuming you only have a default theme, the following CSS will be generated:

```css
:root {
  --color-background: 33, 33, 33;
  --color-on-background: 255, 255, 255;
}
```

The reason the colors are stored as an `r, g, b` string is that they are used in combination with the CSS [`rgba`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) function to handle opacity. In this case, Tailwind's background color plugin will generate a `.bg-background` utility with a hardcoded opacity of `1`:

```css
/* ... */

.bg-background {
  background-color: rgba(var(--color-background), 1);
}
``` 

In order to change that value, [opacity variants](#variants) can be used, and [opacity utilities](https://github.com/tailwindcss/tailwindcss/pull/1627) support will be added once [colors will be able to be defined as closures](https://github.com/tailwindcss/tailwindcss/pull/1676).

### Variants 

In the real world, you won't be able to just add a few colors and make use of them throughout your application. Some elements will need special tweaks, such as opacity changes, hue changes, or whatever make them look good. In order to avoid having to declare lots of colors for this, a variant system is used. 

> **Note**: This variant system is **not** to be confused with [Tailwind's variants](https://tailwindcss.com/docs/pseudo-class-variants).

A color can have none, one or multiple variants, which will generate alternative utilities for that color. 

```js
const base = new Theme()
  .addColors({
    background: '#212121',
    'on-background': '#ffffff'
  })

  // Adds an opacity variant, which will generate alternative versions
  // of the `on-background` color utilities.
  .addOpacityVariant('hover', .75, 'on-background');
```  

This configuration will generate an additional `.text-on-background-hover` utility, like so:

```css
:root {
  /* ... */
  --color-on-background: 255, 255, 255;
  --opacity-variant-on-background-hover: 0.75;
}

/* ... */

.text-on-background-hover {
  background-color: rgba(var(--color-on-background), var(--opacity-variant-on-background-hover));
}
``` 

In a real application's context, use it in combination with Tailwind's `hover:` variant. 

```html
<span class="text-on-background hover:text-on-background-hover">Some text</span>
``` 

Multiple variants can share the same name if they are of different types (`color`, `opacity`, or `custom`) or if they target different colors.

#### Opacity variants

Opacity variants add an opacity variable to the themes' rules. You can declare an opacity variant with the `addOpacityVariant` method, which parameters are, in order, the name of the variant, its value (between `0` and `1`), and optionally, either a color name or an array of color names. If the last parameter is empty, the variant will be applied to every color.

```js
const base = new Theme()
  // ...
  .addOpacityVariant('hover', .75, 'on-background')
  .addOpacityVariant('hover', .5, ['on-surface', 'on-brand'])
;
``` 

#### Color variants 

Color variants completely replace a color by the one you specify. You can declare an opacity variant with the `addColorVariant` method, which parameters are, in order, the name of the variant, its value (any [`TinyColor`](https://github.com/TypeCtrl/tinycolor#accepted-string-input) input), and optionally, either a color name or an array of color names. If the last parameter is empty, the variant will be applied to every color. 

```js
const base = new Theme()
  // ...
  .addColorVariant('hover', '#f9f9f9', 'on-background')
;
``` 

#### Custom variants

Custom variants completely replace a color by the one you specify. The difference with color variants is that the parameter is a closure that accepts the color the variants will be applied to, and that return a different color. The color received is a `TinyColor` object, so you can manipulate the input however you want.

```js
const base = new Theme()
  // ...
  .addCustomVariant('hover', color => color.lighten(), 'on-background')
;
``` 

### Extending Tailwind's configuration with CSS variables

A very handy feature is to directly extend any key of Tailwind's configuration. For instance, imagine that you want to change your font depending on your theme. You can do that using the `setVariable` method. 

The following configuration will extend Tailwind's `fontFamily` plugin and replace its `sans` value to `['Roboto']`.

```js
// theme.config.js

const base = new Theme()
  .setVariable('sans', ['Inter', 'Segoe UI', 'Roboto'], 'fontFamily', 'font');
``` 

This is effectively the same as doing the following in your Tailwind configuration:

```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      fontFamily: {                 // `fontFamily` is the third argument
        sans: 'var(--font-sans)'    // `sans` is the first argument
      }
    }  
  }
}
``` 

Except only doing this won't generate your CSS variable, `--font-sans`. 
This is why `setVariable` is useful. It will generate the following CSS:

```css
:root {
  --font-sans: Inter, "Segoe UI", Roboto
}

/* ... */
.font-sans {
  font-family: var(--font-sans)
}
```

`setVariable`'s parameters are, in order, the key of a plugin, its value, the [plugin's name](https://tailwindcss.com/docs/configuration/#core-plugins), and a prefix to be added to the CSS variable name. The following will generate a variable named `--sans` instead of `--font-sans`:

```diff
- setVariable('sans', ['Inter', 'Segoe UI', 'Roboto'], 'fontFamily', 'font')
+ setVariable('sans', ['Inter', 'Segoe UI', 'Roboto'], 'fontFamily')
```


### Name and targetability

A theme can be named using the `setName` method. The name is used to determine the selector that will make your theme targetable. The selector is determined by the [strategy](configuration.md/#changing-the-strategy). 

By default, the strategy is set to `data-theme-attribute`, so a theme with the name `dark` will have a `[data-theme='light']` selector, which mean you will have to add an attribute to your HTML to activate the theme.

```html
<!-- ... -->
<body data-theme="light">
    <!-- ... -->
</body>
``` 

This is only possible if you specified that a theme should be targetable, using the `targetable` method on the `Theme` object. 

```js
// theme.config.js

const dark = new Theme()
  .setName('dark')
  .targetable()
  .addColors({ /* .. */ });
``` 

## Exporting your themes 

Once your themes are created, you need to register them in a `ThemeManager`, which needs to be the only export of your theme file. Multiple methods are available to specify the scope of each of your themes.

### Default theme 

The default theme will be the one that your users will see, by default, if they have no `prefers-color-scheme` preference set. The vast majority of users won't have one, so consider it the actual appearence of your application. 

You can define your default theme using the `setDefaultTheme` method. It takes a `Theme` object as its only parameter.

```js
// theme.config.js

const { Theme, ThemeManager } = require('tailwindcss-theming/api');

// This is your main theme.
const base = new Theme();

// This is how you export `ThemeManager`.
module.exports = new ThemeManager()
  .setDefaultTheme(base);
``` 

This configuration will generate your theme in a `:root` selector.

### Default dark theme 

`tailwindcss-theming` supports `prefers-color-scheme` as a first-class citizen. You can define a theme that will be applied by default to users that have defined their scheme preference to `dark` using the `setDefaultDarkTheme` method. 

```js
// theme.config.js

const { Theme, ThemeManager } = require('tailwindcss-theming/api');

// This is your main theme.
const base = new Theme();

// This is your dark theme.
const dark = new Theme();

// This is how you export `ThemeManager`.
module.exports = new ThemeManager()
  .setDefaultTheme(base)
  .setDefaultDarkTheme(dark)
;
``` 

This configuration will generate your `base` theme in a `:root` selector, and your `dark` theme in a `:root` selector under a `prefers-color-scheme` media query. 

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* ... */
  }
}
``` 

### Default light theme

Although this is less frequent, the same thing is possible for the `light` preference. If you have a site that is dark-schemed by default, you can serve a light version of it by using `setDefaultLightTheme`. It will do the same as before, replacing `dark` by `light`. 

```js
// theme.config.js

const { Theme, ThemeManager } = require('tailwindcss-theming/api');

// This is your main theme, dark-schemed.
const base = new Theme();

// This is your light theme.
const light = new Theme();

// This is how you export `ThemeManager`.
module.exports = new ThemeManager()
  .setDefaultTheme(base)
  .setDefaultLightTheme(light)
;
``` 

### Additional themes

Sometimes, you need to handle multiple themes, but they are not the default of some scheme. Use the `addTheme` method to add such themes, and don't forget to [name them and to make them targetable](#name-and-targetability). 

```js
// theme.config.js

const { Theme, ThemeManager } = require('tailwindcss-theming/api');

// This is your main theme, dark-schemed.
const base = new Theme();

// This is a solar theme.
const solar = new Theme()
  .setName('solar')
  .assignable();
  
// This is a lunar theme.
const lunar = new Theme()
  .setName('lunar')
  .assignable();

// This is how you export `ThemeManager`.
module.exports = new ThemeManager()
  .setDefaultTheme(base)
  .addtheme(solar)
  .addtheme(lunar)
;
``` 

These themes will now be targetable using your defined [strategy](configuration.md/#changing-the-strategy). 


## API reference

> **Note**: Some methods are not documented here because they are not quite useful. Any changes made to them will still be notified, and breaking changes will only occur in new major versions.

### `Theme`

| Method              | Description                          | Parameters                                                                             |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `setName`           | Sets the name of the theme.          | `name: string`                                                                         |
| `targetable`        | Sets the theme as targetable.        |
| `setColorScheme`    | Sets the theme's scheme.             | `scheme: Scheme`                                                                       |
| `light`             | Sets the theme's scheme to `light`.  |
| `dark`              | Sets the theme's scheme to `dark`.   |
| `addColors`         | Adds colors to the theme.            | `colors: TwoLevelColorObject`                                                          |
| `color`             | Add a color to the theme.            | `name: string, color: ColorInput`                                                      |
| `addVariants`       | Add variants to the theme.           | `variants: VariantsObject`                                                             |
| `addColorVariant`   | Add a color variant to the theme.    | `name: string, value: ColorInput: colors?: string | string[]`                          |
| `addOpacityVariant` | Add an opacity variant to the theme. | `name: string, value: number: colors?: string | string[]`                              |
| `addCustomVariant`  | Add a custom variant to the theme.   | `name: string, value: VariantTransformer: colors?: string | string[]`                  |
| `addVariant`        | Add a variant to the theme.          | `variant: Variant, colors?: string | string[]`                                         |
| `setVariables`      | Add a variable to the theme.         | `name: string, value: VariableInput | VariableInput[], path?: string, prefix?: string` |

### `ThemeManager`

| Method                  | Description                                                                       | Parameters           |
| ----------------------- | --------------------------------------------------------------------------------- | -------------------- |
| `setDefaultTheme`       | Sets the default theme of the application.                                        | `theme: Theme`       |
| `setDefaultLightTheme`  | Sets the default theme of the application for users prefering the `light` scheme. | `theme: Theme`       |
| `setDefaultDarkTheme`   | Sets the default theme of the application for users prefering the `dark` scheme.  | `theme: Theme`       |
| `addTheme`              | Adds a theme to the application.                                                  | `theme: Theme`       |
| `addLightTheme`         | Adds a theme to the application and change its scheme to `light`.                 | `theme: Theme`       |
| `addDarkTheme`          | Adds a theme to the application and change its scheme to `dark`.                  | `theme: Theme`       |
| `setPrefix`             | Overrides the [configuration's prefix](configuration.md#changing-the-strategy).   | `prefix: string`     |
| `setStrategy`           | Overrides the [configuration's strategy](configuration.md#changing-the-strategy). | `strategy: Strategy` |
| `asDataThemeAttributes` | Overrides the strategy to `data-theme-attribute`.                                 |
| `asDataAttributes`      | Overrides the strategy to `data-attribute`.                                       |
| `asClasses`             | Overrides the strategy to `class`.                                                |
| `asPrefixedAttributes`  | Overrides the strategy to `prefixed-attribute`.                                   | `prefix: string`     |
| `asPrefixedClasses`     | Overrides the strategy to `prefixed-class`.                                       | `prefix: string`     |
