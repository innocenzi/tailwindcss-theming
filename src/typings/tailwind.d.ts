declare module 'tailwindcss' {
  export interface TailwindPluginHelpers {
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

  export type TailwindPluginHandler = (helpers: TailwindPluginHelpers) => void;

  export interface TailwindPlugin {
    config: any;
    handler: TailwindPluginHandler;
  }
}
