<p align="center">
  <img alt="I'm not a designer leave me alone I know this banner suck" src="assets/banner.jpg">
</p>

# Table of contents

- [Usage](#usage)
    - [How it works](#how-it-works)
    - [Naming conventions](#naming-conventions)
- [← Back](../readme.md)

# Usage

## How it works

`tailwindcss-theming` will take your configuration and create CSS rules based on it. In these rules, the colors of your themes will be declared. The plugin will also [replace Tailwind's color palette](https://tailwindcss.com/docs/customizing-colors/#app). 

This way, you will be able to use color utilities such as [`text colors`](https://tailwindcss.com/docs/text-color), [`background colors`](https://tailwindcss.com/docs/background-color) or even [`border colors`](https://tailwindcss.com/docs/border-color). 

For instance, if you use these colors for your main theme:

```js
{
  'brand':'#BF616A',
  'on-brand':'#ffffff',
}
```

The following CSS will be generated:

```css
:root {
  --color-brand: 191,97,106;
  --color-on-brand: 255,255,255;
}
```

And the following color configuration will be used for Tailwind:

```js
{
  brand: rgb(var(--color-brand)),
  'on-brand': rgb(var(--color-on-brand)),
}
```

And you will be able to use these this way:

```html
<span class="text-on-brand bg-brand">Some text</span>
```

## Naming conventions

Coming up with variable names that make sense for both light and dark schemes can be tricky. 

For instance, it doesn't make sense to have a `white` color variable with `#ffffff` because the places it can be used are not the same in a light context than in a dark context. A `blue-200` shade will render quite different in a light context and a dark context as well. 

A good practice is to separate the colors used in the backgrounds of your application and the ones used in the foreground. For the backgrounds, call them however you want as long as the name is not too specific to the color (eg. avoid `dark`, `white`, `lighter`, and prefer `primary`, `secondary`, `navigation`, `background`, etc). For the foreground, you should call them `on-<background-name>`. For instance, `on-surface`, on `navigation`, `on-navigation-primary` or `on-background` are good names for foreground colors.

### Good

For instance, the following configuration is good:

```js
{
  'brand': '#2196f3',
  'on-brand': '#ffffff',
  'navigation-primary': '#3c4253',
  'navigation-secondary': '#303030',
  'on-navigation': '#9aa2b6',
  'background':'#f4f4f4',
  'surface':'#ffffff',
  'on-background':'#585851',
  'on-surface':'#3c3c3c',
}
```

### Bad

While the following is not:

```js
{
   'brand': '#6fafff',
   'brand': '#2196f3',
   'brand-darker': '#2151e1'
}
