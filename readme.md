<p align="center">
  <img alt="I'm not a designer leave me alone I know this banner suck" src="docs/assets/banner.jpg">
  <br>
  <div align="center">
  <a href="https://github.com/hawezo/tailwindcss-theming/releases">
    <img alt="GitHub release (latest SemVer including pre-releases)" src="https://img.shields.io/github/v/release/hawezo/tailwindcss-theming?include_prereleases&style=flat-square">
  </a>
  <a href="https://npmjs.com/package/tailwindcss-theming">
    <img alt="npm" src="https://img.shields.io/npm/v/tailwindcss-theming?style=flat-square">
  </a>
  <a href="https://npmjs.com/package/tailwindcss-theming">
    <img alt="npm" src="https://img.shields.io/npm/dt/tailwindcss-theming?style=flat-square">
  </a>
  <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/tailwindcss-theming?style=flat-square">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hawezo/tailwindcss-theming?style=flat-square">
  </div>
  <br>
</p>

# Table of contents

- [Introduction](#introduction)
- [Setup](docs/setup.md)
- [Usage](docs/usage.md)
- [Configuration](docs/configuration.md)
    - [Colors](docs/configuration.md#colors)
    - [Variants](docs/configuration.md#variants)
    - [Themes](docs/configuration.md#themes)
    - [Strategies](docs/configuration.md#strategies)
- [Extending Tailwind and custom variables](docs/extending.md)
    - [Adding variables](docs/extending.md#adding-variables)
    - [Extending Tailwind](docs/extending.md#extending-tailwind)
- [API reference](docs/reference.md)
  - [ThemeBuilder](docs/reference.md#theme-builder)
  - [Theme](docs/reference.md#theme)
- [Examples](docs/examples.md)
- [Compatibility](#compatibility)


# Introduction

`tailwindcss-theming` is a Tailwind plugin made to solve the common need to have multiple themes in an application. 

It uses [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) in order to make your themes changeable on the client-side. Swapping themes is as simple as changing the class of your `body` or `html` element. 

Moreover, this plugin fully supports the [`prefers-color-scheme`](https://developer.mozilla.org/fr/docs/Web/CSS/@media/prefers-color-scheme) media query, so you can setup a theme that will be automatically picked based on browser preferences.

**Get started:**

```console
$ yarn add tailwindcss-theming --dev
```


# Compatibility

Please note that IE11 [doesn't support CSS custom properties](https://caniuse.com/#feat=css-variables). You can still have partial support for IE11 by using the [PostCSS custom properties plugin](https://github.com/postcss/postcss-custom-properties). 

You won't be able to change theme at runtime, but at least your main and  theme will work flawlessly.
