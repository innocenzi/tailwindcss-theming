import { Theme } from '../src';
import { TinyColor } from '@ctrl/tinycolor';
import { ThemeScheme } from '../src/Theming/Theme/ThemeScheme';
import faker from 'faker/locale/en';

export interface GeneratorOptions {
  hasOpacityVariants?: boolean;
  hasColorVariants?: boolean;
  opacityVariantCount?: Number;
  colorVariantCount?: Number;
  hasName?: boolean;
  name?: string | undefined;
  hasScheme?: boolean;
  scheme?: ThemeScheme;
  isDefault?: boolean;
  isAssignable?: boolean;
}

/**
 * Generates a theme based on some options.
 *
 * @export
 * @param {GeneratorOptions} [options]
 * @returns
 */
export function generateTheme(options?: GeneratorOptions) {
  options = {
    colorVariantCount: 1,
    opacityVariantCount: 1,
    hasOpacityVariants: false,
    hasColorVariants: false,
    hasName: false,
    name: 'my-theme',
    hasScheme: false,
    isDefault: true,
    isAssignable: false,
    ...options,
  };

  const theme = new Theme();

  if (options.hasColorVariants) {
    for (let i = 0; i < options.colorVariantCount; i++) {
      let color = new TinyColor(faker.commerce.color());
      theme.colorVariant(<string>color.toName(), `#${color.toHex8()}`);
    }
  }

  if (options.hasOpacityVariants) {
    for (let i = 0; i < options.opacityVariantCount; i++) {
      let opacity: number = Number(Math.random().toFixed(2));
      let name: string = faker.helpers.slugify(faker.random.word()).toLowerCase();
      theme.opacityVariant(name, opacity);
    }
  }

  if (options.hasName) {
    theme.name(options.name || faker.helpers.slugify(faker.random.word()).toLowerCase());
  }

  if (options.hasScheme) {
    if (!options.scheme) {
      Math.random() >= .5 ? theme.dark() : theme.light();
    } else {
      theme[options.scheme]();
    }
  }

  if (options.isDefault) {
    theme.default();
  }

  if (options.isAssignable) {
    theme.assignable();
  }

  return theme;
}
