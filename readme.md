# Tailwind Theming

```js
import theming from './src';

const themingPlugin = theming();

module.exports = {
    theme: {
      ...themingPlugin.colors
    },
    plugins: [
        themingPlugin.plugin
    ]
};
```

# TO-DO

[ ] - Add an option to allow working with `prefers-color-scheme`:
        - If the user sets it, it will add media `prefers-color-scheme` media queries
        - Only specified dark themes will be allowed if the browser user's preferred scheme is dark
        - Same for light
