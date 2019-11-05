<p align="center">
  <img alt="I'm not a designer leave me alone I know this banner suck" src="assets/banner.jpg">
</p>

# Table of contents

- [API reference](#api-reference)
    - [ThemeBuilder](#theme-builder)
    - [Theme](#theme)
- [← Back](../readme.md)

# API reference

## `ThemeBuilder`

| Method | Arguments | Description |
| ------ | --------- | ----------- |
| `defaults()` | None | Applies the default configuration.
| `prefix()` | `prefix?: string` | Sets the prefix used for the export strategies.
| `colorVariablePrefix()` | `prefix?: string` | Sets the color variables' names prefixes.
| `strategy` | [`Strategy`](../src/Theming/Strategy.ts) | Sets the export strategy.
| `asPrefixedClass()` | `prefix?: string` | Sets the export strategy to `PrefixedClass`. You can pass a prefix as a parameter to this method.
| `asClass()` | None | Sets the export strategy to `Class`.
| `asDataAttribute()` | None | Sets the export strategy to `DataAttribute`.
| `asDataThemeAttribute()` | None | Sets the export strategy to `DataThemeAttribute`.
| `asPrefixedAttribute()` | `prefix?: string` | Sets the export strategy to `PrefixedAttribute`. You can pass a prefix as a parameter to this method.
| `asAttribute()` | None | Sets the export strategy to `Attribute`.
| `default()` | [`Theme`](../src/Theming/Theme/Theme.ts) | Adds a default theme.
| `dark()` | [`Theme`](../src/Theming/Theme/Theme.ts), `default: boolean = true`, `assignable: boolean = true` | Adds a dark theme.
| `light()` | [`Theme`](../src/Theming/Theme/Theme.ts), `default: boolean = true`, `assignable: boolean = true` | Adds a light theme.
| `theme()` | [`Theme`](../src/Theming/Theme/Theme.ts) | Adds a theme.
| `themes()` | [`Theme`](../src/Theming/Theme/Theme.ts)`[]` | Adds multiple themes.
| `theming()` | None | Gets the current plugin configuration.
| `config()` | None | Gets the processed Tailwind configuration.
| `handler()` | None | Gets the Tailwind's plugin `handler` method.
| `plugin()` | `{}` | Gets the whole plugin. Use this method to register the plugin.

## `Theme`

| Method | Arguments | Description |
| ------ | --------- | ----------- |
| `default()` | None | Sets the theme as the default theme. Internally, changes its name to `default` if it has no name.
| `assignable()` | None | Let the theme be assignable whether it's the default theme or not.
| `name()` | `string` | Sets the theme's name.
| `light()` | None | Sets the theme's scheme to `light`.
| `dark()` | None | Sets the theme's scheme to `dark`.
| `color()` | `name: string`, `value: string` | Adds a `Color` to the theme.
| `customProperty()` | `name: string`, `value: string | Array<number | string> | number`, `extend?: string`, `prefix?: string | false, parse: boolean = true` | Adds a custom property to the theme.
| `variable()` | `name: string`, `value: string | Array<number | string> | number`, `extend?: string`, `prefix?: string | false, parse: boolean = true` | Adds a custom property to the theme.
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
