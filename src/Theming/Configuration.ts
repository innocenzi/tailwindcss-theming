import { Strategy } from "./Strategy";

export interface Configuration {
  /**
   * The prefix used for rule of export strategy.
   */
  prefix: string | undefined;

  /**
   * Strategy used to export the themes.
   */
  strategy: Strategy;

  /**
   * The prefix for the exported variables. 
   * A variable will name will be `--<prefix>-<key>`.
   */
  colorVariablePrefix: string;
}
