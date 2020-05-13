<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Changing the theme file](#changing-the-theme-file)
- [Changing the strategy](#changing-the-strategy)
- [Using a preset](#using-a-preset)
- [Using variants](#using-variants)
- [← Back](../readme.md)

## Plugin configuration

This file is a reference for the documentation of the plugin itself. We assume that you followed the [quick-start guide](quick-start.md), and that you know how to use a plugin with Tailwind CSS.

## Changing the theme file

By default, you are expected to create a `theme.config.js` at the root of your project (eg. in the same directory as where your `tailwind.config.js` is). If you don't want to use this file, you can define the `themes` option of the plugin. 

```js
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      themes: 'config/theme.config.js', // Change your path here.
    }),
  ],
};
```

The `themes` option can also accept a `ThemeManager` object, if you prefer to declare it that way. For instance, if you don't want to rely on the plugin to find your configuration, you can import it and pass it to the `themes` option directly. 

Last, you can set `themes` to `false` if you don't want to use themes. It is useful if you only want to use the [variant](#variants) plugin.

## Changing the strategy

You can change the way you swap themes by changing the CSS selectors of your themes. In `tailwindcss-theming`, this is done by changing the `strategy` of the plugin:

```js
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('tailwindcss-theming')({
      strategy: 'prefixed-class', // Change your strategy here.
      prefix: 'theme',            // Optionally change your prefix here.
    }),
  ],
};
```

The default strategy is **`data-theme-attribute`** and the default prefix is **`theme`**.

### Strategies

| Name                   | Description                                                | Selector                      |
| ---------------------- | ---------------------------------------------------------- | ----------------------------- |
| `prefixed-class`       | Each theme will be exported in a class with a prefix.      | `.<prefix>-<theme-name>`      |
| `class`                | Each theme will be exported in a class.                    | `.<theme-name>`               |
| `data-attribute`       | Each theme will be exported as a data-attribute.           | `[data-<theme-name>]`         |
| `data-theme-attribute` | Each theme will be exported as a data-attribute.           | `[data-theme='<theme-name>']` |
| `prefixed-attribute`   | Each theme will be exported as an attribute with a prefix. | `[<prefix>-<theme-name>]`     |
| `attribute`            | Each theme will be exported as an attributex.              | `[<theme-name>]`              |

## Using a preset

> Please note that presets are currently in an experimental state. They may change in the future, and some of the changes can be breaking.

`tailwindcss-theming` comes with multiple presets that allow you to quickly prototypate something, or even just use an already-defined theme that suits your taste. You can define one by changing the `preset` parameter of the plugin.

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

To see which presets are available, see the [preset](presets.md) documentation.

## Using variants

Variants are a useful, more [Tailwind-like](https://twitter.com/adamwathan/status/1256279329199263745) way of working with dark mode. You can combine them with theming to have even more flexibility, or disable themes and only use variants.

To start using them, you need to change the `variants` option of the plugin. It accepts an object with multiple optional parameters. 

```js
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {
    textColor: ['dark', 'hover', 'focus']  // You need to enable the variant for the plugins you want to use it with.
  },
  plugins: [
    require('tailwindcss-theming')({
      variants: {
        dark: true,                        // Enables the `dark` variant, defaults to false.
        light: false,                      // Enables the `light` variant, defaults to false.
        noPreference: false,               // Enables the `no-preference` variant, defaults to false.
        variantName: scheme => scheme,     // A callback that returns a string to define the variant name, takes the scheme as a parameter.
        selectorName: scheme => scheme,    // A callback that returns a string to define the selector, takes the scheme as a parameter.
      }
    }),
  ],
};
```

Note that you also need to enable the variant for the plugins you want to use it with. The **variant name** is equal to the result of the callback you passed to the `variantName` object, defaulting to just the name of the scheme (`dark`, `light` or `no-preference`). For instance, with the following callback, the `dark` variant will actually be `dark-mode`, the `light` one will be `light-mode`, etc:

```js
variantName: scheme => `${scheme}-mode`
```

The **selector name** is used to define the prefix of the utilities. It defaults to just the name of the scheme, but if you changed the variant name, you may want to change the selector name accordingly, or just change the selector name if you feel like so. It's only a preference thing, and you don't need to use those two options if you don't want to.
