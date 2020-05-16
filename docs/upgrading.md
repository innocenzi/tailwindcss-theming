<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Upgrading to v3.0.0 from v2.x](#upgrading-to-v3.0.0-from-v2.x)
- [← Back](../readme.md)

## Upgrading to v3.0.0 from v2.x 

Additionally to these changes, some features have been added, such as a built-in [variant plugin](configuration.md#using-variants). Make sure to read the new documentation to fully understand how to use the new configuration.

### Plugin declaration 

Previously, you had to directly import your configuration file. Now, you need to import the actual module, `tailwindcss-theming`. It will look for a `theme.config.js` at the root of your project. For more information, see [how to change the theme file](configuration.md#changing-the-theme-file).

```diff
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {},
  plugins: [
-    require('./theme.config.js')
+    require('tailwindcss-theming')
  ],
};
```

### Import

A `ThemeBuilder` and a `Theme` object had to be imported from `tailwindcss-theming`. The new builder object is called `ThemeManager`, and you need to import it from `tailwindcss-theming/api`.

```diff
// theme.config.js

- const { ThemeBuilder, Theme } = require('tailwindcss-theming');
+ const { ThemeManager, Theme } = require('tailwindcss-theming/api');
```

### `Theme` API changes

- `name()` is now `setName()`
- `assignable()` is now `targetable()`
- `colors()` is now `addColors()` and supports [Tailwind's nested color syntax](themes.md#colors)
- `opacityVariant()` is now `setOpacityVariant()`
- `colorVariant()` is now `setColorVariant()`
- `variable()` is now `setVariable()`

More informations about the new configuration on the [themes documentation](themes.md#creating-a-theme).

### `ThemeBuilder` API changes 

- `ThemeBuilder` is now `ThemeManager`
- `ThemeBuilder` is now `ThemeManager`
- `default` is now `setDefaultTheme`
- `light()` is has been removed
- `dark()` is has been removed
- `setDefaultLightTheme()` theme has been added
- `setDefaultDarkTheme()` theme has been added
- `theme()` is now `addTheme()`
- `addLightTheme()` theme has been added
- `addDarkTheme()` theme has been added
- `prefix()` is now `setPrefix()`
- `asDataThemeAttribute()` is now `asDataThemeAttributes()`
- `asDataAttribute()` is now `asDataAttributes()`
- `asPrefixedAttribute()` is now `asPrefixedAttributes()`
- `asClass()` is now `asClasses()`
- `asPrefixedClass()` is now `asPrefixedClasses()`
