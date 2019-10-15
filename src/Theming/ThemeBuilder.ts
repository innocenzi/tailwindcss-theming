import { Theme } from './Theme/Theme';
import { Configuration } from './Configuration';
import { Strategy } from './Strategy';
import { TailwindPlugin } from '../TailwindPlugin/TailwindPlugin';
import { TailwindPluginHandler } from '../TailwindPlugin/TailwindPluginHandler';

export class ThemeBuilder {
  private _themes: Theme[];
  private _config!: Configuration;

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
  colorVariablePrefix(value: string): this {
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
   * Sets the themes. Returns the current themes if no argument passed.
   * @param themes Themes to set.
   *
   * @returns self|Theme[]
   */
  themes(themes?: Theme[]): this | Theme[] {
    if (!themes) {
      return this._themes;
    }

    this._themes = themes;

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
    // TODO Generate the configuration.
    return {};
  }

  /**
   * Gets the Tailwind handler method.
   *
   * @readonly
   * @type {TailwindPluginHandler}
   * @memberof ThemeBuilder
   */
  get handler(): TailwindPluginHandler {
    // TODO Create the handler.
    return () => {};
  }

  /**
   * Gets the whole plugin.
   *
   * @returns {TailwindPlugin}
   * @memberof ThemeBuilder
   */
  plugin(): TailwindPlugin {
    return {
      config: this.config,
      handler: this.handler,
    };
  }
}
