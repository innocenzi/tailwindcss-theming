import theming from './src';

const themingPlugin = theming();

module.exports = {
    theme: {
      ...themingPlugin.theme
    },
    variants: {
        display: ['responsive', 'group-hover', 'hover'],
        elevation: ['focus', 'active', 'hover']
    },
    plugins: [
        require('tailwindcss-transitions')(),
        require('tailwindcss-elevation')(['responsive']),
        themingPlugin.plugin
    ]
};
