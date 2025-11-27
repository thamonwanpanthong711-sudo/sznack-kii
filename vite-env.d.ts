interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Augment the existing NodeJS namespace to include API_KEY in ProcessEnv.
// This allows strict typing for process.env.API_KEY without conflicting with @types/node.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
