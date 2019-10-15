import { TailwindPluginHandler } from "./TailwindPluginHandler";

export interface TailwindPlugin {
  config: any;
  handler: TailwindPluginHandler;
}
