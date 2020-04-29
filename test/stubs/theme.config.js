const { ThemeManager, Theme } = require('../../api')

const light = new Theme()
  // .setColors({

  // })
;

module.exports = new ThemeManager()
  .setDefaultTheme();
