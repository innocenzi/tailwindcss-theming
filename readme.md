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
