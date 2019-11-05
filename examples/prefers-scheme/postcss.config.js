module.exports = {
  plugins: [
    require('postcss-import'), // To use the @import directive
    require('postcss-nested'), // To use nested CSS
    require('tailwindcss'), // Our boy Tailwind
    require('postcss-custom-properties'), // For compatibility
    require('autoprefixer'),
    // require('@fullhuman/postcss-purgecss')({
    //   content: [
    //     './src/**/*.html',
    //     './src/**/*.vue',
    //   ],
    //   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    // }),
  ],
};
