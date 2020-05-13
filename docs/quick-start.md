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

Once your dependencies are installed, you will need to require the plugin in your Tailwind CSS configuration:

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

This plugin is dependent on a `theme.config.js` file at the root of your project (unless you [disable it and use variants](configuration.md/#disabling-themes)). To know how to change this path, head to the [configuration](configuration.md/#changing-the-theme-file) instructions. 

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
  .setDefaultTheme(base)          // Sets the `base` theme as the default theme.
  .setDefaultDarkTheme(dark);     // Sets the `dark` theme as the default theme for users that prefer the `dark` scheme.
```

## Usage

Once you built Tailwind CSS again, you will be able to use your new themes. The colors added by your themes will be added to your Tailwind CSS configuration automatically, and your color utilities will use them. With the example above, you will be able to do so:

```html
<body class="bg-background text-on-background">
</body>
```

When changing theme, your color will be updated accordingly. The way you change themes is different according to the [strategy]() you will chose. By default, the [`data-theme-attribute`] is used, so you'll have to add the attribute `[data-theme=<name>]` to your HTML element, where `<name>` is your theme name. 

```html
<body data-theme="dark">
</body>
```

This will update the CSS variables, and every child will have its theme changed. You can take advantage of that and use the transition utilities of Tailwind to get a smooth animation when you swap themes.

```html
<body class="bg-background text-on-background transition-colors duration-150" data-theme="dark" >
</body>
```

### Alpine.js example 

Use `x-data` to declare a component scope, to which you give an object with a `theme` property. Then, use `x-bind` to set the value of the `data-theme` attribute to the value of the `theme` property. You are now able to update the `theme` property with the `@click` directive on a button.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tailwind CSS starter</title>

    <!-- Tailwind is imported here -->
    <link rel="stylesheet" href="app.css" />

    <!-- Alpine.js is imported here -->
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.js" defer></script>
  </head>
  
  <body
    x-data="{ theme: 'auto' }"
    x-bind:data-theme="theme"
    class="antialiased font-medium | flex flex-col items-center justify-center | transition-colors duration-150 | bg-background text-on-background"
  >
    <h1 class="mb-4 text-4xl font-thin">Hello World</h1>

    <div class="flex">

      <!-- Change to auto -->
      <button @click="theme = 'auto'" class="mx-1 text-sparkles">
        <svg class="w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
      </button>

      <!-- Change to dark -->
      <button @click="theme = 'dark'" class="mx-1 text-moon">
        <svg class="w-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </button>

      <!-- Change to light -->
      <button @click="theme = 'light'" class="mx-1 text-sun">
        <svg class="w-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clip-rule="evenodd"
            fill-rule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  </body>
</html>
```
