/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ensure process.env is typed for the client-side code.
// Using 'var' allows merging with existing global 'process' definitions (e.g. from @types/node)
// preventing "Cannot redeclare block-scoped variable" errors that occur with 'const'.
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: any;
  }
};