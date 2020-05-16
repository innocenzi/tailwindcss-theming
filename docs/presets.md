<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Introduction](#introduction)
- [Presets](#presets)
    - [Nord](#nord)
    - [Tailwind CSS](#tailwind-css) (not released)
    - [Nord Vanilla](#nord-vanilla)
    - [Tailwind CSS Vanilla](#tailwind-css-vanilla)
- [← Back](../readme.md)

## Introduction

> Please note that presets are currently in an experimental state. They may change in the future, and some of the changes can be breaking.

If you want to get started quickly, you can use a built-in preset. A preset is simply a `ThemeManager` object, built in the plugin, with themes inside. 

You can define a preset in your Tailwind CSS configuration file, in `tailwindcss-theming`'s options, with the `preset` key. See [presets](#presets) for available presets. 

```js
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      preset: 'nord', // Change your preset here.
    }),
  ],
};
```

## Presets

### Nord 

- **Preset name**: `nord` 
- **Themes**:
    - `light` (default)
    - `dark`

A preset using semantic names with the colors of the [Nord](https://nordtheme.com) palette. 

```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      preset: 'nord',
    }),
  ],
};
```

### Tailwind CSS 

- **Preset name**: `tailwind` 
- **Themes**:
    - `teal` (default)
    - `red`
    - `orange`
    - `yellow`
    - `blue`
    - `indigo`
    - `pink`
    - `dark-teal`
    - `dark-red`
    - `dark-orange`
    - `dark-yellow`
    - `dark-blue`
    - `dark-indigo`
    - `dark-pink`

This preset is not ready yet. It will be a set of dark and light themes, with `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `indigo` and `pink` variants. 

### Nord Vanilla

- **Preset name**: `nord-vanilla`
- **Themes**:
    - `nord` (default)

A preset exposing the colors of the [Nord](https://nordtheme.com) palette. To see what the color names are, see the [palette's documentation](https://www.nordtheme.com/docs/colors-and-palettes).

```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      preset: 'nord-vanilla',
    }),
  ],
};
```

### Tailwind CSS Vanilla

- **Preset name**: `tailwind-vanilla`
- **Themes**:
    - `tailwind` (default)

A preset mimicking the actual colors of Tailwind CSS. The colors are exactly the same as in Tailwind. Not entirely sure why you would use it, since it kind of defeats the goal of the plugin, unless you use it with variants. 

```js
// tailwind.config.js

module.exports = {
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      preset: 'tailwind-vanilla',
    }),
  ],
};
```
