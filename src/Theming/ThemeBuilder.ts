import { Theme } from './Theme/Theme';
import { Configuration } from './Configuration';
import { Strategy } from './Strategy';
import { TailwindPlugin } from '../TailwindPlugin/TailwindPlugin';
import { TailwindPluginHandler } from '../TailwindPlugin/TailwindPluginHandler';
import { getColorConfiguration } from './Generator/getColorConfiguration';
import { getCssConfiguration } from './Generator/getCssConfiguration';

export class ThemeBuilder {
  private _themes: Theme[];
  private _config!: Configuration;
  private _handlerConfig: any = {};

  constructor() {
    this._themes = [];
    this.defaults();
  }

  /**
   * Sets the default configuration.
   *
   * @returns self
   */
  defaults(): this {
    this._config = {
      prefix: undefined,
      colorVariablePrefix: 'color',
      strategy: Strategy.Attribute,
    };

    return this;
  }

  /**
   * Sets the `prefix` configuration option.
   * @param value Export prefix.
   *
   * @returns self
   */
  prefix(value: string | undefined): this {
    this._config.prefix = value;

    return this;
  }

  /**
   * Sets the `colorVariablePrefix` configuration option.
   * @param value Variable prefix.
   *
   * @returns self
   */
  colorVariablePrefix(value?: string): this {
    this._config.colorVariablePrefix = value;

    return this;
  }

  /**
   * Sets the `strategy` configuration option.
   * @param value Stragegy.
   *
   * @returns self
   */
  strategy(value: Strategy): this {
    this._config.strategy = value;

    return this;
  }

  /**
   * Use the `PrefixedClass` strategy.
   *
   * @param {string} [prefix] Prefix to be used.
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asPrefixedClass(prefix?: string): this {
    this._config.strategy = Strategy.PrefixedClass;
    this._config.prefix = prefix || this._config.prefix;

    return this;
  }

  /**
   * Use the `Class` strategy.
   *
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asClass(): this {
    this._config.strategy = Strategy.Class;

    return this;
  }

  /**
   * Use the `DataAttribute` strategy.
   *
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asDataAttribute(): this {
    this._config.strategy = Strategy.DataAttribute;

    return this;
  }

  /**
   * Use the `DataThemeAttribute` strategy.
   *
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asDataThemeAttribute(): this {
    this._config.strategy = Strategy.DataThemeAttribute;

    return this;
  }

  /**
   * Use the `PrefixedAttribute` strategy.
   *
   * @param {string} [prefix] Prefix to be used.
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asPrefixedAttribute(prefix?: string): this {
    this._config.strategy = Strategy.PrefixedAttribute;
    this._config.prefix = prefix || this._config.prefix;

    return this;
  }

  /**
   * Use the `Attribute` strategy. This is the default one.
   *
   * @returns {this}
   * @memberof ThemeBuilder
   */
  asAttribute(): this {
    this._config.strategy = Strategy.Attribute;

    return this;
  }

  /**
   * Add a default theme.
   *
   * @param {Theme} theme
   * @returns {this}
   * @memberof ThemeBuilder
   */
  default(theme: Theme): this {
    this._themes.push(theme.default());

    return this;
  }

  /**
   * Add a theme.
   *
   * @param {Theme} theme
   * @returns {this}
   * @memberof ThemeBuilder
   */
  theme(theme: Theme): this {
    this._themes.push(theme);

    return this;
  }

  /**
   * Add themes.
   *
   * @param {Theme[]} themes
   * @returns {this}
   * @memberof ThemeBuilder
   */
  themes(themes: Theme[]): this {
    this._themes.push(...themes);

    return this;
  }

  /**
   * Gets the theming configuration.
   *
   * @returns {Configuration}
   * @memberof ThemeBuilder
   */
  get theming(): Configuration {
    return this._config;
  }

  /**
   * Gets the Tailwind configuration.
   *
   * @readonly
   * @type {*}
   * @memberof ThemeBuilder
   */
  get config(): any {
    return {
      theme: {
        colors: getColorConfiguration(this._themes, this._config),
      }
    };
  }

  /**
   * Gets the Tailwind handler method.
   *
   * @readonly
   * @type {TailwindPluginHandler}
   * @memberof ThemeBuilder
   */
  get handler(): TailwindPluginHandler {
    return ({ addBase }) => {
      addBase(getCssConfiguration(this._themes, this._config), this._handlerConfig);
    };
  }

  /**
   * Gets the whole plugin.
   *
   * @returns {TailwindPlugin}
   * @memberof ThemeBuilder
   */
  plugin(config: any = {}): TailwindPlugin {
    this._handlerConfig = config || {};

    return {
      config: this.config,
      handler: this.handler,
    };
  }
}
