interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  // Add other environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
