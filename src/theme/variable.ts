import { ColorInput, TinyColor } from '@ctrl/tinycolor';
import { isColorInput } from '../util/isColorInput';
import _ from 'lodash';

export type VariableInput = string | number | ColorInput;

/**
 * Represents an arbitrary CSS variable.
 */
export class Variable {
  private _name: string;
  private _value: VariableInput | VariableInput[];
  private _path?: string;
  private _prefix?: string;

  constructor(
    name: string,
    value: VariableInput | VariableInput[],
    path?: string,
    prefix?: string
  ) {
    this._name = name;
    this._value = value;
    this._path = path;
    this._prefix = prefix;
  }

  /**
   * Gets this variable's name.
   */
  getName(): string {
    return this._name;
  }

  /**
   * Gets this variable's value.
   */
  getValue(): VariableInput | VariableInput[] {
    return this._value;
  }

  /**
   * Gets this variable's prefix.
   */
  getPrefix(): string | undefined {
    return this._prefix;
  }

  /**
   * Gets the path to the configuration key that this variable extends.
   */
  getPath(): string {
    if (!this._path) {
      return '';
    }

    return `${this._path}.${_.camelCase(this._name)}`;
  }

  /**
   * Checks if this variable extends Tailwind's configuration.
   */
  extends(): boolean {
    return undefined !== this._path;
  }

  /**
   * Gets a CSS variable name for this variable.
   */
  getCssVariableName(): string {
    const name = _.kebabCase(this._name);
    const prefix = _.kebabCase(this._prefix);

    return `--${this._prefix ? `${prefix}-` : ''}${name}`;
  }

  /**
   * Gets the value for the Tailwind configuration.
   */
  getTailwindConfigurationValue(): string {
    return `var(${this.getCssVariableName()})`;
  }

  /**
   * Gets a value usable as the value of a CSS variable.
   */
  getCssVariableValue(): string {
    const scalarify = (value: VariableInput) => {
      if (_.isString(value)) {
        return value.toString();
      }

      if (_.isNumber(value)) {
        return parseFloat(value.toFixed(8)).toString();
      }

      if (isColorInput(value)) {
        const { r, g, b, a } = new TinyColor(value);

        return `${r},${g},${b},${a}`;
      }

      return value;
    };

    if (_.isArray(this._value)) {
      return this._value
        .map(item => scalarify(item))
        .map(item => (item.includes(' ') ? `"${item}"` : item))
        .join(', ');
    }

    return scalarify(this._value);
  }
}
