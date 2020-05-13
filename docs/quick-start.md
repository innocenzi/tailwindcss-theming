<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [← Back](../readme.md)

## Installation

We assume that you already have Tailwind CSS installed and ready. You need to add `tailwindcss-theming` to your project:

```bash
$ yarn add tailwindcss-theming --dev
$ npm i -D tailwindcss-theming
```

Once your dependencies are installed, you will need to require the plugin in your Tailwind configuration:

```js
// tailwind.config.js

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('tailwindcss-theming')
  ],
};
```

## Setup

This plugin is dependent on a `theme.config.js` file at the root of your project. To know how to change this path, head to the [advanced installation]() instructions. 

This file will contain your theme definition. It **must** export a single `ThemeManager` object.

> Note the `/api` in the `require` statement.

```js
// theme.config.js

const { ThemeManager, Theme } = require('tailwindcss-theming/api');

const base = new Theme()
  .addColors({
    brand: '#44b3ac',             // Your brand color
    'on-brand': '#ffffff',        // For everything that goes on your brand color
    background: '#f7fafc',        // A background color
    'on-background': '#1a202c'    // For everything that goes on your background color
  });

const dark = new Theme()
  .addColors({
    brand: '#44b3ac',             // Your brand color
    'on-brand': '#ffffff',        // For everything that goes on your brand color
    background: '#1c1e26',        // A background color
    'on-background': '#d5d8da'    // For everything that goes on your background color
  });

module.exports = new ThemeManager()
  .setDefaultTheme(base)
  .setDefaultDarkTheme(dark);
```

## Usage

Once you built Tailwind CSS again, you will be able to use your new themes. The colors added by your themes will be added to your Tailwind CSS configuration automatically, and your color utilities will use them. With the example above, you will be able to do so:

```html
<body class="bg-background text-on-background"></body>
```

When changing theme, your color will be updated accordingly. The way you change themes is different according to the [strategy]() you will chose. By default, the [`data-theme-attribute`] is used, so you'll have to add the attribute `data-theme=<name>` to your HTML element, where `<name>` is your theme name. 

```html
<body data-theme="dark"></body>
```
