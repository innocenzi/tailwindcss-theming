module.exports = {
  plugins: [
    require('./theme.config'), // <------
    require('tailwindcss-transitions')(),
  ],
};
