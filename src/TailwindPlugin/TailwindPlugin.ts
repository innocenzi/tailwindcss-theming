import { TailwindPluginHandler } from "./Plugin";

export interface TailwindPlugin {
  config: any;
  handler: TailwindPluginHandler;
}
