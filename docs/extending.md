<p align="center">
  <img alt="I'm not a designer leave me alone I know this banner suck" src="assets/banner.png">
</p>

# Table of contents

- [Adding variables](#adding-variables)
- [Extending Tailwind](#extending-tailwind)
    - [Prefixes](#prefixes)
    - [Parsing](#parsing)
- [← Back](../readme.md)

# Adding variables

You can add custom CSS variables on your themes using the `variable()` method on a `Theme` object. The first argument is the name of the variable, while the second argument can be a `string`, a `number`, or an array of either of them. This will generate a variable that you can use however you want in your CSS. 

```js
// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');
const mainTheme = new Theme()
  .variable('font-title', ['Roboto', '"Segoe UI"'])
;

module.exports = new ThemeBuilder()
  .default(mainTheme);
```

In this example, a `--font-title` variable with the value `Roboto,"Segoe UI"` will be added in our `:root` default theme. We can make use of it in our templates:

```html
<span style="font-family: var(--font-title)">Ohayo</span>
```

# Extending Tailwind

The `variable()` method has a third parameter that can be used as a path. This path will be added in Tailwind's `extend` property. It means that you can actually extend Tailwind with custom CSS variables. 

With this in mind, we can enhance the previous example with the following:

```js
// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');
const mainTheme = new Theme()
  .color('primary', '#e1e1e1')
  .variable('title', ['Roboto', '"Segoe UI"'], 'fontFamily')
;

module.exports = new ThemeBuilder()
  .default(mainTheme);
```

This will generate a `--font-family-title` variable in our `:root` default theme. Note that it has been prefixed by a pascal-cased version of the extend path, `fontFamily`. This configuration will generate the following Tailwind `theme`:

```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        title: 'var(--font-family-title)'
      }
    }
  }
}
```

Now, you can use the Tailwind's `fontFamily` utilities in your templates:

```html
<span class="font-title">Ohayo</span>
```

This feature opens the gate to really powerful theming, as you can now theming basically any Tailwind utility with CSS properties.

## Prefixes

If for some reason you don't want a variable to have a generated prefix based on its `path` property, you can set the fourth parameter of the `variable()` method to false. With the previous example, it will generate a `--title` variable, but will work the exact same way.

You can also set a `string` instead of the `false` value to define your own prefix. With the previous example, if you set `font` as the fourth parameter, it will generate a `--font-title`, and still work the same way.

## Parsing

There is a fifth argument to the `variable()` method, which defines if `tailwindcss-theming` must take care of the formatting of the CSS custom property value. As of now, it will most likely don't change anything if you set it to `false`, but in the future, this may change. For instance, an array with a string containing a space may be parsed differently. Currently, you have to surround this string with double quotes to make it work.
