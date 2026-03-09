declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface NextPWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp;
      handler: string;
      options?: {
        cacheName?: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
      };
    }>;
  }
  
  function withPWA(config: NextPWAConfig): (nextConfig: NextConfig) => NextConfig;
  
  export default withPWA;
}
