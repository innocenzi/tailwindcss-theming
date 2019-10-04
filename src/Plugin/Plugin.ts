import { PluginHelpers } from './PluginHelpers';

export type Plugin = (helpers: PluginHelpers) => void;
