import { ThemingPluginOptions } from '../src/plugin';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import plugin from '../src';
import _ from 'lodash';

export async function generatePluginCss(
  options: Partial<ThemingPluginOptions> = {
    path: './test/stubs/theme.config.js',
  },
  config: any = {}
) {
  const { css } = await postcss(
    tailwindcss(
      _.merge(
        {
          theme: {
            screens: {
              sm: '640px',
            },
          },
          corePlugins: false,
          plugins: [plugin(options)],
        },
        config
      )
    )
  ).process('@tailwind base; @tailwind components; @tailwind utilities', {
    from: undefined,
  });

  return css;
}
