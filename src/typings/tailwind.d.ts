interface Helpers {
  addUtilities(...args: any[]): any;
  addComponents(...args: any[]): any;
  addBase(...args: any[]): any;
  addVariant(...args: any[]): any;
  e(...args: any[]): any;
  prefix(...args: any[]): any;
  theme(...args: any[]): any;
  variants(...args: any[]): any;
  config(...args: any[]): any;
}

type ConfigWrapperFunction = (helpers: any) => any;

interface Configuration {
  prefix: string;
  important: boolean;
  separator: string;
  theme: Partial<{
    colors:
      | ConfigWrapperFunction
      | {
          [name: string]: string | { [nested: string]: string };
        };
    [plugin: string]: ConfigWrapperFunction | any;
  }>;
}

/**
 * Adds typed interfaces to Tailwind
 */
declare module 'tailwindcss' {
  export interface Configuration extends Partial<Configuration> {}

  export interface TailwindPluginHelpers extends Helpers {}

  export type TailwindPluginHandler = (helpers: TailwindPluginHelpers) => void;

  export interface TailwindPlugin {
    config: any;
    handler: TailwindPluginHandler;
  }
}

/**
 * Adds types to the plugin API
 */
declare module 'tailwindcss/plugin' {
  const withOptions: (
    plugin: (options: any) => (helpers: Helpers) => void,
    config: (options: any) => Partial<Configuration>
  ) => {
    handler: (helpers: Helpers) => void;
    config: any;
  };
}
