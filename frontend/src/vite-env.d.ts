/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
  readonly VITE_BING_SITE_VERIFICATION?: string;
  readonly VITE_CLARITY_PROJECT_ID?: string;
  readonly VITE_HOTJAR_ID?: string;
  readonly VITE_HOTJAR_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
