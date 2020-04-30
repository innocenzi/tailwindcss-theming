import { ColorScheme } from '../api';
import { TailwindPluginHelpers } from 'tailwindcss';
import { VariantPluginOptions } from '../plugin';

/**
 * Plugin that creates variants depending on the given configuration.
 *
 * @param helpers The tailwind plugin helpers.
 * @param options The variant plugin options.
 */
export function schemeVariant(
  helpers: TailwindPluginHelpers,
  { light, dark, noPreference, selectorName, variantName }: VariantPluginOptions
) {
  const variants: ColorScheme[] = [
    ...(light ? [ColorScheme.Light] : []),
    ...(dark ? [ColorScheme.Dark] : []),
    ...(noPreference ? [ColorScheme.Undefined] : []),
  ];

  variants.forEach(scheme => {
    // console.log({
    //   variantName: variantName(scheme),
    //   selectorName: selectorName(scheme),
    //   scheme,
    // });
    schemeVariantPlugin(variantName(scheme), selectorName(scheme), scheme, helpers);
  });
}

/**
 *
 * @param variantName The name of the variant.
 * @param scheme The color scheme for this variant.
 * @param helpers The tailwind plugin helpers.
 */
export function schemeVariantPlugin(
  variantName: string,
  selectorName: string,
  scheme: ColorScheme,
  { addVariant, e, postcss }: TailwindPluginHelpers
) {
  addVariant(variantName, ({ container, separator }) => {
    // Creates the prefers-color-scheme rule
    const prefersColorScheme = postcss.atRule({
      name: 'media',
      params: `(prefers-color-scheme: ${scheme})`,
    });

    // Places the nodes correctly
    prefersColorScheme.append(container.nodes);
    container.append(prefersColorScheme);

    // Updates the selector to add the variant name
    prefersColorScheme.walkRules((rule: any) => {
      rule.selector = `.${e(`${selectorName}${separator}${rule.selector.slice(1)}`)}`;
    });
  });
}
