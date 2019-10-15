/**
 * Strategy used to export the themes.
 */
export enum Strategy {
  /**
   * Each theme will be exported in a class with a prefix.
   * You will be able to use a theme by applying the class `.<choosenPrefix>-<themeName>` on a node.
   * The CSS rule will be `.<choosenPrefix>-<themeName>`.
   */
  PrefixedClass = 'prefixed-class',

  /**
   * Each theme will be exported in a class.
   * You will be able to use a theme by applying the class `.<themeName>` on a node.
   * The CSS rule will be `<themeName>`.
   */
  Class = 'class',

  /**
   * Each theme will be exported as a data-attribute.
   * You will be able to use a theme by setting the attribute `data-<themeName>` on a node.
   * The CSS rule will be `[data-<themeName>]`.
   */
  DataAttribute = 'data-attribute',

  /**
   * Each theme will be exported as an attribute with a prefix.
   * You will be able to use a theme by setting the attribute `<choosenPrefix>-<themeName>` on a node.
   * The CSS rule will be `[<choosenPrefix>-<themeName>]`.
   */
  PrefixedAttribute = 'prefixed-attribute',

  /**
   * Each theme will be exported as an attribute.
   * You will be able to use a theme by setting the attribute `<themeName>` on a node.
   * The CSS rule will be `[<themeName>]`.
   */
  Attribute = 'attribute',
}
