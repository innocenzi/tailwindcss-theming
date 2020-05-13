<center><img src="../logo.svg" width="100"></center>

# Table of contents

- [Installation](#installation)
- [Setup](#setup)
- [← Back](../)

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
    brand: '#6a4766'
  });

const dark = new Theme()
  .addColors({
    brand: '#f57337'
  });

module.exports = new ThemeManager()
  .setDefaultTheme(base)
  .setDefaultDarkTheme(dark);
```
