
  // this file is generated — do not edit it

  
  /// <reference types="vite/client" />
  
  interface ImportMetaEnv {
  readonly PUBLIC_SERVER_URL: string;
}
  
  declare module '$env/static/private' {
    export const DATABASE_URL: string;
    export const NODE_ENV: string;
    export const SESSION_SECRET: string;
}
  
  declare module '$env/static/public' {
    export const PUBLIC_SERVER_URL: string;
}
  