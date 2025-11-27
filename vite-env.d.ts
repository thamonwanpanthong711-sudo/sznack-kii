interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Augment the existing NodeJS namespace (provided by @types/node)
// to ensure process.env.API_KEY is typed correctly.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}