<p align="center">
  <img alt="I'm not a designer leave me alone I know this banner suck" src="assets/banner.jpg">
</p>

# Table of contents

- [Introduction](#introduction)
- [Setup](#setup)
- [← Back](../readme.md)

# Introduction

This plugin is special because it requires quite a lot of configuration. But don't let that scare you, the configuration is really simple. 

It is recommanded that you **create a file dedicated to this plugin's configuration**. The reason for this, beside the fact that the setup will take a few lines, is that it will allow an easy maintaining. With all the color, variants and property definitions in the same file, it will be really easy to tweak anything you need as you develop your application.

# Setup

First, create a new file at the root of your project, `theme.config.js`. Its name doesn't matter, but naming it this way is a good practice to stay similar to other configuration files you usually have.

```js
// theme.config.js
const { ThemeBuilder, Theme } = require('tailwindcss-theming');

const mainTheme = new Theme()
  .default()
  .colors({
    'brand':'#2196f3',
    'on-brand':'#ffffff',
  })
;

const darkTheme = new Theme()
  .colors({
    'brand':'#1565c0',
    'on-brand':'#ffffff',
  })
;

module.exports = new ThemeBuilder()
  .asDataThemeAttribute()
  .default(mainTheme)
  .dark(darkTheme);
```

Don't worry, this will be explained later. The theme boilerplate is there, but Tailwind doesn't know about it yet. Let's fix this. This file just need to be required in Tailwind's configuration.

```js
// tailwind.config.js

const tailwind = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {},
  variants: {},
  plugins: [
    require('./theme.config.js')
  ],
};
```

Everything is good now. Your themes are ready to be used.
